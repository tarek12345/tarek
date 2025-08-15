<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTraitesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('traites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
             $table->string('pdf_path')->nullable();
            $table->string('nom');
            $table->string('rib');
            $table->string('date_echeance');
            $table->string('montant');
            $table->string('ml');
            $table->string('date_creation');
            $table->string('lieu');
            $table->string('lieuc');
            $table->integer('jours_restants')->nullable();
            $table->string('nd');
            $table->string('domicilation');
            $table->string('valeur_en');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('traites');
    }
}
