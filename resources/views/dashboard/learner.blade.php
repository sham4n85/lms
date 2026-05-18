@extends('layouts.app')
@section('title', 'My Learning')
@section('content')
<h1 class="text-2xl font-bold text-gray-800 mb-6">My Learning</h1>

@if($enrollments->isNotEmpty())
<section class="mb-10">
    <h2 class="text-lg font-semibold text-gray-700 mb-4">My Courses</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        @foreach($enrollments as $e)
        @php $pct = $e->progressPercent(); @endphp
        <div class="bg-white rounded-xl shadow hover:shadow-md transition-shadow p-5 flex flex-col">
            <div class="flex-1">
                <h3 class="font-semibold text-gray-800">{{ $e->course->title }}</h3>
                <p class="text-xs text-gray-500 mt-1">v{{ $e->course->version }}</p>
                <div class="mt-3">
                    <div class="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span><span>{{ $pct }}%</span>
                    </div>
                    <div class="h-2 bg-gray-200 rounded-full">
                        <div class="h-2 rounded-full {{ $pct >= 100 ? 'bg-green-500' : 'bg-indigo-500' }}" style="width:{{ $pct }}%"></div>
                    </div>
                </div>
            </div>
            <a href="{{ route('courses.show', $e->course) }}"
               class="mt-4 block text-center py-2 rounded-lg text-sm font-medium
               {{ $e->status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-indigo-600 text-white hover:bg-indigo-700' }}">
               {{ $e->status === 'completed' ? 'Review' : ($e->status === 'in_progress' ? 'Continue →' : 'Start →') }}
            </a>
        </div>
        @endforeach
    </div>
</section>
@endif

@if($available->isNotEmpty())
<section>
    <h2 class="text-lg font-semibold text-gray-700 mb-4">Available Courses</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        @foreach($available as $course)
        <div class="bg-white rounded-xl shadow hover:shadow-md transition-shadow p-5 flex flex-col">
            <div class="flex-1">
                <h3 class="font-semibold text-gray-800">{{ $course->title }}</h3>
                <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ $course->description }}</p>
                @if($course->framework_tags)
                <div class="mt-2 flex flex-wrap gap-1">
                    @foreach($course->framework_tags as $tag)
                    <span class="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">{{ $tag }}</span>
                    @endforeach
                </div>
                @endif
            </div>
            <form method="POST" action="{{ route('courses.enroll', $course) }}" class="mt-4">
                @csrf
                <button class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">Enroll</button>
            </form>
        </div>
        @endforeach
    </div>
</section>
@endif

@if($enrollments->isEmpty() && $available->isEmpty())
<div class="text-center py-16 text-gray-400">No courses available yet.</div>
@endif
@endsection
