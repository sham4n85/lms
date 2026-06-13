'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface Lesson {
  id: string;
  title: string;
  type: string;
  content: string | null;
  videoUrl: string | null;
  pdfUrl: string | null;
  audioUrl: string | null;
  liveStreamUrl: string | null;
  externalVideoUrl: string | null;
  isPreview: boolean;
  sortOrder: number;
  section: {
    course: { id: string; title: string };
  };
}

export default function LessonPage() {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
  const { user, token } = useAuth();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    api.get<Lesson>(`/lessons/${lessonId}`)
      .then((data) => {
        setLesson(data);
        setCompleted(false);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [lessonId]);

  useEffect(() => {
    if (!lessonId || !token) return;
    api.get<{ completed: boolean }>(`/lessons/${lessonId}/progress`)
      .then((p) => setCompleted(p.completed))
      .catch(() => {});
  }, [lessonId, token]);

  const markComplete = async () => {
    if (!token) { router.push('/login'); return; }
    await api.post(`/lessons/${lessonId}/complete`, {});
    setCompleted(true);
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading lesson...</div>;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>
        <Link href={`/course/${slug}`} className="text-indigo-600 hover:underline">
          Back to course
        </Link>
      </div>
    );
  }

  if (!lesson) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/course/${slug}`}
          className="text-sm text-indigo-600 hover:underline"
        >
          &larr; Back to {lesson.section.course.title}
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
        <span className="capitalize bg-gray-100 px-2 py-0.5 rounded">{lesson.type.toLowerCase()}</span>
        {lesson.isPreview && (
          <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">Preview</span>
        )}
      </div>

      {lesson.type === 'TEXT' && lesson.content && (
        <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: lesson.content }} />
      )}

      {lesson.type === 'VIDEO' && lesson.videoUrl && (
        <div className="aspect-video mb-8">
          <iframe
            src={lesson.videoUrl}
            className="w-full h-full rounded-xl"
            allowFullScreen
          />
        </div>
      )}

      {lesson.type === 'PDF' && lesson.pdfUrl && (
        <div className="mb-8">
          <iframe src={lesson.pdfUrl} className="w-full h-[600px] rounded-xl" />
        </div>
      )}

      {lesson.type === 'AUDIO' && lesson.audioUrl && (
        <div className="mb-8">
          <audio controls className="w-full">
            <source src={lesson.audioUrl} />
          </audio>
        </div>
      )}

      {lesson.type === 'LIVESTREAM' && lesson.liveStreamUrl && (
        <div className="aspect-video mb-8">
          <iframe
            src={lesson.liveStreamUrl}
            className="w-full h-full rounded-xl"
            allowFullScreen
          />
        </div>
      )}

      <div className="border-t pt-6 flex items-center justify-between">
        <button
          onClick={markComplete}
          className={`px-6 py-2 rounded-lg font-medium text-sm ${
            completed
              ? 'bg-green-100 text-green-700'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {completed ? '✓ Completed' : 'Mark as Complete'}
        </button>
      </div>
    </div>
  );
}
