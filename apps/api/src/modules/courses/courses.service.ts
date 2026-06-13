import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto, CourseQueryDto } from './dto/course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: CourseQueryDto) {
    const where: any = { isPublished: true };
    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }
    if (query.difficulty) where.difficulty = query.difficulty;
    if (query.isFree !== undefined) where.isFree = query.isFree;
    if (query.instructorId) where.instructorId = query.instructorId;

    return this.prisma.course.findMany({
      where,
      include: {
        instructor: { select: { id: true, name: true, avatarUrl: true } },
        _count: { select: { enrollments: true, sections: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMyCourses(instructorId: string) {
    return this.prisma.course.findMany({
      where: { instructorId },
      include: {
        _count: { select: { enrollments: true, sections: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        instructor: { select: { id: true, name: true, avatarUrl: true, bio: true } },
        sections: {
          include: { lessons: { orderBy: { sortOrder: 'asc' } } },
          orderBy: { sortOrder: 'asc' },
        },
        faqs: { orderBy: { sortOrder: 'asc' } },
        reviews: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { enrollments: true } },
      },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async create(dto: CreateCourseDto, instructorId: string) {
    const existing = await this.prisma.course.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('A course with this slug already exists');

    return this.prisma.course.create({
      data: {
        ...dto,
        price: dto.price || 0,
        instructorId,
      },
      include: {
        instructor: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, dto: UpdateCourseDto, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId !== userId) throw new NotFoundException('Course not found');

    if (dto.slug && dto.slug !== course.slug) {
      const existing = await this.prisma.course.findUnique({ where: { slug: dto.slug } });
      if (existing) throw new ConflictException('Slug already taken');
    }

    return this.prisma.course.update({
      where: { id },
      data: dto,
      include: {
        instructor: { select: { id: true, name: true } },
      },
    });
  }

  async delete(id: string, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId !== userId) throw new NotFoundException('Course not found');

    await this.prisma.course.delete({ where: { id } });
    return { message: 'Course deleted' };
  }
}
