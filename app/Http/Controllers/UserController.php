<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['roles', 'organization'])->latest()->paginate(20);
        return view('users.index', compact('users'));
    }

    public function create()
    {
        $roles = Role::pluck('name');
        $orgs  = Organization::orderBy('name')->get();
        return view('users.create', compact('roles', 'orgs'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'            => 'required|string|max:255',
            'email'           => 'required|email|unique:users',
            'password'        => 'required|min:8|confirmed',
            'role'            => 'required|exists:roles,name',
            'organization_id' => 'nullable|exists:organizations,id',
        ]);

        $user = User::create([
            'name'            => $data['name'],
            'email'           => $data['email'],
            'password'        => bcrypt($data['password']),
            'organization_id' => $data['organization_id'] ?? null,
        ]);
        $user->syncRoles([$data['role']]);

        return redirect()->route('users.index')->with('success', 'User created.');
    }

    public function edit(User $user)
    {
        $roles = Role::pluck('name');
        $orgs  = Organization::orderBy('name')->get();
        return view('users.edit', compact('user', 'roles', 'orgs'));
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name'            => 'required|string|max:255',
            'email'           => 'required|email|unique:users,email,' . $user->id,
            'role'            => 'required|exists:roles,name',
            'organization_id' => 'nullable|exists:organizations,id',
            'password'        => 'nullable|min:8|confirmed',
        ]);

        $user->update([
            'name'            => $data['name'],
            'email'           => $data['email'],
            'organization_id' => $data['organization_id'] ?? null,
        ]);

        if (!empty($data['password'])) {
            $user->update(['password' => bcrypt($data['password'])]);
        }

        $user->syncRoles([$data['role']]);
        return redirect()->route('users.index')->with('success', 'User updated.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index')->with('success', 'User deleted.');
    }
}
