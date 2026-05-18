<div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Name <span class="text-red-500">*</span></label>
    <input type="text" name="name" value="{{ old('name', $user->name ?? '') }}" required
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
    @error('name')<p class="text-red-600 text-xs mt-1">{{ $message }}</p>@enderror
</div>

<div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
    <input type="email" name="email" value="{{ old('email', $user->email ?? '') }}" required
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
    @error('email')<p class="text-red-600 text-xs mt-1">{{ $message }}</p>@enderror
</div>

<div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Role <span class="text-red-500">*</span></label>
    <select name="role" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
        @foreach($roles as $role)
        <option value="{{ $role }}" {{ old('role', $user?->roles->first()?->name) === $role ? 'selected' : '' }}>{{ ucfirst($role) }}</option>
        @endforeach
    </select>
</div>

<div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Organisation</label>
    <select name="organization_id" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="">— None —</option>
        @foreach($orgs as $org)
        <option value="{{ $org->id }}" {{ old('organization_id', $user?->organization_id) == $org->id ? 'selected' : '' }}>{{ $org->name }}</option>
        @endforeach
    </select>
</div>
