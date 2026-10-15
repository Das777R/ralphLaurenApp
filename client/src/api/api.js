import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

let accessToken = '';

export const setAccessToken = (token) => {
  accessToken = token || '';
};

const REFRESH_URLS = {
  user: '/api/auth/token',
  admin: '/api/admin/token',
};


const inFlight = { user: null, admin: null };

export const refreshSession = (type = 'user') => {
  if (!inFlight[type]) {
    inFlight[type] = axios
      .post(REFRESH_URLS[type], {}, { withCredentials: true })
      .then((res) => {
      
        console.log(`[refresh:${type}]`, res.status, res.headers['content-type'], res.data);

        const data = res.data?.data;
        if (data?.accessToken) setAccessToken(data.accessToken);
        return data;
      })
      .finally(() => {
        inFlight[type] = null;
      });
  }
  return inFlight[type];
};

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


const isAuthCall = (url) =>
  url.includes('/auth/token') ||
  url.includes('/admin/token') ||
  url.includes('/auth/login') ||
  url.includes('/auth/signup');

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url || '';

    if (
      (status === 401 || status === 403) &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthCall(url)
    ) {
      originalRequest._retry = true;

      try {
        const type = url.startsWith('/admin') ? 'admin' : 'user';
        const data = await refreshSession(type);

        if (!data?.accessToken) throw new Error('No access token returned');

        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch {
        setAccessToken('');
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;