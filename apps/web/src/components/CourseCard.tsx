import Link from 'next/link';

interface CourseCardProps {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  thumbnailUrl: string | null;
  difficulty: string | null;
  isFree: boolean;
  instructor: { name: string };
  _count: { enrollments: number };
}

export function CourseCard(course: CourseCardProps) {
  return (
    <Link href={`/course/${course.slug}`} className="group">
      <div className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white">
        <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
          {course.thumbnailUrl ? (
            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl text-indigo-300">📚</span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {course.isFree && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                Free
              </span>
            )}
            {course.difficulty && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {course.difficulty}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 mb-1">
            {course.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {course.shortDescription}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{course.instructor.name}</span>
            <span>{course._count.enrollments} enrolled</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
