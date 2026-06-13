import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async enroll(courseId: string, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) throw new ConflictException('Already enrolled');

    return this.prisma.enrollment.create({
      data: { userId, courseId },
      include: {
        course: {
          select: { id: true, title: true, slug: true, thumbnailUrl: true },
        },
      },
    });
  }

  async unenroll(courseId: string, userId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment) throw new NotFoundException('Not enrolled');
    await this.prisma.enrollment.delete({ where: { id: enrollment.id } });
    return { message: 'Unenrolled' };
  }

  async getMyEnrollments(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId, status: 'active' },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnailUrl: true,
            description: true,
            difficulty: true,
            instructor: { select: { id: true, name: true } },
            _count: { select: { sections: true } },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    const result = await Promise.all(
      enrollments.map(async (enr) => {
        const totalLessonsInCourse = await this.prisma.lesson.count({
          where: { section: { courseId: enr.courseId } },
        });
        const completedLessons = await this.prisma.lessonProgress.count({
          where: { userId, completed: true, lesson: { section: { courseId: enr.courseId } } },
        });
        return {
          ...enr,
          progress: totalLessonsInCourse > 0
            ? Math.round((completedLessons / totalLessonsInCourse) * 100)
            : 0,
        };
      }),
    );

    return result;
  }

  async getStatus(courseId: string, userId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment) return { enrolled: false };

    const totalLessons = await this.prisma.lesson.count({
      where: { section: { courseId } },
    });
    const completedLessons = await this.prisma.lessonProgress.count({
      where: { userId, completed: true, lesson: { section: { courseId } } },
    });

    return {
      enrolled: true,
      progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      completedLessons,
      totalLessons,
    };
  }

  async getCourseStudents(courseId: string, instructorId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.instructorId !== instructorId) {
      throw new NotFoundException('Course not found');
    }

    const enrollments = await this.prisma.enrollment.findMany({
      where: { courseId, status: 'active' },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    const totalLessons = await this.prisma.lesson.count({
      where: { section: { courseId } },
    });

    return Promise.all(
      enrollments.map(async (enr) => {
        const completedLessons = await this.prisma.lessonProgress.count({
          where: { userId: enr.userId, completed: true, lesson: { section: { courseId } } },
        });
        return {
          ...enr,
          progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        };
      }),
    );
  }
}
