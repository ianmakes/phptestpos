import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function ComingSoon({ moduleName }) {
    // Format module name from snake_case or kebab-case to Title Case
    const formattedTitle = moduleName
        .split(/[_-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{formattedTitle}</h2>}
        >
            <Head title={`${formattedTitle} - Coming Soon`} />

            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
                    <div className="relative bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
                        <svg className="w-20 h-20 text-indigo-500 mx-auto mb-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Coming Soon</h1>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            The <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{formattedTitle}</span> module is currently under development. 
                            We're working hard to bring you a state-of-the-art experience!
                        </p>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <div className="flex flex-col items-center p-4">
                        <div className="w-12 h-1 bg-gray-200 dark:bg-gray-800 rounded-full mb-2"></div>
                        <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">Design Phase</span>
                        <span className="text-sm text-green-500 mt-1 font-bold">Complete</span>
                    </div>
                    <div className="flex flex-col items-center p-4">
                        <div className="w-12 h-1 bg-indigo-500 rounded-full mb-2 animate-pulse"></div>
                        <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">Development</span>
                        <span className="text-sm text-indigo-500 mt-1 font-bold italic">In Progress</span>
                    </div>
                    <div className="flex flex-col items-center p-4">
                        <div className="w-12 h-1 bg-gray-200 dark:bg-gray-800 rounded-full mb-2"></div>
                        <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">Final Polish</span>
                        <span className="text-sm text-gray-300 dark:text-gray-700 mt-1 font-bold">Pending</span>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
