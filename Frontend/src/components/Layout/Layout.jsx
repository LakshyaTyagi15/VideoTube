import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-bg-primary">
            <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <Sidebar isOpen={sidebarOpen} />
            <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:pl-56' : 'lg:pl-[72px]'}`}>
                <div className="p-4 sm:p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
