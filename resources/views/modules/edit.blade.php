@extends('layouts.app')
@section('title', 'Edit Module')
@section('content')
<div class="max-w-2xl">
    <a href="{{ route('courses.show', $course) }}" class="text-indigo-600 text-sm hover:underline">← {{ $course->title }}</a>
    <h1 class="text-2xl font-bold text-gray-800 mt-2 mb-6">Edit Module</h1>

    <form method="POST" action="{{ route('courses.modules.update', [$course, $module]) }}" class="bg-white rounded-xl shadow p-6 space-y-5">
        @csrf @method('PUT')
        @include('modules._form')
        <div class="flex justify-end gap-3">
            <a href="{{ route('courses.show', $course) }}" class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm">Cancel</a>
            <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">Save Changes</button>
        </div>
    </form>
</div>
@endsection
