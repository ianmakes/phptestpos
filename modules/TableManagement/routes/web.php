<?php

use Illuminate\Support\Facades\Route;
use Modules\TableManagement\Controllers\TableManagementController;

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/tables', [TableManagementController::class, 'index'])->name('tables.index');
    
    // Zones
    Route::post('/zones', [TableManagementController::class, 'storeZone'])->name('zones.store');
    Route::put('/zones/{zone}', [TableManagementController::class, 'updateZone'])->name('zones.update');
    Route::delete('/zones/{zone}', [TableManagementController::class, 'destroyZone'])->name('zones.destroy');

    // Tables
    Route::post('/tables', [TableManagementController::class, 'storeTable'])->name('tables.store');
    Route::put('/tables/{table}', [TableManagementController::class, 'updateTable'])->name('tables.update');
    Route::patch('/tables/{table}/status', [TableManagementController::class, 'updateTableStatus'])->name('tables.update-status');
    Route::delete('/tables/{table}', [TableManagementController::class, 'destroyTable'])->name('tables.destroy');
});
