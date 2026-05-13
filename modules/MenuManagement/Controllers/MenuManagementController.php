<?php

namespace Modules\MenuManagement\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\MenuManagement\Models\Category;
use Modules\MenuManagement\Models\Product;
use Modules\MenuManagement\Models\Counter;

class MenuManagementController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type', 'food');
        $categories = Category::with(['products' => function($query) use ($type) {
            $query->where('type', $type)
                  ->select(['id', 'category_id', 'name', 'description', 'price', 'image_url', 'is_available', 'type']);
        }])
        ->orderBy('sort_order')
        ->get(['id', 'name', 'icon', 'sort_order']);

        try {
            $counters = Counter::where('is_active', true)->get(['id', 'name']);
        } catch (\Exception $e) {
            $counters = collect();
        }

        return Inertia::render('MenuManagement/Index', [
            'categories' => $categories,
            'activeType' => $type,
            'counters' => $counters
        ]);
    }

    // Categories
    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);

        Category::create($validated);
        return back()->with('success', 'Category created.');
    }

    public function updateCategory(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);

        $category->update($validated);
        return back()->with('success', 'Category updated.');
    }

    public function destroyCategory(Category $category)
    {
        $category->delete();
        return back()->with('success', 'Category deleted.');
    }

    // Products
    public function storeProduct(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:food,ready_made',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_pos_visible' => 'required|boolean',
            'counters' => 'nullable|array',
            'counters.*' => 'exists:counters,id',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        try {
            $product = Product::create($validated);
        } catch (\Exception $e) {
            unset($validated['is_pos_visible']);
            $product = Product::create($validated);
        }
        
        try {
            if (isset($validated['counters'])) {
                $product->counters()->sync($validated['counters']);
            }
        } catch (\Exception $e) {
            // Ignore if tables don't exist yet
        }

        return back()->with('success', 'Product created.');
    }

    public function updateProduct(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:food,ready_made',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_pos_visible' => 'required|boolean',
            'counters' => 'nullable|array',
            'counters.*' => 'exists:counters,id',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($product->image_url) {
                $oldPath = str_replace('/storage/', '', $product->image_url);
                \Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('products', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        // Remove is_pos_visible if column missing
        $updateData = $validated;
        
        try {
            $product->update($updateData);
        } catch (\Exception $e) {
            unset($updateData['is_pos_visible']);
            $product->update($updateData);
        }
        
        try {
            if (isset($validated['counters'])) {
                $product->counters()->sync($validated['counters']);
            }
        } catch (\Exception $e) {
            // Ignore
        }

        return back()->with('success', 'Product updated.');
    }

    public function destroyProduct(Product $product)
    {
        if ($product->image_url) {
            $oldPath = str_replace('/storage/', '', $product->image_url);
            \Storage::disk('public')->delete($oldPath);
        }
        $product->delete();
        return back()->with('success', 'Product deleted.');
    }

    public function toggleAvailability(Product $product)
    {
        $product->update(['is_available' => !$product->is_available]);
        return back()->with('success', 'Availability updated.');
    }
}
