<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $header) {
            $header->id();
            $header->string('name');
            $header->string('icon')->nullable();
            $header->integer('sort_order')->default(0);
            $header->boolean('is_active')->default(true);
            $header->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
