import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
    baseURL,
    withCredentials: true,
});

// Helper to set/clear the Authorization header
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshRes = await axios.post(`${baseURL}/users/refresh-token`, {}, { withCredentials: true });
                const newAccessToken = refreshRes.data?.data?.accessToken;
                if (newAccessToken) {
                    setAuthToken(newAccessToken);
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                }
                return api(originalRequest);
            } catch {
                const isAuthCheck = originalRequest.url?.includes('/users/current-user');
                const isPublicAuthPage = ['/login', '/register'].includes(window.location.pathname);

                if (!isAuthCheck && !isPublicAuthPage) {
                    window.location.href = '/login';
                }

                setAuthToken(null);
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
