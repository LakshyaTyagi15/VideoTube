import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser as loginApi, logoutUser as logoutApi } from '../api/auth';
import { setAuthToken } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await getCurrentUser();
            setUser(res.data.data);
        } catch {
            setUser(null);
            setAuthToken(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (credentials) => {
        const res = await loginApi(credentials);
        const { user: loggedInUser, accessToken } = res.data.data;
        // Store token in axios headers as fallback for when cookies don't work
        if (accessToken) {
            setAuthToken(accessToken);
        }
        setUser(loggedInUser);
        return res.data;
    };

    const logout = async () => {
        await logoutApi();
        setAuthToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user, refetchUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
