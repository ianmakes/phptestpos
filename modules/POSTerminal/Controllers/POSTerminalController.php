<?php

namespace Modules\POSTerminal\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\MenuManagement\Models\Category;
use Modules\MenuManagement\Models\Product;
use Modules\MenuManagement\Models\Counter;
use Modules\TableManagement\Models\Table;
use Modules\POSTerminal\Models\Order;
use Modules\POSTerminal\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class POSTerminalController extends Controller
{
    public function index()
    {
        $categories = Category::orderBy('sort_order')->get(['id', 'name', 'icon']);
        
        $productsQuery = Product::where('is_available', true);

        // Check if is_pos_visible column exists to prevent crash if migrations haven't run
        if (\Illuminate\Support\Facades\Schema::hasColumn('products', 'is_pos_visible')) {
            $productsQuery->where('is_pos_visible', true);
        }

        $products = $productsQuery->with('counters')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'category_id' => $product->category_id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'image_url' => $product->image_url,
                    'type' => $product->type ?? 'food', // Fallback if type column is missing
                ];
            });

        $tables = Table::where('status', 'available')
            ->get(['id', 'name', 'zone_id']);

        $counters = Counter::where('is_active', true)->get(['id', 'name']);

        return Inertia::render('POSTerminal/Terminal', [
            'categories' => $categories,
            'products' => $products,
            'tables' => $tables,
            'counters' => $counters,
            'currency' => 'KSh.'
        ]);
    }

    public function placeOrder(Request $request)
    {
        $validated = $request->validate([
            'table_id' => 'nullable|exists:tables,id',
            'counter_id' => 'required|exists:counters,id',
            'type' => 'required|in:dine_in,takeaway',
            'payment_method' => 'required|string',
            'amount_received' => 'required|numeric|min:' . $request->total_amount,
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'total_amount' => 'required|numeric',
        ]);

        return DB::transaction(function () use ($validated) {
            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'user_id' => auth()->id(),
                'table_id' => $validated['table_id'] ?? null,
                'counter_id' => $validated['counter_id'],
                'total_amount' => $validated['total_amount'],
                'status' => 'paid',
                'type' => $validated['type'],
            ]);

            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['quantity'] * $item['price'],
                ]);
            }

            // Create Transaction
            \Modules\POSTerminal\Models\Transaction::create([
                'order_id' => $order->id,
                'payment_method' => $validated['payment_method'],
                'amount' => $validated['total_amount'],
                'status' => 'completed',
                'reference_number' => 'TRX-' . strtoupper(uniqid()),
            ]);

            // Update table status if dine-in
            if ($validated['type'] === 'dine_in' && $validated['table_id']) {
                Table::where('id', $validated['table_id'])->update(['status' => 'occupied']);
            }

            return redirect()->back()->with('success', 'Order placed and paid successfully!');
        });
    }
    public function emergencyMigrate()
    {
        try {
            \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
            $output = \Illuminate\Support\Facades\Artisan::output();
            return response()->json([
                'status' => 'success',
                'message' => 'Migrations run successfully',
                'output' => $output
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
