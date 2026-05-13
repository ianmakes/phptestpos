<?php

namespace Modules\TableManagement\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Zone extends Model
{
    protected $fillable = ['name', 'color', 'is_active'];

    public function tables(): HasMany
    {
        return $this->hasMany(Table::class);
    }
}
