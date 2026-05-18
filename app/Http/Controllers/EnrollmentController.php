<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnrollmentController extends Controller
{
    public function index()
    {
        $enrollments = Enrollment::with(['user', 'course'])->latest()->paginate(20);
        return view('enrollments.index', compact('enrollments'));
    }

    public function enroll(Course $course)
    {
        $user = Auth::user();
        Enrollment::firstOrCreate(
            ['user_id' => $user->id, 'course_id' => $course->id],
            ['status'  => 'enrolled']
        );
        return redirect()->route('courses.show', $course)->with('success', 'Enrolled successfully!');
    }

    public function enrollUser(Request $request, Course $course)
    {
        $data = $request->validate(['user_id' => 'required|exists:users,id']);
        Enrollment::firstOrCreate(
            ['user_id' => $data['user_id'], 'course_id' => $course->id],
            ['status'  => 'enrolled']
        );
        return back()->with('success', 'User enrolled.');
    }

    public function unenroll(Course $course)
    {
        Auth::user()->enrollments()->where('course_id', $course->id)->delete();
        return redirect()->route('courses.show', $course)->with('success', 'Unenrolled.');
    }

    public function report()
    {
        $enrollments = Enrollment::with(['user', 'course'])
            ->orderByDesc('updated_at')
            ->paginate(30);
        return view('enrollments.report', compact('enrollments'));
    }
}
