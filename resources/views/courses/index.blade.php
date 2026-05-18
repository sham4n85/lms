@extends('layouts.app')
@section('title', 'Courses')
@section('content')
<div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Courses</h1>
    @hasrole('admin|manager')
    <a href="{{ route('courses.create') }}" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">+ Create Course</a>
    @endhasrole
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    @forelse($courses as $course)
    @php $enrollment = Auth::user()->enrollmentForCourse($course->id); @endphp
    <div class="bg-white rounded-xl shadow hover:shadow-md transition-shadow p-5 flex flex-col">
        <div class="flex-1">
            <div class="flex items-start justify-between gap-2">
                <h3 class="font-semibold text-gray-800">{{ $course->title }}</h3>
                @php $statusColors = ['published'=>'bg-green-100 text-green-700','draft'=>'bg-yellow-100 text-yellow-700','archived'=>'bg-gray-100 text-gray-500']; @endphp
                <span class="px-2 py-0.5 text-xs rounded-full {{ $statusColors[$course->status] ?? '' }} whitespace-nowrap">{{ ucfirst($course->status) }}</span>
            </div>
            <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ $course->description }}</p>
            @if($course->framework_tags)
            <div class="mt-2 flex flex-wrap gap-1">
                @foreach($course->framework_tags as $tag)
                <span class="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">{{ $tag }}</span>
                @endforeach
            </div>
            @endif
            <p class="text-xs text-gray-400 mt-2">{{ $course->enrollments_count }} enrolled &middot; v{{ $course->version }}</p>
        </div>
        <div class="mt-4 flex gap-2">
            <a href="{{ route('courses.show', $course) }}" class="flex-1 text-center py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">View</a>
            @if(!$enrollment && Auth::user()->hasRole('learner') && $course->status === 'published')
            <form method="POST" action="{{ route('courses.enroll', $course) }}">@csrf
                <button class="px-3 py-2 border border-indigo-600 text-indigo-600 rounded-lg text-sm hover:bg-indigo-50">Enroll</button>
            </form>
            @endif
        </div>
    </div>
    @empty
    <div class="col-span-3 text-center py-16 text-gray-400">No courses found.</div>
    @endforelse
</div>
<div class="mt-6">{{ $courses->links() }}</div>
@endsection
