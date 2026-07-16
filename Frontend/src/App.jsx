import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoPlayer from './pages/VideoPlayer';
import Channel from './pages/Channel';
import Tweets from './pages/Tweets';
import LikedVideos from './pages/LikedVideos';
import History from './pages/History';
import Playlists from './pages/Playlists';
import Dashboard from './pages/Dashboard';

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
                    <AppToaster />
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

