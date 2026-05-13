<?php

namespace Modules\TableManagement\Controllers;

use App\Http\Controllers\Controller;
use Modules\TableManagement\Models\Zone;
use Modules\TableManagement\Models\Table;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TableManagementController extends Controller
{
    public function index()
    {
        $zones = Zone::with('tables')->get();
        return Inertia::render('TableManagement/Index', [
            'zones' => $zones
        ]);
    }

    // Zone Management
    public function storeZone(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:7',
        ]);

        Zone::create($validated);
        return back()->with('success', 'Zone created.');
    }

    public function updateZone(Request $request, Zone $zone)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:7',
        ]);

        $zone->update($validated);
        return back()->with('success', 'Zone updated.');
    }

    public function destroyZone(Zone $zone)
    {
        $zone->delete();
        return back()->with('success', 'Zone deleted.');
    }

    // Table Management
    public function storeTable(Request $request)
    {
        $validated = $request->validate([
            'zone_id' => 'required|exists:zones,id',
            'table_number' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
        ]);

        Table::create($validated);
        return back()->with('success', 'Table created.');
    }

    public function updateTable(Request $request, Table $table)
    {
        $validated = $request->validate([
            'zone_id' => 'required|exists:zones,id',
            'table_number' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
        ]);

        $table->update($validated);
        return back()->with('success', 'Table updated.');
    }

    public function updateTableStatus(Request $request, Table $table)
    {
        $request->validate([
            'status' => 'required|in:available,occupied,reserved',
        ]);

        $table->update(['status' => $request->status]);
        return back()->with('success', 'Status updated.');
    }

    public function destroyTable(Table $table)
    {
        $table->delete();
        return back()->with('success', 'Table deleted.');
    }
}
