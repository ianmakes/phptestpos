import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Sidebar({ modules }) {
    const [expandedGroups, setExpandedGroups] = useState(() => {
        return modules.reduce((acc, module) => {
            const hasActiveSub = module.submodules?.some(sub => 
                sub.route && route().current(sub.route, sub.params)
            );
            return { ...acc, [module.name]: hasActiveSub || true };
        }, {});
    });

    const toggleGroup = (groupName) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#f9fafb] dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 flex flex-col font-sans">
            {/* Brand Logo */}
            <div className="p-6 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-900 flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <div>
                    <span className="block text-sm font-black text-gray-900 dark:text-white leading-none">Elevate POS</span>
                    <span className="text-[10px] text-gray-400 font-medium">Management Console</span>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
                {modules.map((module) => (
                    <div key={module.name} className="space-y-1">
                        <div className="px-3 mb-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">{module.name}</span>
                        </div>
                        
                        {module.submodules?.map((sub) => {
                            const isActive = sub.route && route().current(sub.route, sub.params);
                            const commonClasses = `flex items-center justify-between px-3 py-2 transition-all duration-200 group ${
                                isActive
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`;
                            const href = sub.route ? route(sub.route, sub.params) : '#';

                            if (sub.target) {
                                return (
                                    <a
                                        key={sub.name}
                                        href={href}
                                        target={sub.target}
                                        className={commonClasses}
                                    >
                                        <div className="flex items-center space-x-3">
                                            {isActive && <div className="w-1 h-4 bg-gray-900 dark:bg-white -ml-3 mr-2"></div>}
                                            <span className={`text-xs ${isActive ? 'font-black' : 'font-semibold'}`}>{sub.name}</span>
                                        </div>
                                        {sub.count && (
                                            <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-none border border-gray-200 dark:border-gray-700">{sub.count}</span>
                                        )}
                                    </a>
                                );
                            }

                            return (
                                <Link
                                    key={sub.name}
                                    href={href}
                                    className={commonClasses}
                                >
                                    <div className="flex items-center space-x-3">
                                        {isActive && <div className="w-1 h-4 bg-gray-900 dark:bg-white -ml-3 mr-2"></div>}
                                        <span className={`text-xs ${isActive ? 'font-black' : 'font-semibold'}`}>{sub.name}</span>
                                    </div>
                                    {sub.count && (
                                        <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-none border border-gray-200 dark:border-gray-700">{sub.count}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold text-[10px]">
                        AD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">Administrator</p>
                        <p className="text-[10px] text-gray-400 truncate">admin@elevatepos.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
