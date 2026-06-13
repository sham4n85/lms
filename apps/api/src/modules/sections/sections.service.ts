import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto';

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  async create(courseId: string, dto: CreateSectionDto, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.instructorId !== userId) throw new ForbiddenException('Not your course');

    const maxOrder = await this.prisma.section.aggregate({
      where: { courseId },
      _max: { sortOrder: true },
    });

    return this.prisma.section.create({
      data: {
        courseId,
        title: dto.title,
        sortOrder: dto.sortOrder ?? (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
  }

  async update(id: string, dto: UpdateSectionDto, userId: string) {
    const section = await this.prisma.section.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!section) throw new NotFoundException('Section not found');
    if (section.course.instructorId !== userId) throw new ForbiddenException('Not your course');

    return this.prisma.section.update({ where: { id }, data: dto });
  }

  async delete(id: string, userId: string) {
    const section = await this.prisma.section.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!section) throw new NotFoundException('Section not found');
    if (section.course.instructorId !== userId) throw new ForbiddenException('Not your course');

    return this.prisma.section.delete({ where: { id } });
  }
}
