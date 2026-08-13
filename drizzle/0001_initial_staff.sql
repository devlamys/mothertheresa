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
  'usr_staff_sarah_jenkins',
  'counselor@mothertheresa.edu',
  'pbkdf2_sha256$310000$bqxIHA0fv2kHvh9yanQX0A$t4raJYEYL1qDLZgxXmAJPdEs6dgg3Jpb5VndlQKdQDQ',
  'counselor',
  'Dr. Sarah Jenkins',
  '+971 50 000 0000',
  'United Arab Emirates',
  'Admissions Counselor',
  'active',
  1,
  '2026-08-13T00:00:00.000Z',
  '2026-08-13T00:00:00.000Z'
);
--> statement-breakpoint
PRAGMA optimize;
