const apiUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const sessionKey = 'dispatch-session';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${apiUrl}${path}`, { ...options, signal: AbortSignal.timeout(15000) });
  } catch {
    throw new Error('Không kết nối được máy chủ. Vui lòng thử lại.');
  }
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.success) {
    throw new Error(response.status >= 500
      ? 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.'
      : body?.message || 'Không thể thực hiện yêu cầu. Vui lòng thử lại.');
  }
  return body.data;
}

export async function login(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  });
  const session = { accessToken: data.accessToken, expiresAt: Date.now() + data.expiresIn * 1000 };
  try { sessionStorage.setItem(sessionKey, JSON.stringify(session)); } catch { /* Session stays in memory. */ }
  return { user: data.user, session };
}

export function readSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(sessionKey));
    if (typeof session?.accessToken === 'string' && Number.isFinite(session.expiresAt) && session.expiresAt > Date.now()) return session;
  } catch { /* Missing or unavailable browser storage. */ }
  clearSession();
  return null;
}

export function clearSession() {
  try { sessionStorage.removeItem(sessionKey); } catch { /* Storage may be disabled. */ }
}

export function currentUser(session) {
  return request('/auth/me', { headers: { Authorization: `Bearer ${session.accessToken}` } });
}
