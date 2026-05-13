<?php

namespace Modules\POSTerminal\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Modules\TableManagement\Models\Table;
use Modules\MenuManagement\Models\Counter;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'user_id',
        'table_id',
        'counter_id',
        'total_amount',
        'status',
        'type',
        'notes'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public function counter()
    {
        return $this->belongsTo(Counter::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
