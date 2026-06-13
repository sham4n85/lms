import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalAuthGuard } from '../../common/guards/optional-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller()
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get('lessons/:lessonId/assignment')
  @UseGuards(OptionalAuthGuard)
  findByLesson(@Param('lessonId') lessonId: string, @CurrentUser('id') userId?: string) {
    return this.assignmentsService.findByLesson(lessonId, userId);
  }

  @Post('lessons/:lessonId/assignment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  upsert(
    @Param('lessonId') lessonId: string,
    @Body() dto: { title: string; description: string; dueDays?: number; maxScore?: number },
    @CurrentUser('id') userId: string,
  ) {
    return this.assignmentsService.upsert(lessonId, dto, userId);
  }

  @Delete('assignments/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.assignmentsService.delete(id, userId);
  }

  @Post('assignments/:id/submit')
  @UseGuards(JwtAuthGuard)
  submit(
    @Param('id') id: string,
    @Body() dto: { content?: string; fileUrl?: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.assignmentsService.submit(id, dto, userId);
  }

  @Patch('submissions/:id/grade')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  grade(
    @Param('id') id: string,
    @Body() dto: { score: number; feedback?: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.assignmentsService.grade(id, dto, userId);
  }

  @Get('assignments/:id/my-submission')
  @UseGuards(JwtAuthGuard)
  getMySubmission(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.assignmentsService.getMySubmission(id, userId);
  }
}
