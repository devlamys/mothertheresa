import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('auth_users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['student', 'counselor', 'admin'] }).notNull().default('student'),
  fullName: text('full_name').notNull(),
  phone: text('phone'),
  targetCountry: text('target_country'),
  educationLevel: text('education_level'),
  status: text('status', { enum: ['active', 'suspended'] }).notNull().default('active'),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  lastLoginAt: text('last_login_at'),
}, (table) => [uniqueIndex('idx_auth_users_email').on(table.email), index('idx_auth_users_role_status').on(table.role, table.status)]);

export const sessions = sqliteTable('auth_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').notNull(),
  lastSeenAt: text('last_seen_at').notNull(),
  ipHash: text('ip_hash'),
  userAgentHash: text('user_agent_hash'),
}, (table) => [index('idx_auth_sessions_user').on(table.userId), index('idx_auth_sessions_expiry').on(table.expiresAt)]);

export const authAttempts = sqliteTable('auth_attempts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  identifierHash: text('identifier_hash').notNull(),
  ipHash: text('ip_hash').notNull(),
  success: integer('success', { mode: 'boolean' }).notNull().default(false),
  attemptedAt: text('attempted_at').notNull(),
}, (table) => [index('idx_auth_attempts_identifier_time').on(table.identifierHash, table.attemptedAt), index('idx_auth_attempts_ip_time').on(table.ipHash, table.attemptedAt)]);

export const authEvents = sqliteTable('auth_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  event: text('event').notNull(),
  ipHash: text('ip_hash'),
  createdAt: text('created_at').notNull(),
}, (table) => [index('idx_auth_events_user_time').on(table.userId, table.createdAt)]);
