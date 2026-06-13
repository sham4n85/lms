import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string, userId?: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        section: {
          include: { course: { select: { id: true, title: true, instructorId: true } } },
        },
      },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const isEnrolled = userId
      ? await this.prisma.enrollment.findUnique({
          where: { userId_courseId: { userId, courseId: lesson.section.courseId } },
        })
      : null;

    if (!lesson.isPreview && !isEnrolled && lesson.section.course.instructorId !== userId) {
      throw new ForbiddenException('Enroll to access this lesson');
    }

    return lesson;
  }

  async create(sectionId: string, dto: CreateLessonDto, userId: string) {
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: true },
    });
    if (!section) throw new NotFoundException('Section not found');
    if (section.course.instructorId !== userId) throw new ForbiddenException('Not your course');

    const maxOrder = await this.prisma.lesson.aggregate({
      where: { sectionId },
      _max: { sortOrder: true },
    });

    return this.prisma.lesson.create({
      data: {
        sectionId,
        title: dto.title,
        type: dto.type ?? 'TEXT',
        content: dto.content,
        videoUrl: dto.videoUrl,
        videoDuration: dto.videoDuration,
        pdfUrl: dto.pdfUrl,
        audioUrl: dto.audioUrl,
        liveStreamUrl: dto.liveStreamUrl,
        externalVideoUrl: dto.externalVideoUrl,
        isPreview: dto.isPreview ?? false,
        sortOrder: dto.sortOrder ?? (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
  }

  async update(id: string, dto: UpdateLessonDto, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { section: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    if (lesson.section.course.instructorId !== userId) throw new ForbiddenException('Not your course');

    return this.prisma.lesson.update({ where: { id }, data: dto });
  }

  async delete(id: string, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { section: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    if (lesson.section.course.instructorId !== userId) throw new ForbiddenException('Not your course');

    return this.prisma.lesson.delete({ where: { id } });
  }

  async markComplete(lessonId: string, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    return this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { completed: true, completedAt: new Date() },
      create: { userId, lessonId, completed: true, completedAt: new Date() },
    });
  }

  async getProgress(lessonId: string, userId: string) {
    return this.prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });
  }
}
