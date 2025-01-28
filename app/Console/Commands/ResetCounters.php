<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Pointage;
use Carbon\Carbon;

class ResetCounters extends Command
{
    protected $signature = 'counters:reset';
    protected $description = 'Reset counters at midnight';

    public function handle()
    {
        // Réinitialiser tous les compteurs actifs
        Pointage::where('is_active', true)->update([
            'counter' => 0,
            'total_hours' => 0,
            'is_active' => false,
        ]);

        $this->info('Counters reset successfully.');
    }
}