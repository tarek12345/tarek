<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('paies', function (Blueprint $table) {
  $table->id();

$table->foreignId('user_id')
->constrained()
->cascadeOnDelete();


$table->string('nom');
$table->string('prenom')->nullable();
$table->string('matricule')->nullable();
$table->string('cin')->nullable();
$table->string('cnss')->nullable();
$table->string('poste')->nullable();


$table->boolean('chef_famille')
->default(false);

$table->integer('nombre_enfants')
->default(0);


$table->decimal('salaire_brut',10,3);

$table->decimal('retenue_cnss',10,3);

$table->decimal('salaire_brut_imposable',10,3);

$table->decimal('retenue_source',10,3);

$table->decimal('contribution_sociale',10,3);

$table->decimal('salaire_net',10,3);


$table->string('entreprise')->nullable();

$table->string('matricule_fiscal')->nullable();


$table->string('mois')->nullable();

$table->string('annee')->nullable();


$table->string('pdf_path')->nullable();


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
        Schema::dropIfExists('paies');
    }
}
