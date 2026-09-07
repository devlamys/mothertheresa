<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$resource = trim((string) ($_GET['resource'] ?? 'health'), '/');
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

try {
    if ($resource === 'health' && $method === 'GET') {
        $version = db()->query('SELECT VERSION()')->fetchColumn();
        respond(['status' => 'ok', 'service' => 'Mother Teresa ERP API', 'database' => 'connected', 'databaseVersion' => $version, 'time' => date(DATE_ATOM)]);
    }

    if ($resource === 'auth/csrf' && $method === 'GET') {
        respond(['csrfToken' => csrf_token(), 'user' => current_user()]);
    }

    if ($resource === 'auth/demo' && $method === 'POST') {
        if ((string) config_value('app_env', 'production') === 'production') {
            fail('Demo sign-in is disabled in production.', 403);
        }
        rate_limit('demo_login', 8, 300);
        session_regenerate_id(true);
        $_SESSION['user_id'] = 1;
        $statement = db()->prepare('UPDATE users SET last_login_at = NOW() WHERE id = 1');
        $statement->execute();
        record_activity(1, 'auth', 'demo_login', 'user', 1, 'Local staff demo session started.');
        respond(['user' => current_user(), 'csrfToken' => csrf_token()]);
    }

    if ($resource === 'auth/register' && $method === 'POST') {
        rate_limit('register', 5, 300);
        verify_csrf();
        $body = json_body();
        $name = clean_string($body['name'] ?? $body['fullName'] ?? null, 160);
        $email = strtolower((string) clean_string($body['email'] ?? null, 190));
        $password = (string) ($body['password'] ?? '');
        $mobile = clean_string($body['mobile'] ?? $body['phone'] ?? null, 40);

        if (!$name || !$email || !$password) {
            fail('Name, email, and password are required.', 422);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            fail('Please provide a valid email address.', 422);
        }
        if (strlen($password) < 6) {
            fail('Password must be at least 6 characters.', 422);
        }

        $existing = db()->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
        $existing->execute([$email]);
        if ($existing->fetch()) {
            fail('An account with this email address already exists. Please log in.', 409);
        }

        db()->beginTransaction();
        $passHash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = db()->prepare('INSERT INTO users (branch_id, name, email, phone, password_hash, status) VALUES (1, ?, ?, ?, ?, "active")');
        $stmt->execute([$name, $email, $mobile, $passHash]);
        $userId = (int) db()->lastInsertId();

        $roleStmt = db()->prepare('SELECT id FROM roles WHERE slug = "student" LIMIT 1');
        $roleStmt->execute();
        $roleId = (int) ($roleStmt->fetchColumn() ?: 10);

        db()->prepare('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)')->execute([$userId, $roleId]);

        $studentCode = sprintf('MTEGT-S-%s-%05d', date('Y'), $userId);
        $studentStmt = db()->prepare(
            'INSERT INTO students (student_code, branch_id, counselor_id, full_name, email, mobile, journey_stage, status)
             VALUES (?, 1, 1, ?, ?, ?, "Registered", "active")',
        );
        $studentStmt->execute([$studentCode, $name, $email, $mobile]);

        record_activity($userId, 'auth', 'register', 'user', $userId, 'New student account registered.');
        db()->commit();

        session_regenerate_id(true);
        $_SESSION['user_id'] = $userId;
        respond(['user' => current_user(), 'csrfToken' => csrf_token()], 201);
    }

    if ($resource === 'auth/login' && $method === 'POST') {
        rate_limit('login', 5, 300);
        verify_csrf();
        $body = json_body();
        $email = strtolower((string) clean_string($body['email'] ?? null, 190));
        $password = (string) ($body['password'] ?? '');
        $statement = db()->prepare('SELECT id, password_hash FROM users WHERE email = ? AND status = "active" LIMIT 1');
        $statement->execute([$email]);
        $record = $statement->fetch();
        if (!$record || !password_verify($password, $record['password_hash'])) {
            fail('Invalid email or password.', 401);
        }
        session_regenerate_id(true);
        $_SESSION['user_id'] = (int) $record['id'];
        db()->prepare('UPDATE users SET last_login_at = NOW() WHERE id = ?')->execute([$record['id']]);
        record_activity((int) $record['id'], 'auth', 'login', 'user', (int) $record['id'], 'Staff user signed in.');
        respond(['user' => current_user(), 'csrfToken' => csrf_token()]);
    }

    if ($resource === 'auth/logout' && $method === 'POST') {
        verify_csrf();
        $user = current_user();
        if ($user) {
            record_activity((int) $user['id'], 'auth', 'logout', 'user', (int) $user['id'], 'Staff user signed out.');
        }
        $_SESSION = [];
        session_destroy();
        respond(['signedOut' => true]);
    }

    if ($resource === 'auth/me' && $method === 'GET') {
        respond(['user' => require_user(), 'csrfToken' => csrf_token()]);
    }

    if ($resource === 'public/settings' && $method === 'GET') {
        $settings = db()->query('SELECT setting_key, setting_value, value_type FROM website_settings WHERE is_public = 1 ORDER BY setting_key')->fetchAll();
        respond(array_column($settings, 'setting_value', 'setting_key'));
    }

    if ($resource === 'public/cms/home' && $method === 'GET') {
        $statement = db()->query(
            'SELECT cs.content_json, cp.updated_at
             FROM cms_sections cs JOIN cms_pages cp ON cp.id = cs.page_id
             WHERE cp.slug = "home" AND cp.status = "published" AND cs.section_key = "landing_content" AND cs.is_enabled = 1 LIMIT 1',
        );
        $record = $statement->fetch();
        respond($record ? ['content' => json_decode($record['content_json'], true), 'updatedAt' => $record['updated_at']] : ['content' => null]);
    }

    if ($resource === 'leads' && $method === 'POST') {
        rate_limit('public_lead', 6, 600);
        $body = json_body();
        $name = clean_string($body['name'] ?? $body['fullName'] ?? null, 160);
        $email = strtolower((string) clean_string($body['email'] ?? null, 190));
        $phone = clean_string($body['phone'] ?? $body['mobile'] ?? null, 40);
        if (!$name || (!$email && !$phone)) {
            fail('Name and at least one contact method are required.', 422);
        }
        if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            fail('Please provide a valid email address.', 422);
        }
        $duplicate = db()->prepare('SELECT id, lead_code, full_name, status FROM leads WHERE (email = ? AND ? <> "") OR (mobile = ? AND ? <> "") ORDER BY id DESC LIMIT 1');
        $duplicate->execute([$email, $email, $phone, $phone]);
        if ($existing = $duplicate->fetch()) {
            respond(['created' => false, 'duplicate' => true, 'lead' => $existing, 'message' => 'An existing enquiry was found and can be followed up instead of duplicated.'], 200);
        }
        $source = db()->prepare('SELECT id FROM lead_sources WHERE slug = ? LIMIT 1');
        $source->execute([clean_string($body['source'] ?? 'website', 100) ?: 'website']);
        $sourceId = $source->fetchColumn() ?: 1;
        $temporaryCode = 'PENDING-' . bin2hex(random_bytes(12));
        db()->beginTransaction();
        $statement = db()->prepare(
            'INSERT INTO leads (lead_code, branch_id, source_id, assigned_user_id, full_name, mobile, whatsapp, email, preferred_country, preferred_course, preferred_intake, highest_qualification, status, notes, utm_source, utm_medium, utm_campaign, utm_content, utm_term, landing_page, referrer, device, first_visit_at)
             VALUES (?, 1, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, "New", ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        );
        $statement->execute([
            $temporaryCode,
            $sourceId,
            $name,
            $phone,
            clean_string($body['whatsapp'] ?? $phone, 40),
            $email ?: null,
            clean_string($body['targetCountry'] ?? $body['preferredCountry'] ?? null, 100),
            clean_string($body['course'] ?? $body['preferredCourse'] ?? null, 190),
            clean_string($body['intake'] ?? $body['preferredIntake'] ?? null, 100),
            clean_string($body['educationLevel'] ?? $body['studyLevel'] ?? null, 160),
            clean_string($body['message'] ?? $body['notes'] ?? null, 2000),
            clean_string($body['utm_source'] ?? null, 120),
            clean_string($body['utm_medium'] ?? null, 120),
            clean_string($body['utm_campaign'] ?? null, 160),
            clean_string($body['utm_content'] ?? null, 160),
            clean_string($body['utm_term'] ?? null, 160),
            clean_string($body['landingPage'] ?? null, 255),
            clean_string($body['referrer'] ?? null, 255),
            clean_string($body['device'] ?? ($_SERVER['HTTP_USER_AGENT'] ?? null), 120),
        ]);
        $leadId = (int) db()->lastInsertId();
        $leadCode = sprintf('MTEGT-L-%s-%05d', date('Y'), $leadId);
        db()->prepare('UPDATE leads SET lead_code = ? WHERE id = ?')->execute([$leadCode, $leadId]);
        db()->prepare('INSERT INTO lead_status_history (lead_id, from_status, to_status, changed_by, notes) VALUES (?, NULL, "New", 1, "Website enquiry created.")')->execute([$leadId]);
        db()->prepare('INSERT INTO form_submissions (form_key, lead_id, payload_json, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)')->execute([
            clean_string($body['formKey'] ?? 'general-enquiry', 120),
            $leadId,
            json_encode($body, JSON_UNESCAPED_UNICODE),
            $_SERVER['REMOTE_ADDR'] ?? null,
            mb_substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255),
        ]);
        $appointment = null;
        $preferredDate = clean_string($body['preferredDate'] ?? null, 10);
        $preferredTime = clean_string($body['preferredTime'] ?? null, 5);
        if ($preferredDate && $preferredTime && preg_match('/^\d{4}-\d{2}-\d{2}$/', $preferredDate) && preg_match('/^\d{2}:\d{2}$/', $preferredTime)) {
            $startsAt = $preferredDate . ' ' . $preferredTime . ':00';
            $appointmentStatement = db()->prepare('INSERT INTO appointments (lead_id, staff_id, type, starts_at, mode, status, notes) VALUES (?, 1, "Counselling", ?, "Phone / Video call", "confirmed", ?)');
            $appointmentStatement->execute([$leadId, $startsAt, clean_string($body['enquiryType'] ?? 'Study counseling', 200)]);
            $appointment = ['id' => (int) db()->lastInsertId(), 'startsAt' => $startsAt, 'status' => 'confirmed'];
        }
        record_activity(null, 'leads', 'create', 'lead', $leadId, "Website enquiry {$leadCode} created and assigned to the Dubai branch.", null, ['status' => 'New', 'source' => 'Website']);
        db()->commit();
        respond(['created' => true, 'duplicate' => false, 'lead' => ['id' => $leadId, 'leadCode' => $leadCode, 'status' => 'New'], 'appointment' => $appointment], 201);
    }

    if ($resource === 'dashboard' && $method === 'GET') {
        require_permission('dashboard.view');
        $pdo = db();
        $metrics = [
            'totalLeads' => (int) $pdo->query('SELECT COUNT(*) FROM leads')->fetchColumn(),
            'newLeads' => (int) $pdo->query('SELECT COUNT(*) FROM leads WHERE status = "New"')->fetchColumn(),
            'activeStudents' => (int) $pdo->query('SELECT COUNT(*) FROM students WHERE status = "active"')->fetchColumn(),
            'applications' => (int) $pdo->query('SELECT COUNT(*) FROM applications')->fetchColumn(),
            'offersReceived' => (int) $pdo->query('SELECT COUNT(*) FROM offers')->fetchColumn(),
            'visaApproved' => (int) $pdo->query('SELECT COUNT(*) FROM visas WHERE status = "Approved"')->fetchColumn(),
            'revenue' => (float) $pdo->query('SELECT COALESCE(SUM(amount), 0) FROM payments')->fetchColumn(),
            'outstanding' => (float) $pdo->query('SELECT COALESCE(SUM(total - paid), 0) FROM invoices WHERE status NOT IN ("paid","cancelled")')->fetchColumn(),
        ];
        $metrics['conversionRate'] = $metrics['totalLeads'] ? round(($metrics['activeStudents'] / $metrics['totalLeads']) * 100, 1) : 0;
        $leadStages = $pdo->query('SELECT status, COUNT(*) AS total FROM leads GROUP BY status ORDER BY total DESC')->fetchAll();
        $destinations = $pdo->query('SELECT COALESCE(preferred_country, "Not decided") AS country, COUNT(*) AS total FROM leads GROUP BY preferred_country ORDER BY total DESC')->fetchAll();
        $sources = $pdo->query('SELECT ls.name, COUNT(l.id) AS total FROM lead_sources ls LEFT JOIN leads l ON l.source_id = ls.id GROUP BY ls.id ORDER BY total DESC LIMIT 8')->fetchAll();
        $upcoming = $pdo->query('SELECT f.id, f.followup_at, f.type, f.status, l.full_name AS lead_name, l.preferred_country FROM followups f JOIN leads l ON l.id = f.lead_id WHERE f.status = "pending" ORDER BY f.followup_at LIMIT 6')->fetchAll();
        $activities = $pdo->query('SELECT al.id, al.module, al.action, al.description, al.created_at, u.name AS user_name FROM activity_logs al LEFT JOIN users u ON u.id = al.user_id ORDER BY al.created_at DESC LIMIT 8')->fetchAll();
        respond(compact('metrics', 'leadStages', 'destinations', 'sources', 'upcoming', 'activities'));
    }

    if ($resource === 'leads' && $method === 'GET') {
        require_permission('leads.view');
        $search = clean_string($_GET['search'] ?? null, 160) ?? '';
        $status = clean_string($_GET['status'] ?? null, 80) ?? '';
        $statement = db()->prepare(
            'SELECT l.id, l.lead_code, l.full_name, l.mobile, l.whatsapp, l.email, l.preferred_country, l.preferred_course, l.preferred_intake, l.priority, l.status, l.created_at, ls.name AS source, u.name AS counselor, b.name AS branch
             FROM leads l
             LEFT JOIN lead_sources ls ON ls.id = l.source_id
             LEFT JOIN users u ON u.id = l.assigned_user_id
             LEFT JOIN branches b ON b.id = l.branch_id
             WHERE (? = "" OR l.full_name LIKE CONCAT("%", ?, "%") OR l.email LIKE CONCAT("%", ?, "%") OR l.mobile LIKE CONCAT("%", ?, "%"))
               AND (? = "" OR l.status = ?)
             ORDER BY l.created_at DESC LIMIT 200',
        );
        $statement->execute([$search, $search, $search, $search, $status, $status]);
        respond($statement->fetchAll());
    }

    if (preg_match('/^leads\/(\d+)\/status$/', $resource, $matches) && $method === 'PATCH') {
        $user = require_permission('leads.edit');
        verify_csrf();
        $leadId = (int) $matches[1];
        $body = json_body();
        $newStatus = clean_string($body['status'] ?? null, 80);
        $allowed = ['New','Attempted Contact','Contacted','Counselling Scheduled','Counselling Completed','Interested','Follow-up','Registration Pending','Registered','Application Started','Converted','Lost'];
        if (!$newStatus || !in_array($newStatus, $allowed, true)) {
            fail('Select a valid lead stage.', 422);
        }
        $select = db()->prepare('SELECT status, full_name FROM leads WHERE id = ? LIMIT 1');
        $select->execute([$leadId]);
        $lead = $select->fetch();
        if (!$lead) {
            fail('Lead not found.', 404);
        }
        if ($newStatus === 'Lost' && !clean_string($body['lostReason'] ?? null, 160)) {
            fail('A lost reason is required.', 422);
        }
        db()->beginTransaction();
        db()->prepare('UPDATE leads SET status = ?, lost_reason = ?, updated_at = NOW() WHERE id = ?')->execute([$newStatus, clean_string($body['lostReason'] ?? null, 160), $leadId]);
        db()->prepare('INSERT INTO lead_status_history (lead_id, from_status, to_status, changed_by, notes) VALUES (?, ?, ?, ?, ?)')->execute([$leadId, $lead['status'], $newStatus, $user['id'], clean_string($body['notes'] ?? null, 2000)]);
        record_activity((int) $user['id'], 'leads', 'status_change', 'lead', $leadId, "{$user['name']} changed {$lead['full_name']} from {$lead['status']} to {$newStatus}.", ['status' => $lead['status']], ['status' => $newStatus]);
        db()->commit();
        respond(['id' => $leadId, 'status' => $newStatus]);
    }

    if ($resource === 'students' && $method === 'GET') {
        require_permission('students.view');
        $rows = db()->query('SELECT s.id, s.student_code, s.full_name, s.email, s.mobile, s.preferred_country, s.preferred_course, s.intake, s.journey_stage, s.status, u.name AS counselor, b.name AS branch, COUNT(a.id) AS applications FROM students s LEFT JOIN users u ON u.id = s.counselor_id LEFT JOIN branches b ON b.id = s.branch_id LEFT JOIN applications a ON a.student_id = s.id GROUP BY s.id ORDER BY s.created_at DESC')->fetchAll();
        respond($rows);
    }

    if ($resource === 'applications' && $method === 'GET') {
        require_permission('applications.view');
        $rows = db()->query('SELECT a.id, a.application_code, a.status, a.submission_date, a.application_fee, s.full_name AS student_name, s.student_code, u.name AS university_name, c.name AS course_name, i.name AS intake FROM applications a JOIN students s ON s.id = a.student_id JOIN universities u ON u.id = a.university_id LEFT JOIN courses c ON c.id = a.course_id LEFT JOIN intakes i ON i.id = a.intake_id ORDER BY a.updated_at DESC')->fetchAll();
        respond($rows);
    }

    if ($resource === 'tasks' && $method === 'GET') {
        require_permission('tasks.view');
        $rows = db()->query('SELECT t.id, t.title, t.description, t.priority, t.due_at, t.status, t.related_type, t.related_id, u.name AS assignee FROM tasks t LEFT JOIN users u ON u.id = t.assigned_user_id ORDER BY FIELD(t.status, "overdue", "pending", "in_progress", "completed"), t.due_at')->fetchAll();
        respond($rows);
    }

    if ($resource === 'operations' && $method === 'GET') {
        require_permission('documents.view');
        $pdo = db();
        $documentSummary = $pdo->query('SELECT verification_status AS status, COUNT(*) AS total FROM documents GROUP BY verification_status')->fetchAll();
        $visas = $pdo->query('SELECT v.id, v.visa_type, v.status, v.application_date, v.appointment_date, s.full_name AS student_name, s.student_code, c.name AS country FROM visas v JOIN students s ON s.id = v.student_id LEFT JOIN countries c ON c.id = v.country_id ORDER BY v.id DESC')->fetchAll();
        $invoices = $pdo->query('SELECT i.id, i.invoice_number, i.issue_date, i.due_date, i.total, i.paid, (i.total - i.paid) AS outstanding, i.status, s.full_name AS student_name FROM invoices i JOIN students s ON s.id = i.student_id ORDER BY i.issue_date DESC LIMIT 20')->fetchAll();
        $payments = $pdo->query('SELECT p.id, p.receipt_number, p.amount, p.currency, p.payment_method, p.paid_at, s.full_name AS student_name FROM payments p JOIN students s ON s.id = p.student_id ORDER BY p.paid_at DESC LIMIT 20')->fetchAll();
        respond(compact('documentSummary', 'visas', 'invoices', 'payments'));
    }

    if ($resource === 'cms/home' && $method === 'PUT') {
        $user = require_permission('cms.publish');
        verify_csrf();
        $body = json_body();
        $content = $body['content'] ?? null;
        if (!is_array($content) || empty($content['hero']) || empty($content['destinations'])) {
            fail('The homepage content structure is incomplete.', 422);
        }
        $pageId = (int) db()->query('SELECT id FROM cms_pages WHERE slug = "home" LIMIT 1')->fetchColumn();
        $statement = db()->prepare(
            'INSERT INTO cms_sections (page_id, section_key, section_type, position, content_json, is_enabled)
             VALUES (?, "landing_content", "homepage_builder", 1, ?, 1)
             ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), is_enabled = 1, updated_at = NOW()',
        );
        $statement->execute([$pageId, json_encode($content, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)]);
        db()->prepare('UPDATE cms_pages SET updated_by = ?, status = "published", published_at = NOW() WHERE id = ?')->execute([$user['id'], $pageId]);
        record_activity((int) $user['id'], 'cms', 'publish', 'cms_page', $pageId, "{$user['name']} published homepage content.");
        respond(['published' => true, 'updatedAt' => date(DATE_ATOM)]);
    }

    if ($resource === 'roles' && $method === 'GET') {
        require_permission('users.view');
        $roles = db()->query('SELECT r.id, r.name, r.slug, r.description, COUNT(DISTINCT ur.user_id) AS users, COUNT(DISTINCT rp.permission_id) AS permissions FROM roles r LEFT JOIN user_roles ur ON ur.role_id = r.id LEFT JOIN role_permissions rp ON rp.role_id = r.id GROUP BY r.id ORDER BY r.id')->fetchAll();
        respond($roles);
    }

    fail('API route not found.', 404);
} catch (PDOException $exception) {
    error_log($exception->getMessage());
    fail('A database operation failed.', 500);
} catch (Throwable $exception) {
    error_log($exception->getMessage());
    fail('The request could not be completed.', 500);
}
