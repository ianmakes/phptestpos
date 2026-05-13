<?php

use Illuminate\Support\Facades\Route;
use Modules\POSTerminal\Controllers\POSTerminalController;

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/pos/terminal', [POSTerminalController::class, 'index'])->name('pos.terminal');
    Route::post('/pos/orders', [POSTerminalController::class, 'placeOrder'])->name('pos.orders.store');
});
