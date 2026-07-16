import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineVideoCamera, HiOutlineBell, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { RiMenu3Line } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({ onToggleSidebar }) {
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLogout = async () => {
        await logout();
        setShowDropdown(false);
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border-primary h-16">
            <div className="flex items-center justify-between h-full px-4">
                {/* Left: Menu + Logo */}
                <div className="flex items-center gap-3">
                    <button onClick={onToggleSidebar} className="p-2 rounded-lg hover:bg-bg-hover transition-colors" id="sidebar-toggle">
                        <RiMenu3Line className="w-5 h-5" />
                    </button>
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                            <HiOutlineVideoCamera className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-semibold hidden sm:block">VideoTube</span>
                    </Link>
                </div>

                {/* Center: Search */}
                <form onSubmit={handleSearch} className="hidden sm:flex items-center max-w-lg flex-1 mx-8">
                    <div className="flex w-full">
                        <input
                            type="text"
                            placeholder="Search videos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-bg-secondary border border-border-primary rounded-l-full px-5 py-2 text-sm focus:outline-none focus:border-accent placeholder:text-text-muted transition-colors"
                            id="search-input"
                        />
                        <button type="submit" className="bg-bg-tertiary border border-l-0 border-border-primary rounded-r-full px-5 hover:bg-bg-hover transition-colors" id="search-button">
                            <HiOutlineSearch className="w-4 h-4 text-text-secondary" />
                        </button>
                    </div>
                </form>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-bg-hover transition-colors"
                        id="theme-toggle"
                        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {theme === 'dark' ? (
                            <HiOutlineSun className="w-5 h-5 text-yellow-400" />
                        ) : (
                            <HiOutlineMoon className="w-5 h-5 text-indigo-500" />
                        )}
                    </button>
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="p-2 rounded-lg hover:bg-bg-hover transition-colors hidden sm:flex" id="upload-btn">
                                <HiOutlineVideoCamera className="w-5 h-5" />
                            </Link>
                            <button className="p-2 rounded-lg hover:bg-bg-hover transition-colors">
                                <HiOutlineBell className="w-5 h-5" />
                            </button>
                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setShowDropdown(!showDropdown)} className="ml-1" id="user-avatar">
                                    <img
                                        src={user?.avatar}
                                        alt={user?.fullName}
                                        className="w-8 h-8 rounded-full object-cover border-2 border-transparent hover:border-accent transition-colors"
                                    />
                                </button>
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 bg-bg-secondary border border-border-primary rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <div className="p-3 border-b border-border-primary">
                                            <p className="font-medium text-sm">{user?.fullName}</p>
                                            <p className="text-xs text-text-muted">@{user?.userName}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link to={`/channel/${user?.userName}`} onClick={() => setShowDropdown(false)} className="block px-4 py-2.5 text-sm hover:bg-bg-hover transition-colors">
                                                Your channel
                                            </Link>
                                            <Link to="/dashboard" onClick={() => setShowDropdown(false)} className="block px-4 py-2.5 text-sm hover:bg-bg-hover transition-colors">
                                                Dashboard
                                            </Link>
                                            <Link to="/liked-videos" onClick={() => setShowDropdown(false)} className="block px-4 py-2.5 text-sm hover:bg-bg-hover transition-colors">
                                                Liked videos
                                            </Link>
                                            <hr className="border-border-primary my-1" />
                                            <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-bg-hover transition-colors" id="logout-btn">
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link to="/login" className="bg-accent hover:bg-accent-hover text-white px-5 py-2 rounded-full text-sm font-medium transition-colors" id="login-btn">
                            Sign in
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
