import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

type LayoutProps = {
    children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="bg-neutral-100 dark:bg-neutral-900 min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
                    {/* Sidebar */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <Sidebar />
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout;