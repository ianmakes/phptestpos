import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function Categories({ categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        name: '',
        icon: null,
        sort_order: 0,
    });

    const openCreateModal = () => {
        setEditingCategory(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setData({
            name: category.name,
            icon: null,
            sort_order: category.sort_order,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            router.post(route('menu.categories.update', editingCategory.id), {
                ...data,
                _method: 'PUT',
            }, {
                forceFormData: true,
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('menu.categories.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    return (
        <AuthenticatedLayout header="Menu Categories">
            <Head title="Menu Categories" />

            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header Actions */}
                <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800">
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">Classification</h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage food and product groupings</p>
                    </div>
                    <PrimaryButton onClick={openCreateModal} className="px-8 text-[10px] font-black tracking-widest">
                        NEW CATEGORY
                    </PrimaryButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <div key={category.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 flex flex-col group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                                    {category.icon && category.icon.startsWith('/storage/') ? (
                                        <img src={category.icon} alt="" className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-xl">{category.icon || '📂'}</span>
                                    )}
                                </div>
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">#{category.sort_order}</span>
                            </div>
                            
                            <h3 className="text-sm font-black uppercase tracking-tight text-gray-900 dark:text-white mb-1">{category.name}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">8 Items Linked</p>
                            
                            <div className="mt-auto flex w-full space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => openEditModal(category)}
                                    className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-900 hover:border-gray-900 transition-all"
                                >
                                    Configure
                                </button>
                                <button 
                                    onClick={() => { if(confirm('Delete?')) router.delete(route('menu.categories.destroy', category.id)) }}
                                    className="px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                >
                                    Del
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-950 border border-gray-900 dark:border-gray-800">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">{editingCategory ? 'Update Category' : 'Register Category'}</h3>
                        <button type="button" onClick={closeModal} className="text-[10px] font-black text-gray-400">[ESC] CLOSE</button>
                    </div>

                    <div className="p-8 space-y-6">
                        <div>
                            <InputLabel value="Category Designation" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                            <TextInput
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-none border border-gray-200 bg-gray-50 focus:bg-white"
                                placeholder="E.G. BEVERAGES / APPS"
                                required
                            />
                            {errors.name && <p className="mt-1 text-[8px] font-bold text-rose-600 uppercase">{errors.name}</p>}
                        </div>

                        <div>
                            <InputLabel value="Hierarchy Order" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                            <TextInput
                                type="number"
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', e.target.value)}
                                className="w-full rounded-none border border-gray-200 bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <div>
                            <InputLabel value="Visual Identifier" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                            <div className="mt-1 flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
                                    {data.icon ? (
                                        <img src={URL.createObjectURL(data.icon)} className="w-full h-full object-cover" />
                                    ) : editingCategory?.icon ? (
                                        <img src={editingCategory.icon} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-tighter">No Icon</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    onChange={e => setData('icon', e.target.files[0])}
                                    className="text-[10px] font-black uppercase text-gray-400 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex justify-end space-x-3">
                        <SecondaryButton onClick={closeModal} className="border-gray-200 text-gray-400">Discard</SecondaryButton>
                        <PrimaryButton disabled={processing} className="bg-gray-900 px-8">Save Designation</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
