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
        Schema::create('tables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('zone_id')->constrained()->onDelete('cascade');
            $table->string('table_number');
            $table->integer('capacity')->default(2);
            $table->string('status')->default('available'); // available, occupied, reserved
            $table->integer('x_position')->default(0);
            $table->integer('y_position')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tables');
    }
};
