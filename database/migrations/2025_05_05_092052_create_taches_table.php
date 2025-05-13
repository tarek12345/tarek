<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTachesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('taches', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description')->nullable();
            $table->enum('statut', ['todo', 'in_progress', 'done'])->default('todo');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('ordre')->nullable();
            $table->text('commentaire')->nullable(); // ✅ Ligne ajoutée ici
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
        Schema::dropIfExists('taches');
    }
}
