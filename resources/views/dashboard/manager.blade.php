@extends('layouts.app')
@section('title', 'Dashboard')
@section('content')
<h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

<div class="grid grid-cols-3 gap-4 mb-8">
    @foreach([
        ['Published Courses', $totalCourses, 'bg-indigo-100 text-indigo-700'],
        ['Total Enrollments', $totalEnrollments, 'bg-blue-100 text-blue-700'],
        ['Completions', $completions, 'bg-green-100 text-green-700'],
    ] as [$label, $val, $cls])
    <div class="bg-white rounded-xl shadow p-5">
        <p class="text-sm text-gray-500">{{ $label }}</p>
        <p class="text-3xl font-bold {{ $cls }} mt-1">{{ $val }}</p>
    </div>
    @endforeach
</div>

<div class="bg-white rounded-xl shadow p-6">
    <h2 class="font-semibold text-gray-700 mb-4">Recent Enrollments</h2>
    <table class="w-full text-sm">
        <thead><tr class="text-left text-gray-400 border-b"><th class="pb-2">User</th><th class="pb-2">Course</th><th class="pb-2">Status</th><th class="pb-2">Date</th></tr></thead>
        <tbody class="divide-y divide-gray-100">
            @foreach($recentEnrollments as $e)
            <tr>
                <td class="py-2">{{ $e->user->name }}</td>
                <td class="py-2">{{ $e->course->title }}</td>
                <td class="py-2">
                    @php $colors = ['enrolled'=>'bg-blue-100 text-blue-700','in_progress'=>'bg-yellow-100 text-yellow-700','completed'=>'bg-green-100 text-green-700']; @endphp
                    <span class="px-2 py-0.5 rounded-full text-xs {{ $colors[$e->status] ?? 'bg-gray-100 text-gray-700' }}">{{ str_replace('_',' ',ucfirst($e->status)) }}</span>
                </td>
                <td class="py-2 text-gray-400">{{ $e->created_at->format('d M Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    <a href="{{ route('enrollments.report') }}" class="text-indigo-600 text-sm mt-4 inline-block hover:underline">Full report →</a>
</div>
@endsection
