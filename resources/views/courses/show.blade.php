@extends('layouts.app')
@section('title', $course->title)
@section('content')
<div class="max-w-4xl">
    <div class="flex items-start justify-between gap-4 mb-2">
        <div>
            <a href="{{ route('courses.index') }}" class="text-indigo-600 text-sm hover:underline">← Courses</a>
            <h1 class="text-2xl font-bold text-gray-800 mt-1">{{ $course->title }}</h1>
        </div>
        @hasrole('admin|manager')
        <div class="flex gap-2 mt-6">
            <a href="{{ route('courses.edit', $course) }}" class="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50">Edit</a>
            <a href="{{ route('courses.modules.create', $course) }}" class="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">+ Module</a>
        </div>
        @endhasrole
    </div>

    @if($course->description)
    <p class="text-gray-600 mt-2">{{ $course->description }}</p>
    @endif

    <div class="flex flex-wrap gap-2 mt-3">
        @if($course->framework_tags)
        @foreach($course->framework_tags as $tag)
        <span class="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">{{ $tag }}</span>
        @endforeach
        @endif
        <span class="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">v{{ $course->version }}</span>
    </div>

    @if($enrollment)
    @php $pct = $enrollment->progressPercent(); @endphp
    <div class="mt-4 bg-white rounded-xl shadow p-4">
        <div class="flex justify-between text-sm text-gray-600 mb-1">
            <span>Your progress</span><span class="font-medium">{{ $pct }}%</span>
        </div>
        <div class="h-3 bg-gray-200 rounded-full">
            <div class="h-3 rounded-full {{ $pct >= 100 ? 'bg-green-500' : 'bg-indigo-500' }}" style="width:{{ $pct }}%"></div>
        </div>
        <p class="text-xs text-gray-400 mt-1">Status: {{ str_replace('_',' ',ucfirst($enrollment->status)) }}</p>
    </div>
    @elseif(Auth::user()->hasRole('learner') && $course->status === 'published')
    <form method="POST" action="{{ route('courses.enroll', $course) }}" class="mt-4">
        @csrf
        <button class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Enroll in this Course</button>
    </form>
    @endif

    <div class="mt-8">
        <h2 class="text-lg font-semibold text-gray-700 mb-3">Modules ({{ $course->modules->count() }})</h2>
        @forelse($course->modules as $i => $module)
        @php $done = $enrollment?->isModuleComplete($module->id); @endphp
        <div class="flex items-center gap-4 bg-white rounded-xl shadow p-4 mb-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                {{ $done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600' }}">
                {{ $done ? '✓' : ($i + 1) }}
            </div>
            <div class="flex-1">
                <p class="font-medium text-gray-800">{{ $module->title }}</p>
                <p class="text-xs text-gray-400">{{ ucfirst($module->type) }}</p>
            </div>
            @if($enrollment || !Auth::user()->hasRole('learner'))
            <a href="{{ route('courses.modules.show', [$course, $module]) }}"
               class="px-3 py-1.5 text-sm rounded-lg {{ $done ? 'bg-gray-100 text-gray-600' : 'bg-indigo-600 text-white hover:bg-indigo-700' }}">
               {{ $done ? 'Review' : 'Start' }}
            </a>
            @endif
            @hasrole('admin|manager')
            <a href="{{ route('courses.modules.edit', [$course, $module]) }}" class="text-gray-400 hover:text-gray-600 text-sm">Edit</a>
            <form method="POST" action="{{ route('courses.modules.destroy', [$course, $module]) }}" onsubmit="return confirm('Delete module?')">
                @csrf @method('DELETE')
                <button class="text-red-400 hover:text-red-600 text-sm">Delete</button>
            </form>
            @endhasrole
        </div>
        @empty
        <p class="text-gray-400 text-sm">No modules yet.</p>
        @endforelse
    </div>

    @hasrole('admin|manager')
    <div class="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
        <p class="text-sm text-gray-500">{{ $course->enrollments->count() }} learners enrolled</p>
        <form method="POST" action="{{ route('courses.destroy', $course) }}" onsubmit="return confirm('Delete this course?')">
            @csrf @method('DELETE')
            <button class="px-3 py-1.5 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50">Delete Course</button>
        </form>
    </div>
    @endhasrole
</div>
@endsection
