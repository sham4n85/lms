@extends('layouts.app')
@section('title', $module->title)
@section('content')
<div class="max-w-3xl">
    <a href="{{ route('courses.show', $course) }}" class="text-indigo-600 text-sm hover:underline">← {{ $course->title }}</a>

    <div class="flex items-center justify-between mt-2 mb-6">
        <h1 class="text-2xl font-bold text-gray-800">{{ $module->title }}</h1>
        @if($completed)
        <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">✓ Completed</span>
        @endif
    </div>

    <div class="bg-white rounded-xl shadow p-6 mb-6 prose prose-indigo max-w-none">
        @if($module->type === 'video')
        <div class="aspect-video bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm mb-4">
            <p>Video content: {{ $module->content }}</p>
        </div>
        @else
        {!! $module->content !!}
        @endif
    </div>

    <div class="flex items-center justify-between">
        <div>
            @if($prev)
            <a href="{{ route('courses.modules.show', [$course, $prev]) }}" class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50">← Previous</a>
            @endif
        </div>
        <div class="flex gap-3">
            @if($enrollment && !$completed)
            <form method="POST" action="{{ route('courses.modules.complete', [$course, $module]) }}">
                @csrf
                <button class="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Mark Complete →</button>
            </form>
            @elseif($next)
            <a href="{{ route('courses.modules.show', [$course, $next]) }}" class="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Next →</a>
            @else
            <a href="{{ route('courses.show', $course) }}" class="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">Back to Course</a>
            @endif
        </div>
    </div>
</div>
@endsection
