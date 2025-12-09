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
        
    if (\App\Models\User::count() === 0) {
        \App\Models\User::create([
            'name' => 'Super Admin',
            'email' => 'admint@admin.com',
            'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
            'sexe' => 'homme',     // Mets ce que tu veux (ou supprime si non obligatoire)
            'role' => 'administrator',
            'profile_image' => null,
            'face_image' => null,
        ]);
    }
    }
}
