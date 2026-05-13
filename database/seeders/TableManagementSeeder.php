<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\TableManagement\Models\Zone;
use Modules\TableManagement\Models\Table;

class TableManagementSeeder extends Seeder
{
    public function run(): void
    {
        $zones = [
            ['name' => 'Indoor', 'color' => '#4f46e5'],
            ['name' => 'Outdoor', 'color' => '#10b981'],
            ['name' => 'Bar', 'color' => '#f59e0b'],
            ['name' => 'VIP', 'color' => '#8b5cf6'],
        ];

        foreach ($zones as $zoneData) {
            $zone = Zone::create($zoneData);

            for ($i = 1; $i <= 5; $i++) {
                Table::create([
                    'zone_id' => $zone->id,
                    'table_number' => $zone->name[0] . $i,
                    'capacity' => rand(2, 6),
                    'status' => 'available',
                ]);
            }
        }
    }
}
