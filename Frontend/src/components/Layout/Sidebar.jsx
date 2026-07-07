import { NavLink } from 'react-router-dom';
import { HiOutlineHome, HiOutlineFire, HiOutlineClock, HiOutlineThumbUp, HiOutlineCollection, HiOutlineChatAlt2, HiOutlineChartBar } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
    { to: '/', icon: HiOutlineHome, label: 'Home' },
    { to: '/tweets', icon: HiOutlineChatAlt2, label: 'Tweets' },
    { to: '/liked-videos', icon: HiOutlineThumbUp, label: 'Liked Videos', auth: true },
    { to: '/history', icon: HiOutlineClock, label: 'History', auth: true },
    { to: '/playlists', icon: HiOutlineCollection, label: 'Playlists', auth: true },
    { to: '/dashboard', icon: HiOutlineChartBar, label: 'Dashboard', auth: true },
];

export default function Sidebar({ isOpen }) {
    const { isAuthenticated } = useAuth();

    const filteredItems = navItems.filter(item => !item.auth || isAuthenticated);

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" />
            )}

            <aside className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-bg-primary border-r border-border-primary transition-all duration-300 ease-in-out overflow-y-auto scrollbar-hidden ${isOpen ? 'w-56' : 'w-0 lg:w-[72px]'}`}>
                <nav className="flex flex-col py-3">
                    {filteredItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3 mx-1 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-accent-muted text-accent'
                                    : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                                } ${!isOpen ? 'lg:flex-col lg:gap-1 lg:px-2 lg:py-2.5 lg:text-[10px]' : ''}`
                            }
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span className={`${!isOpen ? 'hidden lg:block' : ''} whitespace-nowrap overflow-hidden`}>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {isOpen && (
                    <div className="border-t border-border-primary mt-3 pt-3 px-4">
                        <p className="text-xs text-text-muted mb-3 uppercase tracking-wider font-medium">About</p>
                        <p className="text-xs text-text-muted leading-relaxed">
                            VideoTube © 2026
                        </p>
                    </div>
                )}
            </aside>
        </>
    );
}
