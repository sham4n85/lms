import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, Query,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalAuthGuard } from '../../common/guards/optional-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole, QuestionType } from '@prisma/client';

@Controller()
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get('lessons/:lessonId/quiz')
  @UseGuards(OptionalAuthGuard)
  findByLesson(@Param('lessonId') lessonId: string, @CurrentUser('id') userId?: string) {
    return this.quizzesService.findByLesson(lessonId, userId);
  }

  @Post('lessons/:lessonId/quiz')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  upsert(
    @Param('lessonId') lessonId: string,
    @Body() dto: { title: string; description?: string; passingScore?: number; maxAttempts?: number; showResult?: boolean; randomize?: boolean },
    @CurrentUser('id') userId: string,
  ) {
    return this.quizzesService.upsert(lessonId, dto, userId);
  }

  @Patch('quizzes/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: any, @CurrentUser('id') userId: string) {
    return this.quizzesService.update(id, dto, userId);
  }

  @Delete('quizzes/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.quizzesService.delete(id, userId);
  }

  @Post('quizzes/:id/questions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  addQuestion(
    @Param('id') id: string,
    @Body() dto: { type: QuestionType; title: string; options?: any; points?: number },
    @CurrentUser('id') userId: string,
  ) {
    return this.quizzesService.addQuestion(id, dto, userId);
  }

  @Patch('questions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  updateQuestion(@Param('id') id: string, @Body() dto: any, @CurrentUser('id') userId: string) {
    return this.quizzesService.updateQuestion(id, dto, userId);
  }

  @Delete('questions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  deleteQuestion(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.quizzesService.deleteQuestion(id, userId);
  }

  @Post('quizzes/:id/attempt')
  @UseGuards(JwtAuthGuard)
  submitAttempt(
    @Param('id') id: string,
    @Body() dto: { answers: Record<string, any> },
    @CurrentUser('id') userId: string,
  ) {
    return this.quizzesService.submitAttempt(id, dto, userId);
  }

  @Get('quizzes/:id/attempts')
  @UseGuards(JwtAuthGuard)
  getAttempts(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.quizzesService.getAttempts(id, userId);
  }
}
