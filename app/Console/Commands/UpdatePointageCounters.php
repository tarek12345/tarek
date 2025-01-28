<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Pointage;
use Carbon\Carbon;

class UpdatePointageCounters extends Command
{
    protected $signature = 'pointage:update-counters';
    protected $description = 'Mettre à jour les compteurs de pointages actifs.';

    public function handle()
    {
        $activePointages = Pointage::where('is_active', true)->get();

        foreach ($activePointages as $pointage) {
            $arrivalTime = Carbon::parse($pointage->arrival_date);
            $elapsedSeconds = Carbon::now()->diffInSeconds($arrivalTime);

            $pointage->update(['counter' => $elapsedSeconds]);
        }

        $this->info('Compteurs mis à jour avec succès.');
    }
}
