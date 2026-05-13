<?php

use Illuminate\Support\Facades\Route;
use Modules\MenuManagement\Controllers\MenuManagementController;
use Modules\MenuManagement\Controllers\CategoryController;

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/menu', [MenuManagementController::class, 'index'])->name('menu.index');
    
    // Categories
    Route::get('/menu/categories', [CategoryController::class, 'index'])->name('menu.categories.index');
    Route::post('/menu/categories', [CategoryController::class, 'store'])->name('menu.categories.store');
    Route::put('/menu/categories/{category}', [CategoryController::class, 'update'])->name('menu.categories.update');
    Route::delete('/menu/categories/{category}', [CategoryController::class, 'destroy'])->name('menu.categories.destroy');

    // Products
    Route::post('/menu/products', [MenuManagementController::class, 'storeProduct'])->name('menu.products.store');
    Route::put('/menu/products/{product}', [MenuManagementController::class, 'updateProduct'])->name('menu.products.update');
    Route::delete('/menu/products/{product}', [MenuManagementController::class, 'destroyProduct'])->name('menu.products.destroy');
    Route::patch('/menu/products/{product}/toggle', [MenuManagementController::class, 'toggleAvailability'])->name('menu.products.toggle');
});
