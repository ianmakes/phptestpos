import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function POSLayout({ children, user }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans selection:bg-gray-900 selection:text-white">
            <Head title="POS Terminal" />
            
            {/* Top Bar */}
            <header className="h-14 bg-white border-b border-gray-900 flex items-center justify-between px-6 z-50">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-900 flex items-center justify-center">
                            <span className="text-white font-black text-lg">E</span>
                        </div>
                        <span className="font-black text-sm uppercase tracking-tighter">Elevate POS</span>
                    </div>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Terminal ID</span>
                        <span className="text-xs font-black uppercase tracking-tight leading-none">TERM-001</span>
                    </div>
                </div>

                <div className="flex items-center space-x-8">
                    <div className="text-right flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">{formatDate(currentTime)}</span>
                        <span className="text-sm font-black tracking-tight leading-none uppercase">{formatTime(currentTime)}</span>
                    </div>
                    
                    <div className="h-4 w-px bg-gray-300"></div>

                    <div className="flex items-center space-x-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black uppercase tracking-tight leading-none">{user.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">Staff</p>
                        </div>
                        <div className="w-8 h-8 bg-gray-100 border border-gray-900 flex items-center justify-center font-black text-xs">
                            {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                    </div>

                    <Link
                        href={route('dashboard')}
                        className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border border-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                    >
                        Exit
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    );
}
