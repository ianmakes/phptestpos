<?php

namespace Modules\MenuManagement\Models;

use Illuminate\Database\Eloquent\Model;

class Counter extends Model
{
    protected $fillable = ['name', 'code', 'description', 'is_active'];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_counter');
    }
}
