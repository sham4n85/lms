<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Auth
Route::get('/login', [AuthController::class, 'showLogin'])->name('login')->middleware('guest');
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

Route::middleware('auth')->group(function () {

    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Courses
    Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
    Route::get('/courses/create', [CourseController::class, 'create'])->name('courses.create')->middleware('role:admin|manager');
    Route::post('/courses', [CourseController::class, 'store'])->name('courses.store')->middleware('role:admin|manager');
    Route::get('/courses/{course}', [CourseController::class, 'show'])->name('courses.show');
    Route::get('/courses/{course}/edit', [CourseController::class, 'edit'])->name('courses.edit')->middleware('role:admin|manager');
    Route::put('/courses/{course}', [CourseController::class, 'update'])->name('courses.update')->middleware('role:admin|manager');
    Route::delete('/courses/{course}', [CourseController::class, 'destroy'])->name('courses.destroy')->middleware('role:admin');

    // Modules (nested under courses)
    Route::get('/courses/{course}/modules/create', [ModuleController::class, 'create'])->name('courses.modules.create')->middleware('role:admin|manager');
    Route::post('/courses/{course}/modules', [ModuleController::class, 'store'])->name('courses.modules.store')->middleware('role:admin|manager');
    Route::get('/courses/{course}/modules/{module}', [ModuleController::class, 'show'])->name('courses.modules.show');
    Route::post('/courses/{course}/modules/{module}/complete', [ModuleController::class, 'complete'])->name('courses.modules.complete');
    Route::get('/courses/{course}/modules/{module}/edit', [ModuleController::class, 'edit'])->name('courses.modules.edit')->middleware('role:admin|manager');
    Route::put('/courses/{course}/modules/{module}', [ModuleController::class, 'update'])->name('courses.modules.update')->middleware('role:admin|manager');
    Route::delete('/courses/{course}/modules/{module}', [ModuleController::class, 'destroy'])->name('courses.modules.destroy')->middleware('role:admin|manager');

    // Enrollments
    Route::post('/courses/{course}/enroll', [EnrollmentController::class, 'enroll'])->name('courses.enroll');
    Route::delete('/courses/{course}/unenroll', [EnrollmentController::class, 'unenroll'])->name('courses.unenroll');
    Route::post('/courses/{course}/enroll-user', [EnrollmentController::class, 'enrollUser'])->name('courses.enroll-user')->middleware('role:admin|manager|hr');
    Route::get('/enrollments', [EnrollmentController::class, 'index'])->name('enrollments.index')->middleware('role:admin|manager|hr');
    Route::get('/enrollments/report', [EnrollmentController::class, 'report'])->name('enrollments.report')->middleware('role:admin|manager|hr');

    // Users
    Route::resource('users', UserController::class)->middleware('role:admin');

    // Organisations
    Route::resource('organizations', OrganizationController::class)->middleware('role:admin|manager');
    Route::post('/organizations/{organization}/subscriptions', [OrganizationController::class, 'addSubscription'])->name('organizations.subscriptions.store')->middleware('role:admin');
});
