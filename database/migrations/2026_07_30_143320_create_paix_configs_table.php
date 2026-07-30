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
        Schema::create('paix_configs', function (Blueprint $table) {
            $table->id();

            $table->string('nom');
            $table->string('prenom');
            $table->string('matricule');
            $table->string('cin');
            $table->string('cnss');
            $table->string('poste');

            $table->string('entreprise');
            $table->string('matricule_fiscal');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paix_configs');
    }
};