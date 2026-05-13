import React, { useState, useMemo } from 'react';
import POSLayout from '@/Layouts/POSLayout';
import { Head, router } from '@inertiajs/react';

export default function Terminal({ auth, categories, products, tables, counters, currency }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState([]);
    const [orderType, setOrderType] = useState('dine_in');
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedCounter, setSelectedCounter] = useState(counters[0]?.id || null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showTableModal, setShowTableModal] = useState(false);

    // Filtering logic
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = selectedCategory ? product.category_id === selectedCategory : true;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, searchQuery]);

    // Cart logic
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handlePlaceOrder = () => {
        if (cart.length === 0) return;
        if (orderType === 'dine_in' && !selectedTable) {
            setShowTableModal(true);
            return;
        }

        router.post(route('pos.orders.store'), {
            table_id: selectedTable,
            counter_id: selectedCounter,
            type: orderType,
            items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            total_amount: cartTotal
        }, {
            onSuccess: () => {
                setCart([]);
                setSelectedTable(null);
                setShowPaymentModal(false);
            }
        });
    };

    return (
        <POSLayout user={auth.user}>
            <Head title="Terminal" />
            
            <div className="h-full flex bg-white overflow-hidden">
                {/* 1. Sidebar - Categories */}
                <div className="w-24 border-r border-gray-900 bg-gray-50 flex flex-col">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`flex-1 flex flex-col items-center justify-center space-y-2 border-b border-gray-900 transition-all ${!selectedCategory ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest text-center px-1">All Items</span>
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex-1 flex flex-col items-center justify-center space-y-2 border-b border-gray-900 transition-all ${selectedCategory === cat.id ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest text-center px-1">{cat.name}</span>
                        </button>
                    ))}
                </div>

                {/* 2. Center Area - Products */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Search & Filters */}
                    <div className="h-16 border-b border-gray-900 flex items-center px-6 space-x-4 bg-white">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="SEARCH MENU..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-10 bg-gray-50 border border-gray-900 text-xs font-black uppercase tracking-widest px-4 focus:ring-0 focus:border-gray-900 placeholder-gray-300"
                            />
                        </div>
                        <div className="flex bg-gray-50 border border-gray-900 p-1">
                            <button 
                                onClick={() => setOrderType('dine_in')}
                                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${orderType === 'dine_in' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-900'}`}
                            >
                                Dine In
                            </button>
                            <button 
                                onClick={() => setOrderType('takeaway')}
                                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${orderType === 'takeaway' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-900'}`}
                            >
                                Takeaway
                            </button>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filteredProducts.map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="group relative flex flex-col bg-white border border-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    <div className="aspect-square w-full bg-gray-100 border-b border-gray-900 relative overflow-hidden">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-10">
                                                <span className="font-black text-4xl">POS</span>
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-gray-900 text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest">
                                            {currency} {product.price}
                                        </div>
                                    </div>
                                    <div className="p-3 text-left">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{product.type}</p>
                                        <p className="text-xs font-black uppercase tracking-tight line-clamp-2">{product.name}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Right Sidebar - Order Details */}
                <div className="w-96 border-l border-gray-900 flex flex-col bg-white">
                    <div className="p-6 border-b border-gray-900 flex items-center justify-between">
                        <h2 className="text-sm font-black uppercase tracking-widest">Current Order</h2>
                        {selectedTable && (
                            <div className="bg-gray-900 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest">
                                Table {tables.find(t => t.id === selectedTable)?.name}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-4">
                                <span className="font-black text-xs uppercase tracking-widest">Cart is empty</span>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="flex items-center space-x-3 p-3 border border-gray-900 bg-gray-50">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black uppercase tracking-tight truncate">{item.name}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{currency} {item.price}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="w-8 h-8 flex items-center justify-center border border-gray-900 hover:bg-gray-900 hover:text-white transition-all font-black"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="w-8 h-8 flex items-center justify-center border border-gray-900 hover:bg-gray-900 hover:text-white transition-all font-black"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-6 bg-gray-50 border-t border-gray-900 space-y-4">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span>{currency} {cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>Tax (0%)</span>
                                <span>{currency} 0</span>
                            </div>
                            <div className="flex justify-between items-end pt-2">
                                <span className="text-xs font-black uppercase tracking-widest">Total Amount</span>
                                <span className="text-xl font-black">{currency} {cartTotal}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-4">
                            <button 
                                onClick={() => setCart([])}
                                className="h-12 border border-gray-900 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all"
                            >
                                Clear
                            </button>
                            <button 
                                onClick={() => setShowPaymentModal(true)}
                                disabled={cart.length === 0}
                                className="h-12 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Pay Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white border border-gray-900 w-full max-w-4xl h-[600px] flex overflow-hidden">
                        {/* Summary Column */}
                        <div className="w-1/3 bg-gray-50 border-r border-gray-900 flex flex-col">
                            <div className="p-6 border-b border-gray-900">
                                <h3 className="text-sm font-black uppercase tracking-widest">Order Summary</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-start">
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black uppercase tracking-tight truncate">{item.name}</p>
                                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="text-[10px] font-black">{currency} {item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 border-t border-gray-900 bg-gray-100">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Payable Amount</span>
                                    <span className="text-2xl font-black">{currency} {cartTotal}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Column */}
                        <div className="flex-1 flex flex-col">
                            <div className="p-6 border-b border-gray-900 flex items-center justify-between">
                                <h3 className="text-sm font-black uppercase tracking-widest">Select Payment Method</h3>
                                <button onClick={() => setShowPaymentModal(false)} className="font-black text-xl">&times;</button>
                            </div>
                            
                            <div className="flex-1 p-8">
                                <div className="grid grid-cols-3 gap-6">
                                    {['CASH', 'CARD', 'M-PESA'].map(method => (
                                        <button
                                            key={method}
                                            className="aspect-square border border-gray-900 flex flex-col items-center justify-center space-y-4 hover:bg-gray-900 hover:text-white transition-all group"
                                        >
                                            <div className="w-12 h-12 bg-gray-100 border border-gray-900 flex items-center justify-center group-hover:bg-white group-hover:text-gray-900">
                                                {method === 'CASH' && '💵'}
                                                {method === 'CARD' && '💳'}
                                                {method === 'M-PESA' && '📱'}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">{method}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-12 space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Amount Received</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">{currency}</span>
                                            <input
                                                type="number"
                                                className="w-full h-16 border border-gray-900 bg-gray-50 px-16 text-2xl font-black focus:ring-0 focus:border-gray-900"
                                                defaultValue={cartTotal}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-4 bg-gray-50 border border-gray-900">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Balance/Change</p>
                                            <p className="text-xl font-black">{currency} 0.00</p>
                                        </div>
                                        <button
                                            onClick={handlePlaceOrder}
                                            className="bg-gray-900 text-white font-black uppercase tracking-widest hover:bg-black transition-all"
                                        >
                                            Complete Order
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Table Selection Modal */}
            {showTableModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white border border-gray-900 w-full max-w-2xl max-h-[80vh] flex flex-col">
                        <div className="p-6 border-b border-gray-900 flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-widest">Select Table</h3>
                            <button onClick={() => setShowTableModal(false)} className="font-black text-xl">&times;</button>
                        </div>
                        <div className="p-6 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {tables.map(table => (
                                <button
                                    key={table.id}
                                    onClick={() => {
                                        setSelectedTable(table.id);
                                        setShowTableModal(false);
                                    }}
                                    className={`aspect-square border border-gray-900 flex flex-col items-center justify-center transition-all ${selectedTable === table.id ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}
                                >
                                    <span className="text-lg font-black">{table.name}</span>
                                    <span className="text-[8px] font-bold uppercase tracking-widest mt-1 opacity-50">Zone {table.zone_id}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </POSLayout>
    );
}
