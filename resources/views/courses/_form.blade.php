<div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Title <span class="text-red-500">*</span></label>
    <input type="text" name="title" value="{{ old('title', $course->title ?? '') }}" required
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
    @error('title')<p class="text-red-600 text-xs mt-1">{{ $message }}</p>@enderror
</div>

<div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
    <textarea name="description" rows="3"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">{{ old('description', $course->description ?? '') }}</textarea>
</div>

<div class="grid grid-cols-2 gap-4">
    <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Version</label>
        <input type="text" name="version" value="{{ old('version', $course->version ?? '1.0') }}"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
    </div>
    <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select name="status" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            @foreach(['draft', 'published', 'archived'] as $s)
            <option value="{{ $s }}" {{ old('status', $course->status ?? 'draft') === $s ? 'selected' : '' }}>{{ ucfirst($s) }}</option>
            @endforeach
        </select>
    </div>
</div>

<div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Framework Tags <span class="text-gray-400 text-xs">(comma-separated)</span></label>
    <input type="text" name="framework_tags"
        value="{{ old('framework_tags', isset($course) && $course->framework_tags ? implode(', ', $course->framework_tags) : '') }}"
        placeholder="ISO 27001, NIS2, GDPR"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
</div>
