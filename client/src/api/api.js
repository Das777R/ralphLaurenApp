import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});


let accessToken = '';

export const setAccessToken = (token) => {
  accessToken = token || '';
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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const isRefreshCall = originalRequest?.url?.includes('/auth/token');

    if ((status === 401 || status === 403) && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;

      try {
      const res = await axios.post('/api/auth/token', {}, { withCredentials: true });

      const newAccessToken = res.data.data;
      setAccessToken(newAccessToken);

      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return api(originalRequest);
      } catch (refreshError) {
        setAccessToken('');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);





export default api;