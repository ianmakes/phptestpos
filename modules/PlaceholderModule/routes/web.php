<?php

use Illuminate\Support\Facades\Route;
use Modules\PlaceholderModule\Controllers\PlaceholderController;

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/stock/units', [PlaceholderController::class, 'show'])->defaults('moduleName', 'ingredient-units')->name('ingredients.units');
    Route::get('/stock/categories', [PlaceholderController::class, 'show'])->defaults('moduleName', 'ingredient-categories')->name('ingredients.categories');
    Route::get('/stock/ingredients', [PlaceholderController::class, 'show'])->defaults('moduleName', 'ingredients')->name('ingredients.index');
    Route::get('/stock/modifiers', [PlaceholderController::class, 'show'])->defaults('moduleName', 'modifiers')->name('modifiers.index');
    Route::get('/stock/premade', [PlaceholderController::class, 'show'])->defaults('moduleName', 'pre-made-food')->name('premade.index');
    Route::get('/operations/kitchen', [PlaceholderController::class, 'show'])->defaults('moduleName', 'kitchen-kot')->name('kitchen.index');
    Route::get('/operations/history', [PlaceholderController::class, 'show'])->defaults('moduleName', 'orders-history')->name('orders.index');
    Route::get('/admin/reports', [PlaceholderController::class, 'show'])->defaults('moduleName', 'reports')->name('reports.index');
    Route::get('/admin/users', [PlaceholderController::class, 'show'])->defaults('moduleName', 'user-access')->name('users.index');
    Route::get('/admin/settings', [PlaceholderController::class, 'show'])->defaults('moduleName', 'settings')->name('settings.index');
});
