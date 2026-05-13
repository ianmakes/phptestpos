<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PinLoginController extends Controller
{
    public function show()
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => \Illuminate\Support\Facades\Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'pin' => 'required|string|size:4',
        ]);

        $user = User::where('pin', $request->pin)->first();

        if ($user) {
            Auth::login($user);
            $request->session()->regenerate();

            return redirect()->intended(route('dashboard', absolute: false));
        }

        return back()->withErrors([
            'pin' => 'The provided PIN is incorrect.',
        ]);
    }
}
