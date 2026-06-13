'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface Stats {
  totalUsers: number;
  totalInstructors: number;
  totalStudents: number;
  totalCourses: number;
  publishedCourses: number;
  activeEnrollments: number;
  totalRevenue: number;
  totalCertificates: number;
}

interface User {
  id: string; name: string; email: string; role: string;
  emailVerified: boolean; createdAt: string;
  _count: { enrollments: number; instructorCourses: number };
}

interface Course {
  id: string; title: string; slug: string;
  isPublished: boolean; isFree: boolean; difficulty: string | null;
  createdAt: string;
  instructor: { id: string; name: string };
  _count: { enrollments: number; sections: number };
}

type Tab = 'overview' | 'users' | 'courses';

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesPage, setCoursesPage] = useState(1);
  const [coursesTotal, setCoursesTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'ADMIN') { router.push('/'); return; }
    loadStats();
    loadUsers();
    loadCourses();
    setLoading(false);
  }, [user, authLoading, router]);

  const loadStats = async () => {
    const s = await api.get<Stats>('/admin/stats').catch(() => null);
    setStats(s);
  };

  const loadUsers = async (page = 1) => {
    const res = await api.get<{ users: User[]; total: number; page: number }>(`/admin/users?page=${page}&limit=20`);
    setUsers(res.users);
    setUsersTotal(res.total);
    setUsersPage(res.page);
  };

  const loadCourses = async (page = 1) => {
    const res = await api.get<{ courses: Course[]; total: number; page: number }>(`/admin/courses?page=${page}&limit=20`);
    setCourses(res.courses);
    setCoursesTotal(res.total);
    setCoursesPage(res.page);
  };

  const changeRole = async (id: string, role: string) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role });
      loadUsers(usersPage);
    } catch {}
  };

  const togglePublished = async (id: string) => {
    try {
      await api.patch(`/admin/courses/${id}/toggle-published`, {});
      loadCourses(coursesPage);
      loadStats();
    } catch {}
  };

  if (authLoading || loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!user || user.role !== 'ADMIN') return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'users', label: `Users (${usersTotal})` },
    { key: 'courses', label: `Courses (${coursesTotal})` },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm rounded-md font-medium ${
              tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Users" value={stats.totalUsers} />
          <StatCard label="Instructors" value={stats.totalInstructors} />
          <StatCard label="Students" value={stats.totalStudents} />
          <StatCard label="Courses" value={`${stats.publishedCourses}/${stats.totalCourses}`} />
          <StatCard label="Enrollments" value={stats.activeEnrollments} />
          <StatCard label="Certificates" value={stats.totalCertificates} />
          <StatCard label="Revenue" value={`$${Number(stats.totalRevenue).toFixed(2)}`} />
        </div>
      )}

      {tab === 'users' && (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">Verified</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="INSTRUCTOR">Instructor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {u.emailVerified ? <span className="text-green-600">✓</span> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    E: {u._count.enrollments} · C: {u._count.instructorCourses}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center px-4 py-3 bg-gray-50 text-sm">
            <button disabled={usersPage <= 1} onClick={() => loadUsers(usersPage - 1)}
              className="text-indigo-600 disabled:text-gray-300">Previous</button>
            <span>Page {usersPage} of {Math.ceil(usersTotal / 20)}</span>
            <button disabled={usersPage >= Math.ceil(usersTotal / 20)} onClick={() => loadUsers(usersPage + 1)}
              className="text-indigo-600 disabled:text-gray-300">Next</button>
          </div>
        </div>
      )}

      {tab === 'courses' && (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Instructor</th>
                <th className="text-left px-4 py-3 font-medium">Published</th>
                <th className="text-left px-4 py-3 font-medium">Enrollments</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.title}</td>
                  <td className="px-4 py-3 text-gray-500">{c.instructor.name}</td>
                  <td className="px-4 py-3">
                    {c.isPublished
                      ? <span className="text-green-600">Published</span>
                      : <span className="text-yellow-600">Draft</span>}
                  </td>
                  <td className="px-4 py-3">{c._count.enrollments}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublished(c.id)}
                      className={`text-xs px-3 py-1 rounded ${
                        c.isPublished
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {c.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center px-4 py-3 bg-gray-50 text-sm">
            <button disabled={coursesPage <= 1} onClick={() => loadCourses(coursesPage - 1)}
              className="text-indigo-600 disabled:text-gray-300">Previous</button>
            <span>Page {coursesPage} of {Math.ceil(coursesTotal / 20)}</span>
            <button disabled={coursesPage >= Math.ceil(coursesTotal / 20)} onClick={() => loadCourses(coursesPage + 1)}
              className="text-indigo-600 disabled:text-gray-300">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
