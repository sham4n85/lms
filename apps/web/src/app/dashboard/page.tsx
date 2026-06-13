'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface Certificate {
  id: string;
  issuedAt: string;
  data: any;
  course: { id: string; title: string; slug: string; thumbnailUrl: string | null };
}

interface Enrollment {
  id: string;
  enrolledAt: string;
  progress: number;
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
    description: string | null;
    difficulty: string | null;
    instructor: { name: string };
  };
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }
    Promise.all([
      api.get<Enrollment[]>('/enrollments/my'),
      api.get<Certificate[]>('/certificates/my').catch(() => []),
    ])
      .then(([enr, certs]) => {
        setEnrollments(enr);
        setCertificates(certs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">Enrolled Courses</h2>
      {enrollments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border mb-8">
          <p className="text-gray-500 mb-4">You are not enrolled in any courses yet.</p>
          <Link
            href="/courses"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 mb-8">
          {enrollments.map((enr) => (
            <Link
              key={enr.id}
              href={`/course/${enr.course.slug}`}
              className="block bg-white border rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {enr.course.thumbnailUrl && (
                  <img
                    src={enr.course.thumbnailUrl}
                    alt={enr.course.title}
                    className="w-24 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{enr.course.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {enr.course.instructor.name}
                    {enr.course.difficulty && <> &middot; {enr.course.difficulty}</>}
                  </p>
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${enr.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600">{enr.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {certificates.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Certificates</h2>
          <div className="grid gap-4">
            {certificates.map((cert) => (
              <Link
                key={cert.id}
                href={`/certificate/${cert.id}`}
                className="block bg-white border border-yellow-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎓</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{cert.course.title}</h3>
                    <p className="text-sm text-gray-500">
                      Issued {new Date(cert.issuedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
