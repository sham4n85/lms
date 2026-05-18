@extends('layouts.app')
@section('title', 'Enrollments')
@section('content')
<div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Enrollments</h1>
    <a href="{{ route('enrollments.report') }}" class="text-indigo-600 text-sm hover:underline">Full Report →</a>
</div>

<div class="bg-white rounded-xl shadow overflow-hidden">
    <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
            <tr class="text-left text-gray-500">
                <th class="px-4 py-3">User</th>
                <th class="px-4 py-3">Course</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">Progress</th>
                <th class="px-4 py-3">Enrolled</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
            @forelse($enrollments as $e)
            @php
                $colors = ['enrolled'=>'bg-blue-100 text-blue-700','in_progress'=>'bg-yellow-100 text-yellow-700','completed'=>'bg-green-100 text-green-700'];
                $pct = $e->progressPercent();
            @endphp
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3">
                    <p class="font-medium text-gray-800">{{ $e->user->name }}</p>
                    <p class="text-gray-400 text-xs">{{ $e->user->email }}</p>
                </td>
                <td class="px-4 py-3">
                    <a href="{{ route('courses.show', $e->course) }}" class="text-indigo-600 hover:underline">{{ $e->course->title }}</a>
                </td>
                <td class="px-4 py-3">
                    <span class="px-2 py-0.5 rounded-full text-xs {{ $colors[$e->status] ?? 'bg-gray-100 text-gray-700' }}">{{ str_replace('_',' ',ucfirst($e->status)) }}</span>
                </td>
                <td class="px-4 py-3 w-32">
                    <div class="flex items-center gap-2">
                        <div class="flex-1 h-2 bg-gray-200 rounded-full">
                            <div class="h-2 rounded-full {{ $pct >= 100 ? 'bg-green-500' : 'bg-indigo-500' }}" style="width:{{ $pct }}%"></div>
                        </div>
                        <span class="text-xs text-gray-500 w-8">{{ $pct }}%</span>
                    </div>
                </td>
                <td class="px-4 py-3 text-gray-400">{{ $e->created_at->format('d M Y') }}</td>
            </tr>
            @empty
            <tr><td colspan="5" class="px-4 py-8 text-center text-gray-400">No enrollments yet.</td></tr>
            @endforelse
        </tbody>
    </table>
</div>
<div class="mt-4">{{ $enrollments->links() }}</div>
@endsection
