@extends('layouts.app')
@section('title', $organization->name)
@section('content')
<div class="max-w-4xl">
    <a href="{{ route('organizations.index') }}" class="text-indigo-600 text-sm hover:underline">← Organisations</a>
    <div class="flex items-center justify-between mt-2 mb-6">
        <h1 class="text-2xl font-bold text-gray-800">{{ $organization->name }}</h1>
        @hasrole('admin')
        <a href="{{ route('organizations.edit', $organization) }}" class="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50">Edit</a>
        @endhasrole
    </div>

    @if($organization->parent)
    <p class="text-sm text-gray-500 mb-4">Part of: <span class="font-medium">{{ $organization->parent->name }}</span></p>
    @endif

    @if($organization->children->isNotEmpty())
    <div class="mb-6">
        <h2 class="font-semibold text-gray-700 mb-2">Sub-organisations</h2>
        <div class="flex flex-wrap gap-2">
            @foreach($organization->children as $child)
            <a href="{{ route('organizations.show', $child) }}" class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">{{ $child->name }}</a>
            @endforeach
        </div>
    </div>
    @endif

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Subscriptions -->
        <div class="bg-white rounded-xl shadow p-5">
            <h2 class="font-semibold text-gray-700 mb-3">Subscriptions</h2>
            @forelse($organization->subscriptions->sortByDesc('start_date') as $sub)
            @php $subColors = ['active'=>'bg-green-100 text-green-700','expired'=>'bg-red-100 text-red-700','cancelled'=>'bg-gray-100 text-gray-500']; @endphp
            <div class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                    <p class="font-medium text-sm">{{ $sub->plan_name }}</p>
                    <p class="text-xs text-gray-400">{{ $sub->start_date->format('d M Y') }} → {{ $sub->end_date->format('d M Y') }}</p>
                </div>
                <span class="px-2 py-0.5 text-xs rounded-full {{ $subColors[$sub->status] ?? '' }}">{{ ucfirst($sub->status) }}</span>
            </div>
            @empty
            <p class="text-sm text-gray-400">No subscriptions.</p>
            @endforelse

            @hasrole('admin')
            <form method="POST" action="{{ route('organizations.subscriptions.store', $organization) }}" class="mt-4 space-y-3">
                @csrf
                <input type="text" name="plan_name" placeholder="Plan name" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <div class="grid grid-cols-2 gap-2">
                    <input type="date" name="start_date" required class="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <input type="date" name="end_date" required class="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                </div>
                <button class="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">Add Subscription</button>
            </form>
            @endhasrole
        </div>

        <!-- Users -->
        <div class="bg-white rounded-xl shadow p-5">
            <h2 class="font-semibold text-gray-700 mb-3">Members ({{ $organization->users->count() }})</h2>
            <div class="space-y-2 max-h-64 overflow-y-auto">
                @forelse($organization->users as $u)
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium">{{ $u->name }}</p>
                        <p class="text-xs text-gray-400">{{ $u->email }}</p>
                    </div>
                    <div class="flex gap-1">
                        @foreach($u->roles as $r)
                        <span class="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">{{ $r->name }}</span>
                        @endforeach
                    </div>
                </div>
                @empty
                <p class="text-sm text-gray-400">No members.</p>
                @endforelse
            </div>
        </div>
    </div>

    @hasrole('admin')
    <form method="POST" action="{{ route('organizations.destroy', $organization) }}" onsubmit="return confirm('Delete this organisation?')">
        @csrf @method('DELETE')
        <button class="px-3 py-1.5 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50">Delete Organisation</button>
    </form>
    @endhasrole
</div>
@endsection
