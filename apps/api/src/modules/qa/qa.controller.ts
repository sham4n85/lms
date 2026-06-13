import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { QaService } from './qa.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalAuthGuard } from '../../common/guards/optional-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller()
export class QaController {
  constructor(private readonly qaService: QaService) {}

  @Get('courses/:courseId/questions')
  getQuestions(
    @Param('courseId') courseId: string,
    @Query('lessonId') lessonId?: string,
  ) {
    return this.qaService.getQuestions(courseId, lessonId);
  }

  @Post('courses/:courseId/questions')
  @UseGuards(JwtAuthGuard)
  createQuestion(
    @Param('courseId') courseId: string,
    @Body() dto: { title: string; content: string; lessonId?: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.qaService.createQuestion(courseId, dto, userId);
  }

  @Patch('questions/:id')
  @UseGuards(JwtAuthGuard)
  updateQuestion(
    @Param('id') id: string,
    @Body() dto: { title?: string; content?: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.qaService.updateQuestion(id, dto, userId);
  }

  @Delete('questions/:id')
  @UseGuards(JwtAuthGuard)
  deleteQuestion(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.qaService.deleteQuestion(id, userId);
  }

  @Post('questions/:id/upvote')
  @UseGuards(JwtAuthGuard)
  upvoteQuestion(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.qaService.upvoteQuestion(id, userId);
  }

  @Post('questions/:id/answers')
  @UseGuards(JwtAuthGuard)
  createAnswer(
    @Param('id') id: string,
    @Body() dto: { content: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.qaService.createAnswer(id, dto, userId);
  }

  @Patch('answers/:id/accept')
  @UseGuards(JwtAuthGuard)
  acceptAnswer(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.qaService.acceptAnswer(id, userId);
  }

  @Delete('answers/:id')
  @UseGuards(JwtAuthGuard)
  deleteAnswer(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.qaService.deleteAnswer(id, userId);
  }
}
