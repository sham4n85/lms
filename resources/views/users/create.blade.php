@extends('layouts.app')
@section('title', 'Add User')
@section('content')
<div class="max-w-lg">
    <a href="{{ route('users.index') }}" class="text-indigo-600 text-sm hover:underline">← Users</a>
    <h1 class="text-2xl font-bold text-gray-800 mt-2 mb-6">Add User</h1>

    <form method="POST" action="{{ route('users.store') }}" class="bg-white rounded-xl shadow p-6 space-y-5">
        @csrf
        @include('users._form', ['user' => null])
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password <span class="text-red-500">*</span></label>
            <input type="password" name="password" required minlength="8"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input type="password" name="password_confirmation" required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>
        <div class="flex justify-end gap-3">
            <a href="{{ route('users.index') }}" class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm">Cancel</a>
            <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">Create User</button>
        </div>
    </form>
</div>
@endsection
