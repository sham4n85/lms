<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('module_completions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enrollment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('module_id')->constrained()->cascadeOnDelete();
            $table->timestamp('completed_at')->useCurrent();
            $table->timestamps();
            $table->unique(['enrollment_id', 'module_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('module_completions');
    }
};
