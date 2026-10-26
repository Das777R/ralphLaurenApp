import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Separate tokens so a user session and an admin session can't overwrite each other
const tokens = { user: '', admin: '' };

const typeOf = (url = '') => (url.startsWith('/admin') ? 'admin' : 'user');

// setAccessToken(token) keeps working for existing user code; admin passes 'admin'
export const setAccessToken = (token, type = 'user') => {
  tokens[type] = token || '';
};

const REFRESH_URLS = {
  user: '/api/auth/token',
  admin: '/api/admin/token',
};

// De-duplicates concurrent refreshes (also covers React StrictMode double effects)
const inFlight = { user: null, admin: null };

export const refreshSession = (type = 'user') => {
  if (!inFlight[type]) {
    inFlight[type] = axios
      .post(REFRESH_URLS[type], {}, { withCredentials: true })
      .then((res) => {
        const data = res.data?.data;
        if (data?.accessToken) setAccessToken(data.accessToken, type);
        return data;
      })
      .finally(() => {
        inFlight[type] = null;
      });
  }
  return inFlight[type];
};

api.interceptors.request.use((config) => {
  const token = tokens[typeOf(config.url)];
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

const isAuthCall = (url) =>
  url.includes('/auth/token') ||
  url.includes('/admin/token') ||
  url.includes('/auth/login') ||
  url.includes('/auth/signup') ||
  url.includes('/logout');

export const ADMIN_EXPIRED_EVENT = 'admin:session-expired';

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url || '';
    const type = typeOf(url);

    // Admin: only 401 means "token expired" (403 = not allowed, refreshing won't help)
    const retryable = status === 401 || (status === 403 && type === 'user');

    if (retryable && originalRequest && !originalRequest._retry && !isAuthCall(url)) {
      originalRequest._retry = true;

      try {
        const data = await refreshSession(type);
        if (!data?.accessToken) throw new Error('No access token returned');

        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch {
        setAccessToken('', type);
        // Tell AdminLayout to drop back to the login screen
        if (type === 'admin') window.dispatchEvent(new Event(ADMIN_EXPIRED_EVENT));
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;