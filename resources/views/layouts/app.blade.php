<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'LMS') — LearnHub</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: { DEFAULT: '#4f46e5', dark: '#3730a3', light: '#e0e7ff' }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-50 min-h-screen flex flex-col">

<nav class="bg-brand shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <a href="{{ route('dashboard') }}" class="text-white font-bold text-xl tracking-tight">LearnHub</a>
            <div class="flex items-center gap-6">
                <a href="{{ route('courses.index') }}" class="text-indigo-100 hover:text-white text-sm">Courses</a>
                @hasrole('admin|manager|hr')
                <a href="{{ route('enrollments.index') }}" class="text-indigo-100 hover:text-white text-sm">Enrollments</a>
                @endhasrole
                @hasrole('admin|manager')
                <a href="{{ route('organizations.index') }}" class="text-indigo-100 hover:text-white text-sm">Organisations</a>
                @endhasrole
                @hasrole('admin')
                <a href="{{ route('users.index') }}" class="text-indigo-100 hover:text-white text-sm">Users</a>
                @endhasrole
                <span class="text-indigo-200 text-sm">{{ Auth::user()->name }}</span>
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button class="text-indigo-100 hover:text-white text-sm">Sign out</button>
                </form>
            </div>
        </div>
    </div>
</nav>

<main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
    @if(session('success'))
        <div class="mb-4 px-4 py-3 bg-green-100 border border-green-300 text-green-800 rounded-lg text-sm">{{ session('success') }}</div>
    @endif
    @if(session('error'))
        <div class="mb-4 px-4 py-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm">{{ session('error') }}</div>
    @endif
    @yield('content')
</main>

<footer class="text-center text-xs text-gray-400 py-4 border-t border-gray-200">
    LearnHub &copy; {{ date('Y') }}
</footer>
</body>
</html>
