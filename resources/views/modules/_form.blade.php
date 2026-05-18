<div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Title <span class="text-red-500">*</span></label>
    <input type="text" name="title" value="{{ old('title', $module->title ?? '') }}" required
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
    @error('title')<p class="text-red-600 text-xs mt-1">{{ $message }}</p>@enderror
</div>

<div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
    <select name="type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="text" {{ old('type', $module->type ?? 'text') === 'text' ? 'selected' : '' }}>Text / HTML</option>
        <option value="video" {{ old('type', $module->type ?? '') === 'video' ? 'selected' : '' }}>Video URL</option>
    </select>
</div>

<div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
    <textarea name="content" rows="12"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Enter HTML content or video URL...">{{ old('content', $module->content ?? '') }}</textarea>
    <p class="text-xs text-gray-400 mt-1">For text modules, HTML is supported. For video, enter a video URL or embed code.</p>
</div>
