import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function Index({ categories, activeType, counters }) {
    const [selectedCategory, setSelectedCategory] = useState(categories[0] || null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const productForm = useForm({
        category_id: selectedCategory?.id || '',
        type: activeType || 'food',
        name: '',
        description: '',
        price: '',
        image: null,
        is_pos_visible: true,
        counters: [],
    });

    const handleProductSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...productForm.data,
            is_pos_visible: productForm.data.is_pos_visible ? 1 : 0,
        };
        if (editingItem) {
            router.post(route('menu.products.update', editingItem.id), {
                ...payload,
                _method: 'PUT'
            }, {
                forceFormData: true,
                onSuccess: () => closeModal(),
            });
        } else {
            router.post(route('menu.products.store'), payload, {
                forceFormData: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const closeModal = () => {
        setIsProductModalOpen(false);
        setEditingItem(null);
        productForm.reset();
    };

    const openEditProduct = (product) => {
        setEditingItem(product);
        productForm.setData({ 
            category_id: product.category_id, 
            type: product.type,
            name: product.name, 
            description: product.description,
            price: product.price,
            image: null,
            is_pos_visible: !!product.is_pos_visible,
            counters: product.counters?.map(c => c.id) || [],
        });
        setIsProductModalOpen(true);
    };

    const toggleCounter = (id) => {
        const current = [...productForm.data.counters];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }
        productForm.setData('counters', current);
    };

    const menuTitle = activeType === 'food' ? 'Food Menu (Kitchen)' : 'Product Menu (Ready-Made)';

    return (
        <AuthenticatedLayout header={menuTitle}>
            <Head title={menuTitle} />

            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 divide-x divide-gray-200 dark:divide-gray-800">
                    <div className="p-6">
                        <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>Total Items</span>
                        </div>
                        <div className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                            {selectedCategory?.products.length || 0}
                        </div>
                        <div className="text-[10px] font-bold text-emerald-600 mt-1 uppercase">✓ Synchronized</div>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            <span>POS Active</span>
                        </div>
                        <div className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                            {selectedCategory?.products.filter(p => p.is_pos_visible).length || 0}
                        </div>
                        <div className="text-[10px] font-bold text-indigo-600 mt-1 uppercase">↑ Visible on terminal</div>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            <span>Availability</span>
                        </div>
                        <div className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                            {selectedCategory?.products.filter(p => p.is_available).length || 0}
                        </div>
                        <div className="text-[10px] font-bold text-orange-600 mt-1 uppercase">~ In Stock</div>
                    </div>
                    <div className="p-6 flex flex-col justify-center bg-gray-50 dark:bg-gray-800/50">
                        <PrimaryButton 
                            onClick={() => {
                                productForm.setData({
                                    ...productForm.data,
                                    category_id: selectedCategory?.id || '',
                                    type: activeType,
                                    is_pos_visible: true,
                                    counters: [],
                                });
                                setIsProductModalOpen(true);
                            }}
                            className="w-full text-center justify-center text-[10px] font-black tracking-[0.2em]"
                        >
                            ADD NEW ITEM
                        </PrimaryButton>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-12 gap-8">
                    {/* Categories Sidebar */}
                    <div className="col-span-12 lg:col-span-3 space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categories</span>
                            <button className="text-[10px] font-black text-indigo-600 uppercase">Manage</button>
                        </div>
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                                        selectedCategory?.id === cat.id
                                            ? 'bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-900 dark:border-white'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <span className={`text-xs uppercase tracking-tight ${selectedCategory?.id === cat.id ? 'font-black text-gray-900 dark:text-white' : 'font-bold text-gray-500'}`}>{cat.name}</span>
                                    <span className="text-[9px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-400 px-1.5 py-0.5">{cat.products.length}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products List */}
                    <div className="col-span-12 lg:col-span-9 space-y-6">
                        <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">
                                {selectedCategory?.name || 'All Items'} / <span className="text-gray-400">Inventory</span>
                            </h3>
                            <div className="flex space-x-4">
                                <button className="text-[10px] font-black text-gray-400 uppercase hover:text-gray-900">Drill down</button>
                                <button className="text-[10px] font-black text-gray-400 uppercase hover:text-gray-900">Export</button>
                            </div>
                        </div>

                        {selectedCategory ? (
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                                {selectedCategory.products.map((product) => (
                                    <div key={product.id} className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-shrink-0 overflow-hidden">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-gray-300">N/A</div>
                                            )}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex items-center space-x-2">
                                                <h4 className="text-xs font-black uppercase tracking-tight text-gray-900 dark:text-white">{product.name}</h4>
                                                {!product.is_available && <span className="text-[8px] font-bold bg-rose-50 text-rose-600 px-1 py-0.5 border border-rose-100 uppercase">Out of stock</span>}
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-medium tracking-tight mt-0.5">{product.description || 'No description provided'}</p>
                                        </div>
                                        <div className="px-6 text-right">
                                            <div className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">KSh. {product.price}</div>
                                            <div className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">Unit Price</div>
                                        </div>
                                        <div className="px-6 border-l border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center space-x-1">
                                                {product.counters?.map(c => (
                                                    <span key={c.id} className="text-[8px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 uppercase tracking-tighter">{c.name}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="px-6 border-l border-gray-100 dark:border-gray-800">
                                            <div className={`text-[8px] font-black uppercase px-2 py-1 border ${product.is_pos_visible ? 'border-emerald-100 text-emerald-600' : 'border-gray-200 text-gray-400'}`}>
                                                {product.is_pos_visible ? 'POS Live' : 'POS Hidden'}
                                            </div>
                                        </div>
                                        <div className="ml-auto flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEditProduct(product)} className="text-[10px] font-black text-indigo-600 uppercase">Edit</button>
                                            <button onClick={() => { if(confirm('Delete?')) router.delete(route('menu.products.destroy', product.id)) }} className="text-[10px] font-black text-rose-600 uppercase">Del</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 border-dashed">
                                <span className="text-xs font-black text-gray-300 uppercase tracking-[0.2em]">Select a Category to View Inventory</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* PRODUCT MODAL - REFINED */}
            <Modal show={isProductModalOpen} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={handleProductSubmit} className="bg-white dark:bg-gray-950 border border-gray-900 dark:border-gray-800">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">{editingItem ? 'Update Item Config' : 'Register New Item'}</h3>
                        <button type="button" onClick={closeModal} className="text-[10px] font-black text-gray-400 hover:text-gray-900">[ESC] CLOSE</button>
                    </div>
                    
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <InputLabel value="Category" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                <select 
                                    value={productForm.data.category_id}
                                    onChange={(e) => productForm.setData('category_id', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-none text-xs font-bold uppercase p-3 focus:ring-0 focus:border-gray-900"
                                >
                                    <option value="">Choose Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <InputLabel value="Item Name" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                <TextInput
                                    value={productForm.data.name}
                                    onChange={(e) => productForm.setData('name', e.target.value)}
                                    className="w-full rounded-none border border-gray-200 bg-gray-50 focus:bg-white"
                                    placeholder="E.G. CLASSIC BEEF BURGER"
                                />
                            </div>
                            <div>
                                <InputLabel value="Unit Price (KSh.)" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                <TextInput
                                    type="number"
                                    step="0.01"
                                    value={productForm.data.price}
                                    onChange={(e) => productForm.setData('price', e.target.value)}
                                    className="w-full rounded-none border border-gray-200 bg-gray-50 focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 bg-[#f9fafb] dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 border-gray-300 rounded-none text-gray-900 focus:ring-0"
                                        checked={productForm.data.is_pos_visible}
                                        onChange={e => productForm.setData('is_pos_visible', e.target.checked)}
                                    />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Visible on POS Terminal</span>
                                </label>
                            </div>

                            <div>
                                <InputLabel value="Route to Counters" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                <div className="grid grid-cols-2 gap-2">
                                    {counters.map(counter => (
                                        <button
                                            key={counter.id}
                                            type="button"
                                            onClick={() => toggleCounter(counter.id)}
                                            className={`flex items-center justify-between px-3 py-2 text-[8px] font-black uppercase border transition-all ${
                                                productForm.data.counters.includes(counter.id)
                                                ? 'bg-gray-900 text-white border-gray-900'
                                                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400'
                                            }`}
                                        >
                                            <span>{counter.name}</span>
                                            {productForm.data.counters.includes(counter.id) && <span>✓</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <InputLabel value="Specifications" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                <textarea
                                    value={productForm.data.description}
                                    onChange={(e) => productForm.setData('description', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-none text-[10px] font-bold p-3 focus:ring-0 focus:border-gray-900"
                                    rows="3"
                                    placeholder="OPTIONAL ITEM DETAILS..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-[#f9fafb] dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex justify-end space-x-3">
                        <SecondaryButton onClick={closeModal} className="border-gray-200 text-gray-500">Discard</SecondaryButton>
                        <PrimaryButton disabled={productForm.processing} className="bg-gray-900 px-8">Save Configuration</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
