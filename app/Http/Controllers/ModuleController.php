<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Module;
use App\Models\ModuleCompletion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ModuleController extends Controller
{
    public function create(Course $course)
    {
        return view('modules.create', compact('course'));
    }

    public function store(Request $request, Course $course)
    {
        $data = $request->validate([
            'title'   => 'required|string|max:255',
            'type'    => 'required|in:text,video',
            'content' => 'nullable|string',
        ]);

        $data['position']  = $course->modules()->max('position') + 1;
        $data['course_id'] = $course->id;

        Module::create($data);
        return redirect()->route('courses.show', $course)->with('success', 'Module added.');
    }

    public function show(Course $course, Module $module)
    {
        $user       = Auth::user();
        $enrollment = $user->enrollmentForCourse($course->id);

        if (!$enrollment && $user->hasRole('learner')) {
            return redirect()->route('courses.show', $course)->with('error', 'Enroll first.');
        }

        $allModules = $course->modules;
        $current    = $allModules->search(fn($m) => $m->id === $module->id);
        $prev       = $current > 0 ? $allModules[$current - 1] : null;
        $next       = $current < $allModules->count() - 1 ? $allModules[$current + 1] : null;
        $completed  = $enrollment?->isModuleComplete($module->id) ?? false;

        return view('modules.show', compact('course', 'module', 'enrollment', 'prev', 'next', 'completed'));
    }

    public function complete(Request $request, Course $course, Module $module)
    {
        $user       = Auth::user();
        $enrollment = $user->enrollmentForCourse($course->id);
        abort_unless($enrollment, 403);

        ModuleCompletion::firstOrCreate([
            'enrollment_id' => $enrollment->id,
            'module_id'     => $module->id,
        ], ['completed_at' => now()]);

        // Update enrollment status
        $progress = $enrollment->progressPercent();
        if ($progress >= 100) {
            $enrollment->update(['status' => 'completed', 'completed_at' => now(), 'score' => 100]);
        } elseif ($enrollment->status === 'enrolled') {
            $enrollment->update(['status' => 'in_progress', 'started_at' => now()]);
        }

        $next = $course->modules()->where('position', '>', $module->position)->first();
        if ($next) {
            return redirect()->route('courses.modules.show', [$course, $next])->with('success', 'Module completed!');
        }
        return redirect()->route('courses.show', $course)->with('success', 'Course completed!');
    }

    public function edit(Course $course, Module $module)
    {
        return view('modules.edit', compact('course', 'module'));
    }

    public function update(Request $request, Course $course, Module $module)
    {
        $data = $request->validate([
            'title'   => 'required|string|max:255',
            'type'    => 'required|in:text,video',
            'content' => 'nullable|string',
        ]);
        $module->update($data);
        return redirect()->route('courses.show', $course)->with('success', 'Module updated.');
    }

    public function destroy(Course $course, Module $module)
    {
        $module->delete();
        return redirect()->route('courses.show', $course)->with('success', 'Module deleted.');
    }
}
