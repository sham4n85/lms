'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface CertificateData {
  id: string;
  issuedAt: string;
  data: {
    userName: string;
    courseTitle: string;
    instructorName: string;
    issuedAt: string;
    completionDate: string;
    totalLessons: number;
  } | null;
  course: { title: string; slug: string };
  user: { name: string };
}

export default function CertificatePage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const [cert, setCert] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    if (!id) return;
    api.get<CertificateData>(`/certificates/${id}`)
      .then(setCert)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, user, authLoading]);

  if (authLoading || loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!cert) return <div className="text-center py-12 text-gray-500">Certificate not found</div>;

  const info = cert.data || {
    userName: cert.user.name,
    courseTitle: cert.course.title,
    instructorName: '',
    issuedAt: cert.issuedAt,
    completionDate: cert.issuedAt,
    totalLessons: 0,
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white border-4 border-yellow-400 rounded-2xl p-12 text-center shadow-xl">
        <div className="text-6xl mb-4">🎓</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate of Completion</h1>
        <p className="text-gray-500 mb-8">This certifies that</p>
        <p className="text-2xl font-bold text-indigo-600 mb-4">{info.userName}</p>
        <p className="text-gray-500 mb-2">has successfully completed the course</p>
        <p className="text-xl font-semibold text-gray-900 mb-6">{info.courseTitle}</p>
        <div className="text-sm text-gray-400 space-y-1">
          <p>Instructor: {info.instructorName}</p>
          <p>Completed: {new Date(info.completionDate).toLocaleDateString()}</p>
          <p>Total Lessons: {info.totalLessons}</p>
        </div>
        <div className="mt-8 pt-8 border-t">
          <p className="text-xs text-gray-400">Certificate ID: {cert.id}</p>
        </div>
      </div>

      <div className="text-center mt-6">
        <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
