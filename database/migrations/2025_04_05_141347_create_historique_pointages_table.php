<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('historique_pointages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nom');
            $table->dateTime('arrival_date');
            $table->dateTime('last_departure')->nullable();
            $table->string('day'); // Ex: Lundi, Mardi...
            $table->string('week'); // Ex: Semaine 10
            $table->string('month'); // Ex: Mars
            $table->decimal('total_hours', 8, 2)->default(0); // Total hours worked
            $table->timestamps();
            $table->string('session_duration')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('historique_pointages');
    }
};

