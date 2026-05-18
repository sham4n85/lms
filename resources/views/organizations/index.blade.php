@extends('layouts.app')
@section('title', 'Organisations')
@section('content')
<div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Organisations</h1>
    @hasrole('admin')
    <a href="{{ route('organizations.create') }}" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">+ Add Organisation</a>
    @endhasrole
</div>

<div class="bg-white rounded-xl shadow overflow-hidden">
    <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
            <tr class="text-left text-gray-500">
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3">Parent</th>
                <th class="px-4 py-3">Users</th>
                <th class="px-4 py-3">Subscription</th>
                <th class="px-4 py-3">Actions</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
            @forelse($orgs as $org)
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-gray-800">
                    <a href="{{ route('organizations.show', $org) }}" class="hover:text-indigo-600">{{ $org->name }}</a>
                </td>
                <td class="px-4 py-3 text-gray-500">{{ $org->parent?->name ?? '—' }}</td>
                <td class="px-4 py-3 text-gray-600">{{ $org->users_count }}</td>
                <td class="px-4 py-3">
                    @php $sub = $org->active_subscription; @endphp
                    @if($sub)
                    <span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">{{ $sub->plan_name }}</span>
                    @else
                    <span class="text-gray-400 text-xs">None</span>
                    @endif
                </td>
                <td class="px-4 py-3 flex gap-2">
                    <a href="{{ route('organizations.show', $org) }}" class="text-indigo-600 hover:underline text-xs">View</a>
                    @hasrole('admin')
                    <a href="{{ route('organizations.edit', $org) }}" class="text-gray-500 hover:underline text-xs">Edit</a>
                    @endhasrole
                </td>
            </tr>
            @empty
            <tr><td colspan="5" class="px-4 py-8 text-center text-gray-400">No organisations.</td></tr>
            @endforelse
        </tbody>
    </table>
</div>
<div class="mt-4">{{ $orgs->links() }}</div>
@endsection
