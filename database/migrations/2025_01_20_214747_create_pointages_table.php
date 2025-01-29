<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePointagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pointages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Clé étrangère liée à la table users
            $table->time('arrival_date')->nullable(); // Heure d'arrivée
            $table->time('counter')->nullable(); // Compteur au format HH:MM:SS 
            $table->decimal('weekly_hours', 8, 2)->default(0); // Ajout de la colonne weekly_hours
            $table->decimal('monthly_hours', 8, 2)->default(0); // Ajout de la colonne monthly_hours
            $table->bigInteger('counter')->change(); // Remplacez TIME par BIGINT
            $table->datetime('last_departure')->nullable(); // Dernier départ
            $table->decimal('total_hours', 8, 2)->default(0); // Total des heures travaillées
            $table->integer('paid_break')->default(0); // Pause rémunérée (en secondes)
            $table->string('location')->default('inconnue'); // Emplacement
            $table->enum('status', ['aubureau', 'horsligne'])->default('aubureau'); // Statut
            $table->boolean('is_active')->default(true); // Indique si la session est active
            $table->timestamps(); // Champs created_at et updated_at
        });
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pointages');
    }
}
