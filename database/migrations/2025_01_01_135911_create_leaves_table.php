<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLeavesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('leaves', function (Blueprint $table) {
            $table->id();
            // Allow pointage_id to be nullable
            $table->foreignId('pointage_id')->nullable()->constrained()->onDelete('cascade'); // Relation avec 'pointages'
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null'); // Créateur du congé
            $table->date('start_date');
            $table->date('end_date');
            $table->string('reason'); // Exemple : "vacances", "maladie"
            $table->foreignId('replacant')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending'); // Statut du congé
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
        Schema::dropIfExists('leaves');
    }
}
