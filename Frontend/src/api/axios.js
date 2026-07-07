import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
    baseURL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.post(`${baseURL}/users/refresh-token`, {}, { withCredentials: true });
                return api(originalRequest);
            } catch {
                const isAuthCheck = originalRequest.url?.includes('/users/current-user');
                const isPublicAuthPage = ['/login', '/register'].includes(window.location.pathname);

                if (!isAuthCheck && !isPublicAuthPage) {
                    window.location.href = '/login';
                }

                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
