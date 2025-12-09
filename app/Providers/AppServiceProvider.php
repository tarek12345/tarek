<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
{
    Schema::defaultStringLength(191);

    // Ne pas exécuter en console (composer install, migrations, queue, etc.)
    if ($this->app->runningInConsole()) {
        return;
    }

    // Ne pas exécuter si la table n’existe pas encore
    if (!Schema::hasTable('users')) {
        return;
    }

    // Créer l'admin si la table existe et si elle est vide
    if (\App\Models\User::count() === 0) {
        \App\Models\User::create([
            'name' => 'Super Admin',
            'email' => 'admint@admin.com',
            'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
            'sexe' => 'homme',
            'role' => 'administrator',
            'profile_image' => null,
            'face_image' => null,
        ]);
    }
}

}
