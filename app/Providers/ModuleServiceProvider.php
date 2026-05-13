<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\File;

class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $modulesPath = base_path('modules');

        if (File::exists($modulesPath)) {
            $modules = File::directories($modulesPath);

            foreach ($modules as $modulePath) {
                $moduleName = basename($modulePath);
                
                // Load migrations
                if (File::exists($modulePath . '/database/migrations')) {
                    $this->loadMigrationsFrom($modulePath . '/database/migrations');
                }

                // Load routes
                if (File::exists($modulePath . '/routes/web.php')) {
                    $this->loadRoutesFrom($modulePath . '/routes/web.php');
                }

                if (File::exists($modulePath . '/routes/api.php')) {
                    $this->loadRoutesFrom($modulePath . '/routes/api.php');
                }

                // Load views
                if (File::exists($modulePath . '/resources/views')) {
                    $this->loadViewsFrom($modulePath . '/resources/views', $moduleName);
                }
            }
        }
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
