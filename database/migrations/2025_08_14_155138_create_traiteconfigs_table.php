<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('traite_configs', function (Blueprint $table) {
            $table->id();
            $table->string('fournisseur', 255);
            $table->string('rib', 255);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('traite_configs');
    }
};
