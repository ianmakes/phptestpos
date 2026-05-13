import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import { Head, useForm } from '@inertiajs/react';

export default function PinLogin() {
    const { data, setData, post, processing, errors, reset } = useForm({
        pin: '',
    });

    const handlePinClick = (num) => {
        if (data.pin.length < 4) {
            setData('pin', data.pin + num);
        }
    };

    const handleClear = () => {
        setData('pin', '');
    };

    const handleDelete = () => {
        setData('pin', data.pin.slice(0, -1));
    };

    useEffect(() => {
        if (data.pin.length === 4) {
            submit();
        }
    }, [data.pin]);

    const submit = (e) => {
        if (e) e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="PIN Login" />

            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">POS Login</h2>
                
                <div className="flex space-x-4 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className={`w-4 h-4 rounded-full border-2 border-indigo-500 ${
                                data.pin.length >= i ? 'bg-indigo-500' : 'bg-transparent'
                            }`}
                        ></div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            type="button"
                            onClick={() => handlePinClick(num)}
                            className="w-16 h-16 flex items-center justify-center text-2xl font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-sm"
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={handleClear}
                        className="w-16 h-16 flex items-center justify-center text-sm font-semibold bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors shadow-sm"
                    >
                        Clear
                    </button>
                    <button
                        type="button"
                        onClick={() => handlePinClick(0)}
                        className="w-16 h-16 flex items-center justify-center text-2xl font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-sm"
                    >
                        0
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="w-16 h-16 flex items-center justify-center text-sm font-semibold bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                    >
                        Delete
                    </button>
                </div>

                <InputError message={errors.pin} className="mt-4" />

                <div className="mt-8 text-sm text-gray-500">
                    <a href={route('email.login')} className="hover:text-indigo-600 underline">
                        Login with Email & Password
                    </a>
                </div>
            </div>
        </GuestLayout>
    );
}
