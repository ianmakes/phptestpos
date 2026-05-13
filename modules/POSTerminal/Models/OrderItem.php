<?php

namespace Modules\POSTerminal\Models;

use Illuminate\Database\Eloquent\Model;
use Modules\MenuManagement\Models\Product;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price',
        'subtotal',
        'notes'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
