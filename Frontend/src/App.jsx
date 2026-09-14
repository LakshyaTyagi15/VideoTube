import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { lazy, Suspense } from 'react';
import { PageLoader } from './components/ui/Loader';

// Lazy load all pages for faster initial load
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const VideoPlayer = lazy(() => import('./pages/VideoPlayer'));
const Channel = lazy(() => import('./pages/Channel'));
const Tweets = lazy(() => import('./pages/Tweets'));
const LikedVideos = lazy(() => import('./pages/LikedVideos'));
const History = lazy(() => import('./pages/History'));
const Playlists = lazy(() => import('./pages/Playlists'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function AppToaster() {
    const { theme } = useTheme();
    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                style: {
                    background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                    color: theme === 'dark' ? '#f1f1f1' : '#111111',
                    border: `1px solid ${theme === 'dark' ? '#2a2a2a' : '#d4d4d4'}`,
                    borderRadius: '12px',
                    fontSize: '14px',
                },
            }}
        />
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route element={<Layout />}>
                                <Route index element={<Home />} />
                                <Route path="login" element={<Login />} />
                                <Route path="register" element={<Register />} />
                                <Route path="video/:videoId" element={<VideoPlayer />} />
                                <Route path="channel/:userName" element={<Channel />} />
                                <Route path="tweets" element={<Tweets />} />
                                <Route path="liked-videos" element={<ProtectedRoute><LikedVideos /></ProtectedRoute>} />
                                <Route path="history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                                <Route path="playlists" element={<ProtectedRoute><Playlists /></ProtectedRoute>} />
                                <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            </Route>
                        </Routes>
                    </Suspense>
                    <AppToaster />
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}
