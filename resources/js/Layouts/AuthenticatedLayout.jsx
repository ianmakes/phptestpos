import Sidebar from '@/Components/Sidebar';
import Dropdown from '@/Components/Dropdown';
import { usePage, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const modules = [
        {
            name: 'Main',
            submodules: [
                { name: 'Dashboard', route: 'dashboard' },
                { name: 'Table Layout', route: 'tables.index' },
                { name: 'POS Terminal', route: 'pos.terminal', target: '_blank' },
            ]
        },
        {
            name: 'Item/Stock',
            submodules: [
                { name: 'Ingredient Units', route: 'ingredients.units' },
                { name: 'Ingredient Categories', route: 'ingredients.categories' },
                { name: 'Ingredients', route: 'ingredients.index' },
                { name: 'Modifiers', route: 'modifiers.index' },
                { name: 'Food Categories', route: 'menu.categories.index' },
                { name: 'Food Menu', route: 'menu.index', params: { type: 'food' } },
                { name: 'Product Menu', route: 'menu.index', params: { type: 'ready_made' } },
            ]
        },
        {
            name: 'Operations',
            submodules: [
                { name: 'Kitchen (KOT)', route: 'kitchen.index' },
                { name: 'Orders History', route: 'orders.index' },
            ]
        },
        {
            name: 'Administration',
            submodules: [
                { name: 'Reports', route: 'reports.index' },
                { name: 'User Access', route: 'users.index' },
                { name: 'Settings', route: 'settings.index' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans antialiased text-gray-900 overflow-x-hidden">
            <Sidebar modules={modules} />

            <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                {/* Top Action Bar */}
                <div className="h-14 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-8">
                    <div className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 px-3 py-1 border border-emerald-100 dark:border-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>System Live</span>
                        </div>
                        <div className="relative max-w-md w-full">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input 
                                type="text" 
                                placeholder="Search products, orders, reports..." 
                                className="w-full bg-transparent border-none focus:ring-0 text-xs font-medium placeholder-gray-400 px-10"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                    <span>{user.name}</span>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route('settings.index')}>Settings</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-8 py-4">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span>Elevate POS</span>
                            <span>/</span>
                            <span className="text-gray-900 dark:text-white">{header}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium tracking-tight">Real-time inventory management and kitchen coordination across all counters.</p>
                    </div>
                </div>

                <main className="p-8 bg-[#f9fafb] dark:bg-gray-950 min-h-[calc(100vh-12rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
