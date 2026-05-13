<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('order_number')->unique();
            $blueprint->foreignId('user_id')->constrained();
            $blueprint->foreignId('table_id')->nullable()->constrained();
            $blueprint->foreignId('counter_id')->constrained();
            $blueprint->decimal('total_amount', 12, 2);
            $blueprint->enum('status', ['pending', 'paid', 'cancelled'])->default('pending');
            $blueprint->enum('type', ['dine_in', 'takeaway']);
            $blueprint->text('notes')->nullable();
            $blueprint->timestamps();
        });

        Schema::create('order_items', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('order_id')->constrained()->onDelete('cascade');
            $blueprint->foreignId('product_id')->constrained();
            $blueprint->integer('quantity');
            $blueprint->decimal('price', 12, 2);
            $blueprint->decimal('subtotal', 12, 2);
            $blueprint->text('notes')->nullable();
            $blueprint->timestamps();
        });

        Schema::create('transactions', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('order_id')->constrained();
            $blueprint->string('payment_method'); // cash, card, mpesa
            $blueprint->decimal('amount', 12, 2);
            $blueprint->string('status');
            $blueprint->string('reference_number')->nullable();
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
