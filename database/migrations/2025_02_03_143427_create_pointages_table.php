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
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Foreign key linked to users table
            $table->time('arrival_date')->nullable(); // Arrival time
            $table->bigInteger('counter')->nullable(); // Counter in seconds
            $table->decimal('daily_hours', 8, 2)->default(0);
            $table->decimal('weekly_hours', 8, 2)->default(0);
            $table->decimal('monthly_hours', 8, 2)->default(0);
            $table->datetime('last_departure')->nullable(); // Last departure time
            $table->decimal('total_hours', 8, 2)->default(0); // Total hours worked
            $table->integer('paid_break')->default(0); // Paid break (in seconds)
            $table->string('location')->default('inconnue'); // Location
            $table->enum('status', ['aubureau', 'horsligne'])->default('aubureau'); // Status
            $table->boolean('is_active')->default(true); // Indicates if the session is active
            $table->timestamps(); // created_at and updated_at fields
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