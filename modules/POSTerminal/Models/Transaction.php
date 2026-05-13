<?php

namespace Modules\POSTerminal\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'order_id',
        'payment_method',
        'amount',
        'status',
        'reference_number'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
