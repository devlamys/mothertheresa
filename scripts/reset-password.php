<?php

declare(strict_types=1);

require __DIR__ . '/../api/bootstrap.php';

if (php_sapi_name() !== 'cli') {
    die("This script can only be run from the command line.\n");
}

if ($argc < 3) {
    echo "Usage: php reset-password.php <email> <new_password>\n";
    exit(1);
}

$email = strtolower(trim($argv[1]));
$newPassword = $argv[2];

try {
    $statement = db()->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $statement->execute([$email]);
    $user = $statement->fetch();

    if (!$user) {
        echo "Error: No user found with email '{$email}'.\n";
        exit(1);
    }

    $hash = password_hash($newPassword, PASSWORD_DEFAULT);
    
    $update = db()->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    $update->execute([$hash, $user['id']]);

    echo "Success: Password has been reset for user '{$email}'.\n";
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage() . "\n";
    echo "Did you configure the database connection in api/config.local.php?\n";
    exit(1);
}
