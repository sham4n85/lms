import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  private async getLessonWithCourse(lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { section: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async findByLesson(lessonId: string, userId?: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { lessonId },
    });
    if (!assignment) throw new NotFoundException('No assignment for this lesson');

    const lesson = await this.getLessonWithCourse(lessonId);
    const isInstructor = lesson.section.course.instructorId === userId;

    if (!isInstructor) {
      const isEnrolled = userId
        ? await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId: lesson.section.courseId } },
          })
        : null;
      if (!isEnrolled) throw new ForbiddenException('Enroll to access this assignment');
    }

    if (userId) {
      const submission = await this.prisma.assignmentSubmission.findUnique({
        where: { assignmentId_userId: { assignmentId: assignment.id, userId } },
      });

      let allSubmissions: any[] = [];
      if (isInstructor) {
        allSubmissions = await this.prisma.assignmentSubmission.findMany({
          where: { assignmentId: assignment.id },
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { submittedAt: 'desc' },
        });
      }

      return {
        ...assignment,
        mySubmission: submission || null,
        submissions: isInstructor ? allSubmissions : undefined,
      };
    }

    return assignment;
  }

  async upsert(lessonId: string, dto: { title: string; description: string; dueDays?: number; maxScore?: number }, userId: string) {
    const lesson = await this.getLessonWithCourse(lessonId);
    if (lesson.section.course.instructorId !== userId) throw new ForbiddenException('Not your course');

    return this.prisma.assignment.upsert({
      where: { lessonId },
      update: {
        title: dto.title,
        description: dto.description,
        dueDays: dto.dueDays,
        maxScore: dto.maxScore ?? 100,
      },
      create: {
        lessonId,
        title: dto.title,
        description: dto.description,
        dueDays: dto.dueDays,
        maxScore: dto.maxScore ?? 100,
      },
    });
  }

  async delete(id: string, userId: string) {
    const assignment = await this.prisma.assignment.findUnique({ where: { id } });
    if (!assignment) throw new NotFoundException('Assignment not found');
    const lesson = await this.getLessonWithCourse(assignment.lessonId);
    if (lesson.section.course.instructorId !== userId) throw new ForbiddenException('Not your course');

    await this.prisma.assignment.delete({ where: { id } });
    return { message: 'Assignment deleted' };
  }

  async submit(assignmentId: string, dto: { content?: string; fileUrl?: string }, userId: string) {
    const assignment = await this.prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');

    const lesson = await this.getLessonWithCourse(assignment.lessonId);
    const isEnrolled = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: lesson.section.courseId } },
    });
    if (!isEnrolled) throw new ForbiddenException('Enroll to submit');

    const existing = await this.prisma.assignmentSubmission.findUnique({
      where: { assignmentId_userId: { assignmentId, userId } },
    });
    if (existing) throw new BadRequestException('Already submitted. Ask instructor to reset.');

    return this.prisma.assignmentSubmission.create({
      data: {
        assignmentId,
        userId,
        content: dto.content,
        fileUrl: dto.fileUrl,
      },
    });
  }

  async grade(submissionId: string, dto: { score: number; feedback?: string }, userId: string) {
    const submission = await this.prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
      include: { assignment: true },
    });
    if (!submission) throw new NotFoundException('Submission not found');

    const lesson = await this.getLessonWithCourse(submission.assignment.lessonId);
    if (lesson.section.course.instructorId !== userId) throw new ForbiddenException('Not your course');

    if (dto.score < 0 || dto.score > submission.assignment.maxScore) {
      throw new BadRequestException(`Score must be 0-${submission.assignment.maxScore}`);
    }

    return this.prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: { score: dto.score, feedback: dto.feedback, gradedAt: new Date() },
    });
  }

  async getMySubmission(assignmentId: string, userId: string) {
    return this.prisma.assignmentSubmission.findUnique({
      where: { assignmentId_userId: { assignmentId, userId } },
    });
  }
}
