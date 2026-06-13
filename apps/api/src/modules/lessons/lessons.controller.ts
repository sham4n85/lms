import {
  Controller, Get, Post, Patch, Delete, Param, Body, UseGuards,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller()
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get('lessons/:id')
  async findOne(@Param('id') id: string, @CurrentUser('id') userId?: string) {
    return this.lessonsService.findOne(id, userId);
  }

  @Post('sections/:sectionId/lessons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  create(
    @Param('sectionId') sectionId: string,
    @Body() dto: CreateLessonDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.lessonsService.create(sectionId, dto, userId);
  }

  @Patch('lessons/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLessonDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.lessonsService.update(id, dto, userId);
  }

  @Delete('lessons/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  delete(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.lessonsService.delete(id, userId);
  }

  @Post('lessons/:id/complete')
  @UseGuards(JwtAuthGuard)
  markComplete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.lessonsService.markComplete(id, userId);
  }

  @Get('lessons/:id/progress')
  @UseGuards(JwtAuthGuard)
  getProgress(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.lessonsService.getProgress(id, userId);
  }
}
