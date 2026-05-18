@extends('layouts.app')
@section('title', 'Admin Dashboard')
@section('content')
<h1 class="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    @foreach([
        ['Users', $totalUsers, 'bg-indigo-100 text-indigo-700'],
        ['Courses', $totalCourses, 'bg-purple-100 text-purple-700'],
        ['Enrollments', $totalEnrollments, 'bg-blue-100 text-blue-700'],
        ['Completions', $completions, 'bg-green-100 text-green-700'],
    ] as [$label, $val, $cls])
    <div class="bg-white rounded-xl shadow p-5">
        <p class="text-sm text-gray-500">{{ $label }}</p>
        <p class="text-3xl font-bold {{ $cls }} mt-1">{{ $val }}</p>
    </div>
    @endforeach
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="bg-white rounded-xl shadow p-6">
        <h2 class="font-semibold text-gray-700 mb-4">Recent Users</h2>
        <table class="w-full text-sm">
            <thead><tr class="text-left text-gray-400 border-b"><th class="pb-2">Name</th><th class="pb-2">Email</th><th class="pb-2">Role</th></tr></thead>
            <tbody class="divide-y divide-gray-100">
                @foreach($recentUsers as $u)
                <tr>
                    <td class="py-2">{{ $u->name }}</td>
                    <td class="py-2 text-gray-500">{{ $u->email }}</td>
                    <td class="py-2">
                        @foreach($u->roles as $r)
                        <span class="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">{{ $r->name }}</span>
                        @endforeach
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        <a href="{{ route('users.index') }}" class="text-indigo-600 text-sm mt-4 inline-block hover:underline">View all users →</a>
    </div>

    <div class="bg-white rounded-xl shadow p-6">
        <h2 class="font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div class="flex flex-col gap-3">
            <a href="{{ route('courses.create') }}" class="block px-4 py-3 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 text-center">+ Create Course</a>
            <a href="{{ route('users.create') }}" class="block px-4 py-3 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 text-center">+ Add User</a>
            <a href="{{ route('organizations.create') }}" class="block px-4 py-3 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 text-center">+ Add Organisation</a>
            <a href="{{ route('enrollments.report') }}" class="block px-4 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 text-center">View Enrollment Report</a>
        </div>
    </div>
</div>
@endsection
