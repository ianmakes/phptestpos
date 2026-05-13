<?php

namespace Modules\MenuManagement\Controllers;

use App\Http\Controllers\Controller;
use Modules\MenuManagement\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('MenuManagement/Categories', [
            'categories' => Category::orderBy('name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:1024',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('icon_file')) {
            $path = $request->file('icon_file')->store('categories', 'public');
            $validated['icon'] = '/storage/' . $path;
        }

        Category::create($validated);

        return back()->with('success', 'Category created successfully.');
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:1024',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('icon_file')) {
            // Delete old icon
            if ($category->icon && str_contains($category->icon, '/storage/categories/')) {
                $oldPath = str_replace('/storage/', '', $category->icon);
                \Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('icon_file')->store('categories', 'public');
            $validated['icon'] = '/storage/' . $path;
        }

        $category->update($validated);

        return back()->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        if ($category->icon && str_contains($category->icon, '/storage/categories/')) {
            $oldPath = str_replace('/storage/', '', $category->icon);
            \Storage::disk('public')->delete($oldPath);
        }
        $category->delete();
        return back()->with('success', 'Category deleted successfully.');
    }
}
