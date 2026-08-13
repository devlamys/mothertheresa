INSERT OR IGNORE INTO `auth_users` (
  `id`,
  `email`,
  `password_hash`,
  `role`,
  `full_name`,
  `phone`,
  `target_country`,
  `education_level`,
  `status`,
  `email_verified`,
  `created_at`,
  `updated_at`
) VALUES (
  'usr_admin_platform',
  'admin@mothertheresa.edu',
  'pbkdf2_sha256$100000$1cxKmTCG5LnCivR2lNMlLw$33kjeQJCpFggqdAgEM2Pqx0CK7sG-0OwWH7mp-eJtV0',
  'admin',
  'Platform Administrator',
  '+971 50 000 0001',
  'United Arab Emirates',
  'System Administration',
  'active',
  1,
  '2026-08-13T00:00:00.000Z',
  '2026-08-13T00:00:00.000Z'
);
--> statement-breakpoint
PRAGMA optimize;
