<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::withCount('enrollments')->latest()->paginate(12);
        return view('courses.index', compact('courses'));
    }

    public function create()
    {
        return view('courses.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'         => 'required|string|max:255',
            'description'   => 'nullable|string',
            'version'       => 'required|string|max:20',
            'framework_tags'=> 'nullable|string',
            'status'        => 'required|in:draft,published,archived',
        ]);

        $tags = array_filter(array_map('trim', explode(',', $data['framework_tags'] ?? '')));
        $data['framework_tags'] = empty($tags) ? null : array_values($tags);
        $data['created_by']     = Auth::id();

        $course = Course::create($data);
        return redirect()->route('courses.show', $course)->with('success', 'Course created.');
    }

    public function show(Course $course)
    {
        $course->load('modules', 'creator');
        $enrollment = Auth::user()->enrollmentForCourse($course->id);
        return view('courses.show', compact('course', 'enrollment'));
    }

    public function edit(Course $course)
    {
        return view('courses.edit', compact('course'));
    }

    public function update(Request $request, Course $course)
    {
        $data = $request->validate([
            'title'         => 'required|string|max:255',
            'description'   => 'nullable|string',
            'version'       => 'required|string|max:20',
            'framework_tags'=> 'nullable|string',
            'status'        => 'required|in:draft,published,archived',
        ]);

        $tags = array_filter(array_map('trim', explode(',', $data['framework_tags'] ?? '')));
        $data['framework_tags'] = empty($tags) ? null : array_values($tags);

        $course->update($data);
        return redirect()->route('courses.show', $course)->with('success', 'Course updated.');
    }

    public function destroy(Course $course)
    {
        $course->delete();
        return redirect()->route('courses.index')->with('success', 'Course deleted.');
    }
}
