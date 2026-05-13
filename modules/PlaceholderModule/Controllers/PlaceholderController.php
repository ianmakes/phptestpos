<?php

namespace Modules\PlaceholderModule\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PlaceholderController extends Controller
{
    public function show($moduleName)
    {
        return Inertia::render('Placeholder/ComingSoon', [
            'moduleName' => $moduleName
        ]);
    }
}
