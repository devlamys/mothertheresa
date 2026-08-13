const projectBase = import.meta.env.BASE_URL.replace(/dist\/?$/, '');
const apiUrl = `${projectBase}api/index.php`;
let csrfToken = null;

const endpoint = (resource) => `${apiUrl}?resource=${encodeURIComponent(resource)}`;

const request = async (resource, options = {}) => {
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (csrfToken && !['GET', 'HEAD'].includes((options.method || 'GET').toUpperCase())) headers.set('X-CSRF-Token', csrfToken);

  const response = await fetch(endpoint(resource), {
    credentials: 'same-origin',
    ...options,
    headers,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload?.error?.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.details = payload?.error?.details;
    throw error;
  }
  return payload.data;
};

export const getCsrfSession = async () => {
  const session = await request('auth/csrf');
  csrfToken = session.csrfToken;
  return session;
};

export const getAuthSession = async () => {
  try {
    const session = await request('auth/me');
    if (session?.csrfToken) csrfToken = session.csrfToken;
    return { authenticated: session?.authenticated ?? Boolean(session?.user), user: session?.user || null };
  } catch (error) {
    if (error.status === 401) return { authenticated: false, user: null };
    throw error;
  }
};

export const registerStudentAccount = async (profile) => {
  if (!csrfToken) await getCsrfSession();
  const session = await request('auth/register', {
    method: 'POST',
    body: JSON.stringify({ ...profile, accountType: 'student' }),
  });
  return session.user;
};

export const loginStudentAccount = async (email, password, rememberMe = false) => {
  if (!csrfToken) await getCsrfSession();
  const session = await request('auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, rememberMe, accountType: 'student' }),
  });
  return session.user;
};

export const startDemoStaffSession = async () => {
  const session = await request('auth/demo', { method: 'POST', body: '{}' });
  csrfToken = session.csrfToken;
  return session.user;
};

export const loginStaff = async (email, password, rememberMe = false) => {
  if (!csrfToken) await getCsrfSession();
  const session = await request('auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, rememberMe, accountType: 'staff' }),
  });
  csrfToken = session.csrfToken;
  return session.user;
};

export const logoutAccount = async () => {
  if (!csrfToken) await getCsrfSession();
  const result = await request('auth/logout', { method: 'POST', body: '{}' });
  csrfToken = null;
  return result;
};

export const logoutStaffSession = logoutAccount;

const withStaffSession = async (operation) => {
  try {
    if (!csrfToken) await getCsrfSession();
    return await operation();
  } catch (error) {
    if (error.status !== 401) throw error;
    await startDemoStaffSession();
    return operation();
  }
};

export const getPublicHomepage = () => request('public/cms/home');

export const publishHomepage = (content) => withStaffSession(() => request('cms/home', {
  method: 'PUT',
  body: JSON.stringify({ content }),
}));

export const submitWebsiteLead = (lead) => {
  const params = new URLSearchParams(window.location.search);
  return request('leads', {
    method: 'POST',
    body: JSON.stringify({
      ...lead,
      source: lead.source || 'website',
      formKey: lead.formKey || 'general-enquiry',
      landingPage: window.location.href,
      referrer: document.referrer,
      device: navigator.userAgent,
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_content: params.get('utm_content'),
      utm_term: params.get('utm_term'),
    }),
  });
};

export const getErpWorkspaceData = () => withStaffSession(async () => {
  const [dashboard, leads, students, applications, tasks, operations, roles] = await Promise.all([
    request('dashboard'),
    request('leads'),
    request('students'),
    request('applications'),
    request('tasks'),
    request('operations'),
    request('roles'),
  ]);
  return { dashboard, leads, students, applications, tasks, operations, roles };
});

export const updateErpLeadStatus = (leadId, status, details = {}) => withStaffSession(() => request(`leads/${leadId}/status`, {
  method: 'PATCH',
  body: JSON.stringify({ status, ...details }),
}));

export const getApiHealth = () => request('health');
