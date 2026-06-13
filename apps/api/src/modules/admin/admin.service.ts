import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [users, instructors, students, courses, publishedCourses, enrollments, revenue, certificates] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { role: 'INSTRUCTOR' } }),
        this.prisma.user.count({ where: { role: 'STUDENT' } }),
        this.prisma.course.count(),
        this.prisma.course.count({ where: { isPublished: true } }),
        this.prisma.enrollment.count({ where: { status: 'active' } }),
        this.prisma.order.aggregate({ _sum: { amount: true } }),
        this.prisma.certificate.count(),
      ]);

    return {
      totalUsers: users,
      totalInstructors: instructors,
      totalStudents: students,
      totalCourses: courses,
      publishedCourses,
      activeEnrollments: enrollments,
      totalRevenue: revenue._sum.amount || 0,
      totalCertificates: certificates,
    };
  }

  async getUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          id: true, name: true, email: true, role: true,
          emailVerified: true, createdAt: true,
          _count: { select: { enrollments: true, instructorCourses: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);

    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateUserRole(id: string, role: UserRole) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (!['STUDENT', 'INSTRUCTOR', 'ADMIN'].includes(role)) {
      throw new NotFoundException('Invalid role');
    }

    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async getCourses(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        select: {
          id: true, title: true, slug: true, isPublished: true,
          isFree: true, difficulty: true, createdAt: true,
          instructor: { select: { id: true, name: true } },
          _count: { select: { enrollments: true, sections: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.course.count(),
    ]);

    return { courses, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async toggleCoursePublished(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');

    return this.prisma.course.update({
      where: { id },
      data: { isPublished: !course.isPublished },
      select: { id: true, title: true, isPublished: true },
    });
  }
}
