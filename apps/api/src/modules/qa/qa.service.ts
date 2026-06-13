import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QaService {
  constructor(private prisma: PrismaService) {}

  async getQuestions(courseId: string, lessonId?: string) {
    const where: any = { courseId };
    if (lessonId) where.lessonId = lessonId;

    const questions = await this.prisma.qAQuestion.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        answers: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: [{ upvotes: 'desc' }, { createdAt: 'desc' }],
    });

    return questions.map((q) => ({
      ...q,
      answerCount: q.answers.length,
    }));
  }

  async createQuestion(courseId: string, dto: { title: string; content: string; lessonId?: string }, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    const isEnrolled = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (course.instructorId !== userId && !isEnrolled) {
      throw new ForbiddenException('Enroll to ask questions');
    }

    return this.prisma.qAQuestion.create({
      data: {
        courseId,
        userId,
        title: dto.title,
        content: dto.content,
        lessonId: dto.lessonId,
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }

  async updateQuestion(id: string, dto: { title?: string; content?: string }, userId: string) {
    const question = await this.prisma.qAQuestion.findUnique({ where: { id } });
    if (!question) throw new NotFoundException('Question not found');
    if (question.userId !== userId) throw new ForbiddenException('Not your question');

    return this.prisma.qAQuestion.update({
      where: { id },
      data: dto,
    });
  }

  async deleteQuestion(id: string, userId: string) {
    const question = await this.prisma.qAQuestion.findUnique({ where: { id } });
    if (!question) throw new NotFoundException('Question not found');
    if (question.userId !== userId) throw new ForbiddenException('Not your question');

    await this.prisma.qAQuestion.delete({ where: { id } });
    return { message: 'Question deleted' };
  }

  async upvoteQuestion(id: string, userId: string) {
    const question = await this.prisma.qAQuestion.findUnique({ where: { id } });
    if (!question) throw new NotFoundException('Question not found');

    return this.prisma.qAQuestion.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
    });
  }

  async createAnswer(questionId: string, dto: { content: string }, userId: string) {
    const question = await this.prisma.qAQuestion.findUnique({
      where: { id: questionId },
      include: { course: true },
    });
    if (!question) throw new NotFoundException('Question not found');

    const isEnrolled = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: question.courseId } },
    });
    if (question.course.instructorId !== userId && !isEnrolled) {
      throw new ForbiddenException('Enroll to answer');
    }

    return this.prisma.qAAnswer.create({
      data: { questionId, userId, content: dto.content },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });
  }

  async acceptAnswer(answerId: string, userId: string) {
    const answer = await this.prisma.qAAnswer.findUnique({
      where: { id: answerId },
      include: { question: { include: { course: true } } },
    });
    if (!answer) throw new NotFoundException('Answer not found');

    const isInstructor = answer.question.course.instructorId === userId;
    const isQuestionAuthor = answer.question.userId === userId;
    if (!isInstructor && !isQuestionAuthor) {
      throw new ForbiddenException('Only the instructor or question author can accept');
    }

    await this.prisma.qAAnswer.updateMany({
      where: { questionId: answer.questionId },
      data: { isAccepted: false },
    });

    await this.prisma.qAQuestion.update({
      where: { id: answer.questionId },
      data: { isResolved: true },
    });

    return this.prisma.qAAnswer.update({
      where: { id: answerId },
      data: { isAccepted: true },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async deleteAnswer(id: string, userId: string) {
    const answer = await this.prisma.qAAnswer.findUnique({ where: { id } });
    if (!answer) throw new NotFoundException('Answer not found');
    if (answer.userId !== userId) throw new ForbiddenException('Not your answer');

    await this.prisma.qAAnswer.delete({ where: { id } });
    return { message: 'Answer deleted' };
  }
}
