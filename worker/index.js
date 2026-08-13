const encoder = new TextEncoder();
const SESSION_COOKIE = 'mt_session';
const CSRF_COOKIE = 'mt_csrf';
const PASSWORD_ITERATIONS = 100_000;
const DUMMY_PASSWORD_HASH = 'pbkdf2_sha256$100000$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
let schemaInitialization = null;

const ensureAuthSchema = async (db) => {
  if (!schemaInitialization) {
    const initializedAt = new Date().toISOString();
    schemaInitialization = db.batch([
      db.prepare("CREATE TABLE IF NOT EXISTS auth_users (id TEXT PRIMARY KEY NOT NULL, email TEXT NOT NULL COLLATE NOCASE, password_hash TEXT NOT NULL, role TEXT DEFAULT 'student' NOT NULL CHECK (role IN ('student', 'counselor', 'admin')), full_name TEXT NOT NULL, phone TEXT, target_country TEXT, education_level TEXT, status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'suspended')), email_verified INTEGER DEFAULT 0 NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, last_login_at TEXT)"),
      db.prepare('CREATE UNIQUE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users (email)'),
      db.prepare('CREATE INDEX IF NOT EXISTS idx_auth_users_role_status ON auth_users (role, status)'),
      db.prepare('CREATE TABLE IF NOT EXISTS auth_sessions (id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL, expires_at TEXT NOT NULL, created_at TEXT NOT NULL, last_seen_at TEXT NOT NULL, ip_hash TEXT, user_agent_hash TEXT, FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE)'),
      db.prepare('CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions (user_id)'),
      db.prepare('CREATE INDEX IF NOT EXISTS idx_auth_sessions_expiry ON auth_sessions (expires_at)'),
      db.prepare('CREATE TABLE IF NOT EXISTS auth_attempts (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, identifier_hash TEXT NOT NULL, ip_hash TEXT NOT NULL, success INTEGER DEFAULT 0 NOT NULL, attempted_at TEXT NOT NULL)'),
      db.prepare('CREATE INDEX IF NOT EXISTS idx_auth_attempts_identifier_time ON auth_attempts (identifier_hash, attempted_at)'),
      db.prepare('CREATE INDEX IF NOT EXISTS idx_auth_attempts_ip_time ON auth_attempts (ip_hash, attempted_at)'),
      db.prepare('CREATE TABLE IF NOT EXISTS auth_events (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id TEXT, event TEXT NOT NULL, ip_hash TEXT, created_at TEXT NOT NULL, FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE SET NULL)'),
      db.prepare('CREATE INDEX IF NOT EXISTS idx_auth_events_user_time ON auth_events (user_id, created_at)'),
      db.prepare("INSERT OR IGNORE INTO auth_users (id, email, password_hash, role, full_name, phone, target_country, education_level, status, email_verified, created_at, updated_at) VALUES ('usr_staff_sarah_jenkins', 'counselor@mothertheresa.edu', 'pbkdf2_sha256$100000$wfsu3MBJ5-Bi2WAonyNIaA$zQ1Y3DLseg9iQzjgDUULtusECFbQPl_DozbDESsyavQ', 'counselor', 'Dr. Sarah Jenkins', '+971 50 000 0000', 'United Arab Emirates', 'Admissions Counselor', 'active', 1, ?, ?)").bind(initializedAt, initializedAt),
      db.prepare("UPDATE auth_users SET password_hash = 'pbkdf2_sha256$100000$wfsu3MBJ5-Bi2WAonyNIaA$zQ1Y3DLseg9iQzjgDUULtusECFbQPl_DozbDESsyavQ', updated_at = ? WHERE id = 'usr_staff_sarah_jenkins' AND password_hash = 'pbkdf2_sha256$310000$bqxIHA0fv2kHvh9yanQX0A$t4raJYEYL1qDLZgxXmAJPdEs6dgg3Jpb5VndlQKdQDQ'").bind(initializedAt),
    ]).catch((error) => {
      schemaInitialization = null;
      throw error;
    });
  }
  return schemaInitialization;
};

const base64Url = (bytes) => {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '');
};

const fromBase64Url = (value) => {
  const padded = value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const randomToken = (size = 32) => {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
};

const sha256 = async (value) => base64Url(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value))));

const hashPassword = async (password) => {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const derived = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: PASSWORD_ITERATIONS }, key, 256));
  return `pbkdf2_sha256$${PASSWORD_ITERATIONS}$${base64Url(salt)}$${base64Url(derived)}`;
};

const verifyPassword = async (password, storedHash) => {
  const [algorithm, iterationText, saltText, expectedText] = String(storedHash || DUMMY_PASSWORD_HASH).split('$');
  if (algorithm !== 'pbkdf2_sha256' || !saltText || !expectedText) return false;
  const iterations = Number(iterationText);
  if (!Number.isInteger(iterations) || iterations < 100_000 || iterations > 600_000) return false;
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const actual = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: fromBase64Url(saltText), iterations }, key, 256));
  const expected = fromBase64Url(expectedText);
  if (actual.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) difference |= actual[index] ^ expected[index];
  return difference === 0;
};

const securityHeaders = {
  'Cache-Control': 'no-store',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

const json = (data, status = 200, cookies = []) => {
  const headers = new Headers({ ...securityHeaders, 'Content-Type': 'application/json; charset=utf-8' });
  for (const cookie of cookies) headers.append('Set-Cookie', cookie);
  return new Response(JSON.stringify(status >= 400 ? { error: data } : { data }), { status, headers });
};

const fail = (message, status = 400, details) => json({ message, ...(details ? { details } : {}) }, status);

const parseCookies = (request) => Object.fromEntries((request.headers.get('Cookie') || '').split(';').map((part) => part.trim()).filter(Boolean).map((part) => {
  const separator = part.indexOf('=');
  return separator === -1 ? [part, ''] : [part.slice(0, separator), decodeURIComponent(part.slice(separator + 1))];
}));

const makeCookie = (name, value, maxAge, request, httpOnly = true) => {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}${httpOnly ? '; HttpOnly' : ''}`;
};

const expireCookie = (name, request) => makeCookie(name, '', 0, request);

const readBody = async (request) => {
  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > 16_384) throw new Error('Request body is too large.');
  return request.json().catch(() => { throw new Error('Please send valid form data.'); });
};

const cleanText = (value, maxLength) => Array.from(String(value || ''))
  .filter((character) => character.codePointAt(0) >= 32 && character.codePointAt(0) !== 127)
  .join('')
  .trim()
  .slice(0, maxLength);
const normalizeEmail = (value) => cleanText(value, 190).toLowerCase();
const emailIsValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value);
const passwordIsStrong = (value) => value.length >= 8 && /[a-z]/u.test(value) && /[A-Z]/u.test(value) && /\d/u.test(value);

const ensureSameOrigin = (request) => {
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) throw new Error('Cross-site request rejected.');
};

const verifyCsrf = (request) => {
  ensureSameOrigin(request);
  const cookieToken = parseCookies(request)[CSRF_COOKIE];
  const headerToken = request.headers.get('X-CSRF-Token');
  if (!cookieToken || !headerToken || cookieToken !== headerToken) throw new Error('Your secure session expired. Please try again.');
};

const requestFingerprint = async (request) => {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  return {
    ipHash: await sha256(ip),
    userAgentHash: await sha256(request.headers.get('User-Agent') || 'unknown'),
  };
};

const publicUser = (record) => ({
  id: record.id,
  name: record.full_name,
  email: record.email,
  phone: record.phone || '',
  role: record.role,
  targetCountry: record.target_country || 'Not decided yet',
  educationLevel: record.education_level || 'Not specified',
  emailVerified: Boolean(record.email_verified),
});

const recordAttempt = async (db, identifierHash, ipHash, success) => db.prepare('INSERT INTO auth_attempts (identifier_hash, ip_hash, success, attempted_at) VALUES (?, ?, ?, ?)').bind(identifierHash, ipHash, success ? 1 : 0, new Date().toISOString()).run();

const enforceRateLimit = async (db, identifierHash, ipHash) => {
  const result = await db.prepare("SELECT COUNT(*) AS total FROM auth_attempts WHERE success = 0 AND datetime(attempted_at) >= datetime('now', '-15 minutes') AND (identifier_hash = ? OR ip_hash = ?)").bind(identifierHash, ipHash).first();
  if (Number(result?.total || 0) >= 10) {
    const error = new Error('Too many sign-in attempts. Please wait 15 minutes and try again.');
    error.status = 429;
    throw error;
  }
};

const createSession = async (db, request, userId, rememberMe) => {
  const rawToken = randomToken();
  const tokenHash = await sha256(rawToken);
  const now = new Date();
  const lifetimeSeconds = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;
  const expiresAt = new Date(now.getTime() + lifetimeSeconds * 1000).toISOString();
  const { ipHash, userAgentHash } = await requestFingerprint(request);
  await db.batch([
    db.prepare('INSERT INTO auth_sessions (id, user_id, expires_at, created_at, last_seen_at, ip_hash, user_agent_hash) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(tokenHash, userId, expiresAt, now.toISOString(), now.toISOString(), ipHash, userAgentHash),
    db.prepare("DELETE FROM auth_sessions WHERE datetime(expires_at) <= datetime('now')"),
    db.prepare("DELETE FROM auth_attempts WHERE datetime(attempted_at) < datetime('now', '-2 days')"),
  ]);
  return { rawToken, lifetimeSeconds };
};

const getSessionUser = async (db, request) => {
  const rawToken = parseCookies(request)[SESSION_COOKIE];
  if (!rawToken) return null;
  const tokenHash = await sha256(rawToken);
  const record = await db.prepare("SELECT u.*, s.id AS session_id FROM auth_sessions s JOIN auth_users u ON u.id = s.user_id WHERE s.id = ? AND datetime(s.expires_at) > datetime('now') AND u.status = 'active' LIMIT 1").bind(tokenHash).first();
  if (!record) return null;
  db.prepare('UPDATE auth_sessions SET last_seen_at = ? WHERE id = ?').bind(new Date().toISOString(), tokenHash).run().catch(() => null);
  return record;
};

const handleAuth = async (request, env, resource) => {
  if (!env.DB) return fail('Account storage is not configured.', 503);
  await ensureAuthSchema(env.DB);
  const method = request.method.toUpperCase();

  if (resource === 'auth/csrf' && method === 'GET') {
    const token = randomToken(24);
    return json({ csrfToken: token }, 200, [makeCookie(CSRF_COOKIE, token, 3600, request)]);
  }

  if (resource === 'auth/me' && method === 'GET') {
    const user = await getSessionUser(env.DB, request);
    return json({ authenticated: Boolean(user), user: user ? publicUser(user) : null });
  }

  if (resource === 'auth/register' && method === 'POST') {
    verifyCsrf(request);
    const body = await readBody(request);
    const email = normalizeEmail(body.email);
    const fullName = cleanText(body.name, 120);
    const phone = cleanText(body.phone, 40);
    const password = String(body.password || '');
    const targetCountry = cleanText(body.targetCountry, 80);
    const educationLevel = cleanText(body.educationLevel, 100);
    const rememberMe = Boolean(body.rememberMe);
    if (fullName.length < 2) return fail('Please enter your full name.');
    if (!emailIsValid(email)) return fail('Please enter a valid email address.');
    if (phone.length < 6) return fail('Please enter a valid phone or WhatsApp number.');
    if (!passwordIsStrong(password)) return fail('Use at least 8 characters with uppercase, lowercase, and a number.');

    const { ipHash } = await requestFingerprint(request);
    const identifierHash = await sha256(email);
    await enforceRateLimit(env.DB, identifierHash, ipHash);
    const existing = await env.DB.prepare('SELECT id FROM auth_users WHERE email = ? LIMIT 1').bind(email).first();
    if (existing) {
      await recordAttempt(env.DB, identifierHash, ipHash, false);
      return fail('An account already exists for this email. Sign in instead.', 409);
    }

    const id = `usr_${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    const passwordHash = await hashPassword(password);
    try {
      await env.DB.batch([
        env.DB.prepare("INSERT INTO auth_users (id, email, password_hash, role, full_name, phone, target_country, education_level, status, email_verified, created_at, updated_at) VALUES (?, ?, ?, 'student', ?, ?, ?, ?, 'active', 0, ?, ?)").bind(id, email, passwordHash, fullName, phone, targetCountry, educationLevel, now, now),
        env.DB.prepare("INSERT INTO auth_events (user_id, event, ip_hash, created_at) VALUES (?, 'registered', ?, ?)").bind(id, ipHash, now),
      ]);
    } catch (error) {
      if (/unique|constraint/iu.test(error.message || '')) return fail('An account already exists for this email. Sign in instead.', 409);
      throw error;
    }
    await recordAttempt(env.DB, identifierHash, ipHash, true);
    const session = await createSession(env.DB, request, id, rememberMe);
    const user = await env.DB.prepare('SELECT * FROM auth_users WHERE id = ?').bind(id).first();
    return json({ user: publicUser(user), authenticated: true }, 201, [makeCookie(SESSION_COOKIE, session.rawToken, session.lifetimeSeconds, request)]);
  }

  if (resource === 'auth/login' && method === 'POST') {
    verifyCsrf(request);
    const body = await readBody(request);
    const email = normalizeEmail(body.email);
    const password = String(body.password || '');
    const accountType = body.accountType === 'staff' ? 'staff' : 'student';
    const rememberMe = Boolean(body.rememberMe);
    const { ipHash } = await requestFingerprint(request);
    const identifierHash = await sha256(email);
    await enforceRateLimit(env.DB, identifierHash, ipHash);
    const user = emailIsValid(email) ? await env.DB.prepare('SELECT * FROM auth_users WHERE email = ? LIMIT 1').bind(email).first() : null;
    const validPassword = await verifyPassword(password, user?.password_hash || DUMMY_PASSWORD_HASH);
    const validRole = accountType === 'staff' ? ['counselor', 'admin'].includes(user?.role) : user?.role === 'student';
    if (!user || !validPassword || !validRole || user.status !== 'active') {
      await recordAttempt(env.DB, identifierHash, ipHash, false);
      return fail('The email or password is incorrect.', 401);
    }

    const now = new Date().toISOString();
    await env.DB.batch([
      env.DB.prepare('UPDATE auth_users SET last_login_at = ?, updated_at = ? WHERE id = ?').bind(now, now, user.id),
      env.DB.prepare("INSERT INTO auth_events (user_id, event, ip_hash, created_at) VALUES (?, 'login', ?, ?)").bind(user.id, ipHash, now),
    ]);
    await recordAttempt(env.DB, identifierHash, ipHash, true);
    const session = await createSession(env.DB, request, user.id, rememberMe);
    return json({ user: publicUser(user), authenticated: true }, 200, [makeCookie(SESSION_COOKIE, session.rawToken, session.lifetimeSeconds, request)]);
  }

  if (resource === 'auth/logout' && method === 'POST') {
    verifyCsrf(request);
    const rawToken = parseCookies(request)[SESSION_COOKIE];
    if (rawToken) {
      const tokenHash = await sha256(rawToken);
      const session = await env.DB.prepare('SELECT user_id FROM auth_sessions WHERE id = ?').bind(tokenHash).first();
      await env.DB.prepare('DELETE FROM auth_sessions WHERE id = ?').bind(tokenHash).run();
      if (session?.user_id) {
        const { ipHash } = await requestFingerprint(request);
        await env.DB.prepare("INSERT INTO auth_events (user_id, event, ip_hash, created_at) VALUES (?, 'logout', ?, ?)").bind(session.user_id, ipHash, new Date().toISOString()).run();
      }
    }
    return json({ signedOut: true }, 200, [expireCookie(SESSION_COOKIE, request), expireCookie(CSRF_COOKIE, request)]);
  }

  return fail('API resource not found.', 404);
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isApiRequest = url.pathname === '/api/index.php' || url.pathname.startsWith('/api/');
    if (!isApiRequest) return env.ASSETS.fetch(request);

    const resource = url.searchParams.get('resource') || url.pathname.replace(/^\/api\//u, '').replace(/\/$/u, '');
    try {
      if (resource === 'health' && request.method === 'GET') {
        if (!env.DB) return json({ status: 'degraded', service: 'Mother Teresa Accounts', database: 'unavailable' }, 503);
        await ensureAuthSchema(env.DB);
        return json({ status: 'ok', service: 'Mother Teresa Accounts', database: 'ready' });
      }
      if (resource.startsWith('auth/')) return await handleAuth(request, env, resource);
      return fail('API resource not found.', 404);
    } catch (error) {
      console.error('Account API request failed', { method: request.method, resource, message: error?.message, stack: error?.stack });
      const status = Number(error.status || 500);
      return fail(status >= 500 ? 'We could not complete this request. Please try again.' : error.message, status);
    }
  },
};
