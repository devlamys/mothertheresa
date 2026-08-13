CREATE TABLE `auth_users` (
  `id` text PRIMARY KEY NOT NULL,
  `email` text NOT NULL COLLATE NOCASE,
  `password_hash` text NOT NULL,
  `role` text DEFAULT 'student' NOT NULL CHECK (`role` IN ('student', 'counselor', 'admin')),
  `full_name` text NOT NULL,
  `phone` text,
  `target_country` text,
  `education_level` text,
  `status` text DEFAULT 'active' NOT NULL CHECK (`status` IN ('active', 'suspended')),
  `email_verified` integer DEFAULT 0 NOT NULL,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL,
  `last_login_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_auth_users_email` ON `auth_users` (`email`);
--> statement-breakpoint
CREATE INDEX `idx_auth_users_role_status` ON `auth_users` (`role`, `status`);
--> statement-breakpoint
CREATE TABLE `auth_sessions` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `expires_at` text NOT NULL,
  `created_at` text NOT NULL,
  `last_seen_at` text NOT NULL,
  `ip_hash` text,
  `user_agent_hash` text,
  FOREIGN KEY (`user_id`) REFERENCES `auth_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_auth_sessions_user` ON `auth_sessions` (`user_id`);
--> statement-breakpoint
CREATE INDEX `idx_auth_sessions_expiry` ON `auth_sessions` (`expires_at`);
--> statement-breakpoint
CREATE TABLE `auth_attempts` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `identifier_hash` text NOT NULL,
  `ip_hash` text NOT NULL,
  `success` integer DEFAULT 0 NOT NULL,
  `attempted_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_auth_attempts_identifier_time` ON `auth_attempts` (`identifier_hash`, `attempted_at`);
--> statement-breakpoint
CREATE INDEX `idx_auth_attempts_ip_time` ON `auth_attempts` (`ip_hash`, `attempted_at`);
--> statement-breakpoint
CREATE TABLE `auth_events` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `user_id` text,
  `event` text NOT NULL,
  `ip_hash` text,
  `created_at` text NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `auth_users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_auth_events_user_time` ON `auth_events` (`user_id`, `created_at`);
--> statement-breakpoint
PRAGMA optimize;
