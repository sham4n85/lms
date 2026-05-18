<div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Name <span class="text-red-500">*</span></label>
    <input type="text" name="name" value="{{ old('name', $organization->name ?? '') }}" required
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
    @error('name')<p class="text-red-600 text-xs mt-1">{{ $message }}</p>@enderror
</div>

<div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Parent Organisation</label>
    <select name="parent_id" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="">— None (top level) —</option>
        @foreach($parents as $p)
        <option value="{{ $p->id }}" {{ old('parent_id', $organization->parent_id ?? '') == $p->id ? 'selected' : '' }}>{{ $p->name }}</option>
        @endforeach
    </select>
</div>
