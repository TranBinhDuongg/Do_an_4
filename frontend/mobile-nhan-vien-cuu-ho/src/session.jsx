import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from './config';

const Context = createContext(null);
const KEY = 'rescue-session-v1';
// Browser preview only; installed mobile builds use the OS secure store.
const storage = {
  get: () => Platform.OS === 'web' ? Promise.resolve(globalThis.localStorage?.getItem(KEY)) : SecureStore.getItemAsync(KEY),
  set: value => Platform.OS === 'web' ? Promise.resolve(value ? globalThis.localStorage.setItem(KEY, value) : globalThis.localStorage.removeItem(KEY)) : value ? SecureStore.setItemAsync(KEY, value) : SecureStore.deleteItemAsync(KEY),
};
export async function request(path, body, accessToken) {
  if (!/^https?:\/\//.test(API_URL)) throw new Error('Chưa cấu hình máy chủ. Bạn có thể xem thử giao diện bên dưới.');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${API_URL}/rescue/${path}`, {
      method: body === undefined ? 'GET' : 'POST', signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const result = await response.json().catch(() => { throw new Error('Máy chủ trả về dữ liệu không hợp lệ. Vui lòng thử lại sau.'); });
    if (!response.ok || !result.success) {
      const error = new Error(result.message || 'Không thể xử lý yêu cầu.');
      error.status = response.status;
      throw error;
    }
    return result.data;
  } catch (error) {
    if (error.name === 'AbortError' || error instanceof TypeError) throw new Error('Không kết nối được máy chủ. Kiểm tra mạng và thử lại.');
    throw error;
  } finally { clearTimeout(timer); }
}
export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restoreError, setRestoreError] = useState('');
  const refreshing = useRef(null);
  async function restore() {
    try {
      const saved = await storage.get();
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.demo === true) setSession({ demo: true, user: { id: 'NV03', name: 'Lê Mai Chi' } });
        else {
          const next = await request('refresh', { refreshToken: parsed?.refreshToken });
          await storage.set(JSON.stringify({ refreshToken: next.refreshToken }));
          setSession(next);
        }
      }
    } catch (error) {
      if (error.status === 401 || error instanceof SyntaxError) await storage.set(null);
      else setRestoreError(error.message || 'Không thể khôi phục phiên đăng nhập.');
    } finally { setLoading(false); }
  }
  // All restore state updates follow awaited storage/network IO; no synchronous render loop.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void restore(); }, []);
  async function signIn(email, password, remember) {
    const next = await request('login', { email, password });
    try { await storage.set(remember ? JSON.stringify({ refreshToken: next.refreshToken }) : null); }
    catch { await request('logout', { refreshToken: next.refreshToken }).catch(() => {}); throw new Error('Không thể lưu phiên trên thiết bị này. Hãy bỏ chọn ghi nhớ và thử lại.'); }
    setSession(next);
  }
  async function signOut() {
    // Revoke first so a failed connection cannot leave a silently active device subscription.
    if (session && !session.demo) await request('logout', { refreshToken: session.refreshToken });
    await storage.set(null); setSession(null); setRestoreError('');
  }
  async function registerDevice(pushToken) {
    try { return await request('device', { pushToken, refreshToken: session.refreshToken }, session.accessToken); }
    catch (error) {
      if (error.status !== 401) throw error;
      if (!refreshing.current) refreshing.current = (async () => {
        try {
          const next = await request('refresh', { refreshToken: session.refreshToken });
          if (await storage.get()) await storage.set(JSON.stringify({ refreshToken: next.refreshToken }));
          setSession(next);
          return next;
        } catch (problem) {
          if (problem.status === 401) { await storage.set(null); setSession(null); }
          throw problem;
        } finally { refreshing.current = null; }
      })();
      const next = await refreshing.current;
      return request('device', { pushToken, refreshToken: next.refreshToken }, next.accessToken);
    }
  }
  async function demo() {
    const next = { demo: true, user: { id: 'NV03', name: 'Lê Mai Chi' } };
    await storage.set(JSON.stringify(next)); setSession(next);
  }
  return <Context.Provider value={{ session, loading, restoreError, restore: () => { setLoading(true); setRestoreError(''); return restore(); }, signIn, signOut, demo, registerDevice }}>{children}</Context.Provider>;
}
export const useSession = () => useContext(Context);
