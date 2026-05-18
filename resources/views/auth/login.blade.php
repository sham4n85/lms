<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign in — LearnHub</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
    <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-indigo-600">LearnHub</h1>
            <p class="text-gray-500 mt-1 text-sm">Learning Management System</p>
        </div>

        <form method="POST" action="{{ route('login') }}" class="space-y-5">
            @csrf
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value="{{ old('email') }}" required autofocus
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 @error('email') border-red-400 @enderror">
                @error('email')<p class="text-red-600 text-xs mt-1">{{ $message }}</p>@enderror
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" name="password" required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
            <div class="flex items-center gap-2">
                <input type="checkbox" name="remember" id="remember" class="rounded text-indigo-600">
                <label for="remember" class="text-sm text-gray-600">Remember me</label>
            </div>
            <button type="submit"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm">
                Sign in
            </button>
        </form>

        <p class="text-center text-xs text-gray-400 mt-6">
            Demo accounts: admin@lms.local / manager@lms.local / learner@lms.local — password: <code>password</code>
        </p>
    </div>
</body>
</html>
