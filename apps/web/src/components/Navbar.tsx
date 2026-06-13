'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export function Navbar() {
  const { user, logout, isLoading } = useAuth();

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          LMS Platform
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/courses" className="text-sm text-gray-600 hover:text-gray-900">
            Courses
          </Link>
          {!isLoading && user ? (
            <>
              {user.role === 'INSTRUCTOR' && (
                <Link
                  href="/instructor/courses"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Instructor
                </Link>
              )}
              <span className="text-sm text-gray-500">{user.name}</span>
              <button
                onClick={logout}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
