@extends('layouts.app')
@section('title', 'Edit Organisation')
@section('content')
<div class="max-w-lg">
    <a href="{{ route('organizations.show', $organization) }}" class="text-indigo-600 text-sm hover:underline">← {{ $organization->name }}</a>
    <h1 class="text-2xl font-bold text-gray-800 mt-2 mb-6">Edit Organisation</h1>

    <form method="POST" action="{{ route('organizations.update', $organization) }}" class="bg-white rounded-xl shadow p-6 space-y-5">
        @csrf @method('PUT')
        @include('organizations._form')
        <div class="flex justify-end gap-3">
            <a href="{{ route('organizations.show', $organization) }}" class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm">Cancel</a>
            <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">Save Changes</button>
        </div>
    </form>
</div>
@endsection
