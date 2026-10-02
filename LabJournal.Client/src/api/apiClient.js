import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:7267',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

/* ---------- Колбэк на 401, который регистрирует AuthContext ---------- */
let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url ?? '';
    const isAuthEndpoint =
      url.includes('/api/auth/login') || url.includes('/api/auth/register');

    if (status === 401 && !isAuthEndpoint) {
      if (onUnauthorized) onUnauthorized();
    }

    if (status === 403) {
      console.warn('[apiClient] 403 Forbidden — недостаточно прав');
    }

    const apiMessage =
      error?.response?.data?.message ||
      error?.response?.data?.title ||
      error?.message ||
      'Неизвестная ошибка';

    error.userMessage = apiMessage;
    return Promise.reject(error);
  }
);

export default apiClient;