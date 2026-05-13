<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create roles
        $adminRole = \Spatie\Permission\Models\Role::create(['name' => 'admin']);
        $cashierRole = \Spatie\Permission\Models\Role::create(['name' => 'cashier']);
        $waiterRole = \Spatie\Permission\Models\Role::create(['name' => 'waiter']);
        $kitchenRole = \Spatie\Permission\Models\Role::create(['name' => 'kitchen']);

        // Create Admin user
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'pin' => '1234',
        ]);

        $admin->assignRole($adminRole);

        // Create a test cashier
        $cashier = User::factory()->create([
            'name' => 'Test Cashier',
            'email' => 'cashier@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'pin' => '0000',
        ]);

        $cashier->assignRole($cashierRole);
    }
}
