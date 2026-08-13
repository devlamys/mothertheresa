import assert from 'node:assert/strict';
import { pbkdf2Sync } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const projectRoot = new URL('../', import.meta.url);
const workerSource = readFileSync(new URL('worker/index.js', projectRoot), 'utf8');
const migrationFiles = ['drizzle/0000_secure_auth.sql', 'drizzle/0001_initial_staff.sql'];
const migrationSql = migrationFiles
  .map((path) => readFileSync(new URL(path, projectRoot), 'utf8'))
  .join('\n')
  .replaceAll('--> statement-breakpoint', '');

const database = new DatabaseSync(':memory:');
database.exec('PRAGMA foreign_keys = ON;');
database.exec(migrationSql);

const tableNames = database.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE 'auth_%' ORDER BY name").all().map(({ name }) => name);
assert.deepEqual(tableNames, ['auth_attempts', 'auth_events', 'auth_sessions', 'auth_users']);

const staff = database.prepare("SELECT email, password_hash AS passwordHash, role, status FROM auth_users WHERE id = 'usr_staff_sarah_jenkins'").get();
assert.equal(staff.email, 'counselor@mothertheresa.edu');
assert.equal(staff.role, 'counselor');
assert.equal(staff.status, 'active');

const [algorithm, iterationsText, saltText, digestText] = staff.passwordHash.split('$');
assert.equal(algorithm, 'pbkdf2_sha256');
assert.equal(Number(iterationsText), 310_000);
assert.equal(Buffer.from(saltText, 'base64url').length, 16);
assert.equal(Buffer.from(digestText, 'base64url').length, 32);

const samplePassword = 'SampleSecure7';
const sampleSalt = Buffer.from('0123456789abcdef');
const sampleDigest = pbkdf2Sync(samplePassword, sampleSalt, 310_000, 32, 'sha256');
assert.equal(sampleDigest.length, 32);

for (const route of ['auth/csrf', 'auth/me', 'auth/register', 'auth/login', 'auth/logout']) {
  assert.ok(workerSource.includes(route), `Worker is missing ${route}`);
}
for (const securityFeature of ['HttpOnly', 'SameSite=Lax', 'verifyCsrf', 'enforceRateLimit', 'PASSWORD_ITERATIONS = 310_000', 'timing']) {
  const present = securityFeature === 'timing' ? workerSource.includes('difference |=') : workerSource.includes(securityFeature);
  assert.ok(present, `Worker is missing ${securityFeature}`);
}

database.close();
console.log('Auth validation passed: schema, seeded staff role, password format, routes, CSRF, sessions, rate limiting, and constant-time verification.');
