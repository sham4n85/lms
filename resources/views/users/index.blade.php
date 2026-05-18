@extends('layouts.app')
@section('title', 'Users')
@section('content')
<div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Users</h1>
    <a href="{{ route('users.create') }}" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">+ Add User</a>
</div>

<div class="bg-white rounded-xl shadow overflow-hidden">
    <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
            <tr class="text-left text-gray-500">
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3">Email</th>
                <th class="px-4 py-3">Role</th>
                <th class="px-4 py-3">Organisation</th>
                <th class="px-4 py-3">Actions</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
            @forelse($users as $u)
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-gray-800">{{ $u->name }}</td>
                <td class="px-4 py-3 text-gray-500">{{ $u->email }}</td>
                <td class="px-4 py-3">
                    @foreach($u->roles as $r)
                    <span class="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">{{ $r->name }}</span>
                    @endforeach
                </td>
                <td class="px-4 py-3 text-gray-500">{{ $u->organization?->name ?? '—' }}</td>
                <td class="px-4 py-3">
                    <div class="flex gap-2">
                        <a href="{{ route('users.edit', $u) }}" class="text-indigo-600 hover:underline text-xs">Edit</a>
                        @if($u->id !== Auth::id())
                        <form method="POST" action="{{ route('users.destroy', $u) }}" onsubmit="return confirm('Delete user?')">
                            @csrf @method('DELETE')
                            <button class="text-red-500 hover:underline text-xs">Delete</button>
                        </form>
                        @endif
                    </div>
                </td>
            </tr>
            @empty
            <tr><td colspan="5" class="px-4 py-8 text-center text-gray-400">No users.</td></tr>
            @endforelse
        </tbody>
    </table>
</div>
<div class="mt-4">{{ $users->links() }}</div>
@endsection
