<?php

declare(strict_types=1);

$localConfigPath = __DIR__ . '/config.local.php';
$localConfig = file_exists($localConfigPath) ? require $localConfigPath : [];

function config_value(string $key, mixed $default = null): mixed
{
    global $localConfig;
    $envKey = strtoupper($key);
    $envValue = getenv($envKey);
    if ($envValue !== false) {
        return $envValue;
    }
    return $localConfig[$key] ?? $default;
}

$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
session_name('mtegt_erp_session');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $isHttps,
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Cache-Control: no-store');

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = (string) config_value('db_host', '127.0.0.1');
    $port = (string) config_value('db_port', '3306');
    $name = (string) config_value('db_name', 'mother_teresa_erp');
    $user = (string) config_value('db_user', 'mtegt_app');
    $pass = (string) config_value('db_pass', '');

    $pdo = new PDO(
        "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ],
    );

    return $pdo;
}

function respond(mixed $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode(['data' => $data], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(string $message, int $status = 400, array $errors = []): never
{
    http_response_code($status);
    echo json_encode(['error' => ['message' => $message, 'details' => $errors]], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        fail('The request body must be valid JSON.', 422);
    }
    return $decoded;
}

function clean_string(mixed $value, int $maxLength = 255): ?string
{
    if ($value === null) {
        return null;
    }
    $cleaned = trim(strip_tags((string) $value));
    return $cleaned === '' ? null : mb_substr($cleaned, 0, $maxLength);
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf(): void
{
    $provided = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if ($provided === '' || !hash_equals(csrf_token(), $provided)) {
        fail('The security token is missing or expired. Refresh and try again.', 403);
    }
}

function current_user(): ?array
{
    if (empty($_SESSION['user_id'])) {
        return null;
    }
    $statement = db()->prepare(
        'SELECT u.id, u.name, u.email, u.branch_id, b.name AS branch_name
         FROM users u LEFT JOIN branches b ON b.id = u.branch_id
         WHERE u.id = ? AND u.status = "active" LIMIT 1',
    );
    $statement->execute([(int) $_SESSION['user_id']]);
    $user = $statement->fetch();
    if (!$user) {
        return null;
    }
    $roles = db()->prepare('SELECT r.slug FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = ?');
    $roles->execute([$user['id']]);
    $user['roles'] = array_column($roles->fetchAll(), 'slug');
    return $user;
}

function require_user(): array
{
    $user = current_user();
    if (!$user) {
        fail('Authentication is required.', 401);
    }
    return $user;
}

function has_permission(int $userId, string $permission): bool
{
    $statement = db()->prepare(
        'SELECT 1 FROM permissions p
         JOIN role_permissions rp ON rp.permission_id = p.id
         JOIN user_roles ur ON ur.role_id = rp.role_id
         WHERE ur.user_id = ? AND p.slug = ? LIMIT 1',
    );
    $statement->execute([$userId, $permission]);
    return (bool) $statement->fetchColumn();
}

function require_permission(string $permission): array
{
    $user = require_user();
    if (!has_permission((int) $user['id'], $permission)) {
        fail('You do not have permission to perform this action.', 403);
    }
    return $user;
}

function rate_limit(string $bucket, int $limit, int $windowSeconds): void
{
    $now = time();
    $key = 'rate_' . $bucket;
    $attempts = $_SESSION[$key] ?? [];
    $attempts = array_values(array_filter($attempts, static fn (int $time): bool => $time > $now - $windowSeconds));
    if (count($attempts) >= $limit) {
        fail('Too many requests. Please wait before trying again.', 429);
    }
    $attempts[] = $now;
    $_SESSION[$key] = $attempts;
}

function record_activity(?int $userId, string $module, string $action, ?string $recordType, ?int $recordId, string $description, ?array $oldValues = null, ?array $newValues = null): void
{
    $statement = db()->prepare(
        'INSERT INTO activity_logs (user_id, module, action, record_type, record_id, description, old_values, new_values, ip_address, device)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    );
    $statement->execute([
        $userId,
        $module,
        $action,
        $recordType,
        $recordId,
        $description,
        $oldValues ? json_encode($oldValues, JSON_UNESCAPED_UNICODE) : null,
        $newValues ? json_encode($newValues, JSON_UNESCAPED_UNICODE) : null,
        $_SERVER['REMOTE_ADDR'] ?? null,
        mb_substr($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown device', 0, 255),
    ]);
}

function next_reference(string $prefix, string $table, string $column): string
{
    $year = date('Y');
    $count = (int) db()->query("SELECT COUNT(*) FROM {$table}")->fetchColumn() + 1;
    return sprintf('%s-%s-%05d', $prefix, $year, $count);
}
