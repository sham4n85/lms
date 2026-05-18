<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->hasRole('admin')) {
            return view('dashboard.admin', [
                'totalUsers'       => User::count(),
                'totalCourses'     => Course::count(),
                'totalEnrollments' => Enrollment::count(),
                'completions'      => Enrollment::where('status', 'completed')->count(),
                'recentUsers'      => User::latest()->take(5)->get(),
            ]);
        }

        if ($user->hasAnyRole(['manager', 'hr'])) {
            return view('dashboard.manager', [
                'totalCourses'     => Course::where('status', 'published')->count(),
                'totalEnrollments' => Enrollment::count(),
                'completions'      => Enrollment::where('status', 'completed')->count(),
                'recentEnrollments'=> Enrollment::with(['user', 'course'])->latest()->take(10)->get(),
            ]);
        }

        // Learner
        $enrollments = $user->enrollments()->with('course')->latest()->get();
        $available   = Course::where('status', 'published')
            ->whereNotIn('id', $enrollments->pluck('course_id'))
            ->take(6)
            ->get();

        return view('dashboard.learner', compact('enrollments', 'available'));
    }
}
