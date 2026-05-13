<?php

namespace Modules\MenuManagement\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = ['category_id', 'type', 'name', 'description', 'price', 'image_url', 'is_available', 'is_pos_visible'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function counters(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Counter::class, 'product_counter');
    }
}
