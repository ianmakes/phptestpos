<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Add is_pos_visible to products
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_pos_visible')->default(true)->after('is_available');
        });

        // 2. Create counters table
        Schema::create('counters', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Create pivot table for products and counters
        Schema::create('product_counter', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('counter_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_counter');
        Schema::dropIfExists('counters');
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('is_pos_visible');
        });
    }
};
