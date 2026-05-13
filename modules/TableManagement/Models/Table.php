<?php

namespace Modules\TableManagement\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Table extends Model
{
    protected $fillable = [
        'zone_id',
        'table_number',
        'capacity',
        'status', // available, occupied, reserved
        'x_position', // for visual layout
        'y_position', // for visual layout
    ];

    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class);
    }
}
