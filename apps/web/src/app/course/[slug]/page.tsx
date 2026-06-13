'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { QASection } from '@/components/QASection';

interface Lesson {
  id: string;
  title: string;
  type: string;
  isPreview: boolean;
  sortOrder: number;
}

interface Section {
  id: string;
  title: string;
  sortOrder: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string | null;
  isFree: boolean;
  instructor: { id: string; name: string; avatarUrl: string | null; bio: string | null };
  sections: Section[];
  _count: { enrollments: number };
}

export default function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, token } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState('');

  useEffect(() => {
    if (!slug) return;
    api.get<Course>(`/courses/${slug}`)
      .then(setCourse)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!course?.id || !token) return;
    api.get<{ enrolled: boolean; progress?: number }>(`/courses/${course.id}/enrollment-status`)
      .then((s) => { setEnrolled(s.enrolled); if (s.progress !== undefined) setProgress(s.progress); })
      .catch(() => {});
  }, [course?.id, token]);

  const handleEnroll = async () => {
    if (!user) { setEnrollMsg('Please login to enroll'); return; }
    setEnrolling(true);
    setEnrollMsg('');
    try {
      await api.post(`/courses/${course!.id}/enroll`, {});
      setEnrolled(true);
      setEnrollMsg('Successfully enrolled!');
    } catch (err: any) {
      setEnrollMsg(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!course) return <div className="text-center py-12 text-gray-500">Course not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
        <p className="text-gray-600 text-lg mb-4">{course.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>By {course.instructor.name}</span>
          <span>{course._count.enrollments} enrolled</span>
          {course.difficulty && <span className="capitalize">{course.difficulty}</span>}
        </div>

        <div className="mt-4">
          {enrolled ? (
            <div className="flex items-center gap-4">
              <span className="text-green-600 font-medium">Enrolled</span>
              {progress > 0 && (
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{progress}%</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>
          )}
          {enrollMsg && (
            <p className={`text-sm mt-2 ${enrolled ? 'text-green-600' : 'text-red-600'}`}>{enrollMsg}</p>
          )}
        </div>
      </div>

      <div className="border rounded-xl bg-white overflow-hidden">
        {course.sections.map((section) => (
          <div key={section.id}>
            <div className="bg-gray-50 px-6 py-3 border-b">
              <h3 className="font-semibold text-gray-900">{section.title}</h3>
            </div>
            {section.lessons.map((lesson) => (
              <Link
                href={`/course/${slug}/lesson/${lesson.id}`}
                key={lesson.id}
                className="px-6 py-3 border-b last:border-b-0 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm">
                    {lesson.type === 'VIDEO' ? '▶' : lesson.type === 'TEXT' ? '📝' : '📄'}
                  </span>
                  <span className="text-sm text-gray-700">{lesson.title}</span>
                </div>
                {lesson.isPreview && (
                  <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                    Preview
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <QASection courseId={course.id} />
    </div>
  );
}
