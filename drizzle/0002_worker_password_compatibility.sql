UPDATE `auth_users`
SET
  `password_hash` = 'pbkdf2_sha256$100000$wfsu3MBJ5-Bi2WAonyNIaA$zQ1Y3DLseg9iQzjgDUULtusECFbQPl_DozbDESsyavQ',
  `updated_at` = '2026-08-13T00:00:00.000Z'
WHERE
  `id` = 'usr_staff_sarah_jenkins'
  AND `password_hash` = 'pbkdf2_sha256$310000$bqxIHA0fv2kHvh9yanQX0A$t4raJYEYL1qDLZgxXmAJPdEs6dgg3Jpb5VndlQKdQDQ';
--> statement-breakpoint
PRAGMA optimize;
