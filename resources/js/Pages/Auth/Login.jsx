import { useState, useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import { Head, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const [activeTab, setActiveTab] = useState('pin'); // 'pin' or 'email'

    // Form for PIN Login
    const pinForm = useForm({
        pin: '',
    });

    // Form for Email Login
    const emailForm = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // PIN Handlers
    const handlePinClick = (num) => {
        if (pinForm.data.pin.length < 4) {
            pinForm.setData('pin', pinForm.data.pin + num);
        }
    };

    const handleClear = () => pinForm.setData('pin', '');
    const handleDelete = () => pinForm.setData('pin', pinForm.data.pin.slice(0, -1));

    // Keyboard support for PIN
    useEffect(() => {
        if (activeTab !== 'pin') return;

        const handleKeyDown = (e) => {
            if (e.key >= '0' && e.key <= '9') {
                if (pinForm.data.pin.length < 4) {
                    pinForm.setData('pin', pinForm.data.pin + e.key);
                }
            } else if (e.key === 'Backspace') {
                pinForm.setData('pin', pinForm.data.pin.slice(0, -1));
            } else if (e.key === 'Escape') {
                pinForm.setData('pin', '');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [pinForm.data.pin, activeTab]);

    // Auto-submit PIN
    useEffect(() => {
        if (pinForm.data.pin.length === 4) {
            pinForm.post(route('login'));
        }
    }, [pinForm.data.pin]);

    const submitEmail = (e) => {
        e.preventDefault();
        emailForm.post(route('email.login'), {
            onFinish: () => emailForm.reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Login" />

            <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 border-2 border-black dark:border-white p-0">
                {/* Tabs */}
                <div className="flex border-b-2 border-black dark:border-white">
                    <button
                        onClick={() => setActiveTab('pin')}
                        className={`flex-1 py-4 text-sm font-bold tracking-widest uppercase transition-colors ${
                            activeTab === 'pin' 
                            ? 'bg-black text-white dark:bg-white dark:text-black' 
                            : 'bg-white text-black dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        Staff PIN
                    </button>
                    <button
                        onClick={() => setActiveTab('email')}
                        className={`flex-1 py-4 text-sm font-bold tracking-widest uppercase transition-colors ${
                            activeTab === 'email' 
                            ? 'bg-black text-white dark:bg-white dark:text-black' 
                            : 'bg-white text-black dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        Admin Email
                    </button>
                </div>

                <div className="p-8">
                    {status && (
                        <div className="mb-6 p-4 border border-green-500 bg-green-50 text-green-700 text-sm font-bold uppercase tracking-tight">
                            {status}
                        </div>
                    )}

                    {activeTab === 'pin' ? (
                        <div className="flex flex-col items-center">
                            <div className="flex space-x-6 mb-10">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className={`w-5 h-5 border-2 border-black dark:border-white transition-all duration-200 ${
                                            pinForm.data.pin.length >= i 
                                            ? 'bg-black dark:bg-white' 
                                            : 'bg-transparent'
                                        }`}
                                    ></div>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => handlePinClick(num)}
                                        className="aspect-square flex items-center justify-center text-2xl font-black bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95"
                                    >
                                        {num}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="aspect-square flex items-center justify-center text-xs font-bold uppercase bg-gray-100 dark:bg-gray-700 border-2 border-black dark:border-gray-600 hover:bg-red-500 hover:text-white transition-all"
                                >
                                    Clear
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handlePinClick(0)}
                                    className="aspect-square flex items-center justify-center text-2xl font-black bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95"
                                >
                                    0
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="aspect-square flex items-center justify-center text-xs font-bold uppercase bg-gray-100 dark:bg-gray-700 border-2 border-black dark:border-gray-600 hover:bg-black hover:text-white transition-all"
                                >
                                    Del
                                </button>
                            </div>
                            
                            <InputError message={pinForm.errors.pin} className="mt-6 text-center" />
                        </div>
                    ) : (
                        <form onSubmit={submitEmail} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="email" value="Email Address" className="text-xs font-black uppercase tracking-widest mb-2" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={emailForm.data.email}
                                    className="mt-1 block w-full border-2 border-black dark:border-white focus:ring-0 focus:border-black rounded-none"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => emailForm.setData('email', e.target.value)}
                                />
                                <InputError message={emailForm.errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password" className="text-xs font-black uppercase tracking-widest mb-2" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={emailForm.data.password}
                                    className="mt-1 block w-full border-2 border-black dark:border-white focus:ring-0 focus:border-black rounded-none"
                                    autoComplete="current-password"
                                    onChange={(e) => emailForm.setData('password', e.target.value)}
                                />
                                <InputError message={emailForm.errors.password} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={emailForm.data.remember}
                                        className="border-2 border-black rounded-none"
                                        onChange={(e) => emailForm.setData('remember', e.target.checked)}
                                    />
                                    <span className="ms-2 text-xs font-bold uppercase text-gray-600 dark:text-gray-400">
                                        Remember Me
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <button
                                        type="button"
                                        className="text-xs font-bold uppercase underline hover:text-black dark:hover:text-white"
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={emailForm.processing}
                                className="w-full py-4 bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-widest hover:invert transition-all disabled:opacity-50"
                            >
                                Authorize Access
                            </button>
                        </form>
                    )}
                </div>
            </div>
            
            <div className="mt-8 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Elevate POS Systems v1.0.4
                </p>
            </div>
        </GuestLayout>
    );
}
