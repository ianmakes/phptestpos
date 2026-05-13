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
        Schema::table('products', function (Blueprint $table) {
            // Indexing common query filters and relationships
            $table->index(['type', 'is_available']);
            $table->index('category_id');
        });

        Schema::table('categories', function (Blueprint $table) {
            // Indexing sorting and active status
            $table->index('sort_order');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['type', 'is_available']);
            $table->dropIndex(['category_id']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex(['sort_order']);
            $table->dropIndex(['is_active']);
        });
    }
};
