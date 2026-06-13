import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async issue(courseId: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { instructor: { select: { id: true, name: true } } },
    });
    if (!course) throw new NotFoundException('Course not found');

    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment) throw new ForbiddenException('Not enrolled');

    const totalLessons = await this.prisma.lesson.count({
      where: { section: { courseId } },
    });
    if (totalLessons === 0) throw new NotFoundException('Course has no lessons');

    const completedLessons = await this.prisma.lessonProgress.count({
      where: { userId, completed: true, lesson: { section: { courseId } } },
    });
    if (completedLessons < totalLessons) {
      throw new NotFoundException('Complete all lessons first');
    }

    const existing = await this.prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) throw new ConflictException('Certificate already issued');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const certificateData = {
      userName: user?.name,
      courseTitle: course.title,
      instructorName: course.instructor.name,
      issuedAt: new Date().toISOString(),
      completionDate: new Date().toISOString(),
      totalLessons,
    };

    return this.prisma.certificate.create({
      data: {
        userId,
        courseId,
        data: certificateData,
      },
      include: {
        course: { select: { id: true, title: true, slug: true } },
      },
    });
  }

  async findMy(userId: string) {
    return this.prisma.certificate.findMany({
      where: { userId },
      include: {
        course: { select: { id: true, title: true, slug: true, thumbnailUrl: true } },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const cert = await this.prisma.certificate.findUnique({
      where: { id },
      include: {
        course: {
          select: { id: true, title: true, slug: true, instructor: { select: { name: true } } },
        },
        user: { select: { name: true } },
      },
    });
    if (!cert) throw new NotFoundException('Certificate not found');
    if (cert.userId !== userId) throw new ForbiddenException('Not your certificate');
    return cert;
  }

  async checkEligibility(courseId: string, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment) return { eligible: false, reason: 'Not enrolled' };

    const totalLessons = await this.prisma.lesson.count({
      where: { section: { courseId } },
    });
    if (totalLessons === 0) return { eligible: false, reason: 'No lessons' };

    const completedLessons = await this.prisma.lessonProgress.count({
      where: { userId, completed: true, lesson: { section: { courseId } } },
    });

    const existing = await this.prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    return {
      eligible: completedLessons >= totalLessons && !existing,
      totalLessons,
      completedLessons,
      alreadyIssued: !!existing,
    };
  }
}
