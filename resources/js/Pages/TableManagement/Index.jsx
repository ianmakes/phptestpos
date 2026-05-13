import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function TableManagement({ zones }) {
    const [selectedZone, setSelectedZone] = useState(zones[0] || null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'manage'
    const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const zoneForm = useForm({
        name: '',
        color: '#4f46e5',
    });

    const tableForm = useForm({
        zone_id: selectedZone?.id || '',
        table_number: '',
        capacity: 2,
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-900/20';
            case 'occupied': return 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/10 dark:text-rose-400 dark:border-rose-900/20';
            case 'reserved': return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-900/20';
            default: return 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-900/10 dark:text-slate-400 dark:border-slate-900/20';
        }
    };

    const handleZoneSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            zoneForm.put(route('zones.update', editingItem.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            zoneForm.post(route('zones.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleTableSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            tableForm.put(route('tables.update', editingItem.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            tableForm.post(route('tables.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const closeModal = () => {
        setIsZoneModalOpen(false);
        setIsTableModalOpen(false);
        setEditingItem(null);
        zoneForm.reset();
        tableForm.reset();
    };

    const openEditZone = (zone) => {
        setEditingItem(zone);
        zoneForm.setData({ name: zone.name, color: zone.color });
        setIsZoneModalOpen(true);
    };

    const openEditTable = (table) => {
        setEditingItem(table);
        tableForm.setData({ 
            zone_id: table.zone_id, 
            table_number: table.table_number, 
            capacity: table.capacity 
        });
        setIsTableModalOpen(true);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">
                    Table Management
                </h2>
            }
        >
            <Head title="Table Management" />

            <div className="space-y-8">
                {/* Mode Switcher Inside Content */}
                <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex space-x-1 bg-gray-50 dark:bg-gray-800 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center space-x-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                                viewMode === 'grid' 
                                ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            <span>Live Overview</span>
                        </button>
                        <button
                            onClick={() => setViewMode('manage')}
                            className={`flex items-center space-x-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                                viewMode === 'manage' 
                                ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span>Configuration</span>
                        </button>
                    </div>
                </div>

                {/* Zone Tabs */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    {zones.map((zone) => (
                        <button
                            key={zone.id}
                            onClick={() => setSelectedZone(zone)}
                            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl whitespace-nowrap transition-all border-2 ${
                                selectedZone?.id === zone.id
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none'
                                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-800 hover:border-indigo-200'
                            }`}
                        >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.color }}></span>
                            <span className="font-semibold text-sm">{zone.name}</span>
                        </button>
                    ))}
                    {viewMode === 'manage' && (
                        <button
                            onClick={() => setIsZoneModalOpen(true)}
                            className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 hover:bg-indigo-100 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    )}
                </div>

                {viewMode === 'grid' ? (
                    /* GRID OVERVIEW */
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {selectedZone?.tables.map((table) => (
                            <div
                                key={table.id}
                                className={`group relative aspect-square rounded-[2rem] border-2 transition-all duration-500 hover:scale-105 cursor-pointer flex flex-col items-center justify-center p-4 ${getStatusColor(table.status)}`}
                            >
                                <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className={`w-2 h-2 rounded-full ${table.status === 'available' ? 'bg-emerald-500' : table.status === 'occupied' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                                </div>
                                <span className="text-4xl font-black mb-1">{table.table_number}</span>
                                <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/10 text-[10px] font-bold uppercase tracking-widest opacity-80">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Cap: {table.capacity}</span>
                                </div>
                                <div className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em] opacity-60">
                                    {table.status}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* MANAGEMENT TABLE */
                    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800 dark:text-white">Tables in {selectedZone?.name}</h3>
                            <PrimaryButton onClick={() => {
                                tableForm.setData('zone_id', selectedZone.id);
                                setIsTableModalOpen(true);
                            }}>
                                Add New Table
                            </PrimaryButton>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        <th className="px-6 py-4">Table #</th>
                                        <th className="px-6 py-4">Capacity</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {selectedZone?.tables.map((table) => (
                                        <tr key={table.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-800 dark:text-white">{table.table_number}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{table.capacity} Persons</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(table.status)}`}>
                                                    {table.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => openEditTable(table)} className="text-indigo-600 hover:text-indigo-800 font-bold text-xs uppercase tracking-widest">Edit</button>
                                                <button onClick={() => { if(confirm('Delete?')) useForm().delete(route('tables.destroy', table.id)) }} className="text-rose-600 hover:text-rose-800 font-bold text-xs uppercase tracking-widest">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* ZONE MODAL */}
            <Modal show={isZoneModalOpen} onClose={closeModal}>
                <form onSubmit={handleZoneSubmit} className="p-8">
                    <h3 className="text-xl font-bold mb-6">{editingItem ? 'Edit Zone' : 'Create New Zone'}</h3>
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Zone Name" />
                            <TextInput
                                id="name"
                                value={zoneForm.data.name}
                                onChange={(e) => zoneForm.setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="e.g. Main Hall"
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="color" value="Accent Color" />
                            <input
                                type="color"
                                value={zoneForm.data.color}
                                onChange={(e) => zoneForm.setData('color', e.target.value)}
                                className="mt-1 block w-full h-10 rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                            />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-3">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={zoneForm.processing}>
                            {editingItem ? 'Update Zone' : 'Create Zone'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* TABLE MODAL */}
            <Modal show={isTableModalOpen} onClose={closeModal}>
                <form onSubmit={handleTableSubmit} className="p-8">
                    <h3 className="text-xl font-bold mb-6">{editingItem ? 'Edit Table' : 'Add New Table'}</h3>
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="table_number" value="Table Identifier" />
                            <TextInput
                                id="table_number"
                                value={tableForm.data.table_number}
                                onChange={(e) => tableForm.setData('table_number', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="e.g. T12"
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="capacity" value="Capacity (Persons)" />
                            <TextInput
                                id="capacity"
                                type="number"
                                value={tableForm.data.capacity}
                                onChange={(e) => tableForm.setData('capacity', e.target.value)}
                                className="mt-1 block w-full"
                            />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-3">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={tableForm.processing}>
                            {editingItem ? 'Save Changes' : 'Add Table'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
