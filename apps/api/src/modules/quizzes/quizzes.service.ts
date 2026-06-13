import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QuestionType } from '@prisma/client';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async findByLesson(lessonId: string, userId?: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { lessonId },
      include: {
        questions: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!quiz) throw new NotFoundException('No quiz for this lesson');

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { section: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const isInstructor = lesson.section.course.instructorId === userId;
    const isEnrolled = userId
      ? await this.prisma.enrollment.findUnique({
          where: { userId_courseId: { userId, courseId: lesson.section.courseId } },
        })
      : null;

    if (!isInstructor && !isEnrolled) {
      throw new ForbiddenException('Enroll to access quiz');
    }

    if (!isInstructor) {
      const questions = quiz.randomize
        ? quiz.questions.sort(() => Math.random() - 0.5)
        : quiz.questions;

      return {
        ...quiz,
        questions: questions.map((q) => {
          if (q.type === 'SHORT_ANSWER') return { ...q, options: null };
          return {
            ...q,
            options: q.options
              ? (q.options as any[]).map((opt: any) => ({ ...opt, correct: undefined }))
              : null,
          };
        }),
      };
    }

    return quiz;
  }

  async upsert(lessonId: string, dto: { title: string; description?: string; passingScore?: number; maxAttempts?: number; showResult?: boolean; randomize?: boolean }, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { section: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    if (lesson.section.course.instructorId !== userId) throw new ForbiddenException('Not your course');

    return this.prisma.quiz.upsert({
      where: { lessonId },
      update: {
        title: dto.title,
        description: dto.description,
        passingScore: dto.passingScore ?? 80,
        maxAttempts: dto.maxAttempts ?? 3,
        showResult: dto.showResult ?? true,
        randomize: dto.randomize ?? false,
      },
      create: {
        lessonId,
        title: dto.title,
        description: dto.description,
        passingScore: dto.passingScore ?? 80,
        maxAttempts: dto.maxAttempts ?? 3,
        showResult: dto.showResult ?? true,
        randomize: dto.randomize ?? false,
      },
    });
  }

  async update(id: string, dto: any, userId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: { questions: true },
    });
    if (!quiz) throw new NotFoundException('Quiz not found');
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: quiz.lessonId },
      include: { section: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    if (lesson.section.course.instructorId !== userId) throw new ForbiddenException('Not your course');

    return this.prisma.quiz.update({ where: { id }, data: dto });
  }

  async delete(id: string, userId: string) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) throw new NotFoundException('Quiz not found');
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: quiz.lessonId },
      include: { section: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    if (lesson.section.course.instructorId !== userId) throw new ForbiddenException('Not your course');

    await this.prisma.quiz.delete({ where: { id } });
    return { message: 'Quiz deleted' };
  }

  async addQuestion(quizId: string, dto: { type: QuestionType; title: string; options?: any; points?: number }, userId: string) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) throw new NotFoundException('Quiz not found');
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: quiz.lessonId },
      include: { section: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    if (lesson.section.course.instructorId !== userId) throw new ForbiddenException('Not your course');

    const maxOrder = await this.prisma.question.aggregate({
      where: { quizId },
      _max: { sortOrder: true },
    });

    return this.prisma.question.create({
      data: {
        quizId,
        type: dto.type,
        title: dto.title,
        options: dto.options ?? [],
        points: dto.points ?? 1,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
  }

  async updateQuestion(id: string, dto: any, userId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: { quiz: { include: { questions: true } } },
    });
    if (!question) throw new NotFoundException('Question not found');
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: question.quiz.lessonId },
      include: { section: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    if (lesson.section.course.instructorId !== userId) throw new ForbiddenException('Not your course');

    return this.prisma.question.update({ where: { id }, data: dto });
  }

  async deleteQuestion(id: string, userId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: { quiz: true },
    });
    if (!question) throw new NotFoundException('Question not found');
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: question.quiz.lessonId },
      include: { section: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    if (lesson.section.course.instructorId !== userId) throw new ForbiddenException('Not your course');

    await this.prisma.question.delete({ where: { id } });
    return { message: 'Question deleted' };
  }

  async submitAttempt(quizId: string, dto: { answers: Record<string, any> }, userId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!quiz) throw new NotFoundException('Quiz not found');

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: quiz.lessonId },
      include: { section: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const isEnrolled = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: lesson.section.courseId } },
    });
    if (!isEnrolled) throw new ForbiddenException('Enroll to take quiz');

    const attemptCount = await this.prisma.quizAttempt.count({
      where: { quizId, userId },
    });
    if (attemptCount >= quiz.maxAttempts) {
      throw new BadRequestException('Max attempts reached');
    }

    let score = 0;
    let maxScore = 0;
    const scoredAnswers: any[] = [];

    for (const question of quiz.questions) {
      maxScore += question.points;
      const userAnswer = dto.answers[question.id];
      let correct = false;

      if (userAnswer === undefined || userAnswer === null) {
        scoredAnswers.push({ questionId: question.id, correct: false, points: 0 });
        continue;
      }

      switch (question.type) {
        case 'MULTIPLE_CHOICE': {
          const options = question.options as any[];
          const selectedIds = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
          const correctIds = options.filter((o) => o.correct).map((o) => o.id);
          correct =
            selectedIds.length === correctIds.length &&
            selectedIds.every((id: string) => correctIds.includes(id));
          break;
        }
        case 'SINGLE_CHOICE': {
          const options = question.options as any[];
          const correctOpt = options.find((o) => o.correct);
          correct = correctOpt ? userAnswer === correctOpt.id : false;
          break;
        }
        case 'TRUE_FALSE': {
          const options = question.options as any[];
          const correctOpt = options.find((o) => o.correct);
          correct = correctOpt ? userAnswer === correctOpt.id
            : userAnswer === true || userAnswer === 'true';
          break;
        }
        case 'SHORT_ANSWER': {
          correct = false;
          break;
        }
        case 'FILL_BLANK': {
          const options = question.options as any[];
          const expected = options?.[0]?.text?.toLowerCase().trim() || '';
          correct = String(userAnswer).toLowerCase().trim() === expected;
          break;
        }
        case 'MATCHING': {
          const pairs = question.options as any[];
          correct = pairs.every((p: any) => userAnswer[p.id] === p.right);
          break;
        }
        case 'ORDERING': {
          correct = Array.isArray(userAnswer) &&
            userAnswer.every((id: string, i: number) => {
              const opt = (question.options as any[]).find((o) => o.id === id);
              return opt && opt.correctPosition === i;
            });
          break;
        }
        default:
          correct = false;
      }

      if (correct) score += question.points;
      scoredAnswers.push({ questionId: question.id, correct, points: correct ? question.points : 0 });
    }

    const attempt = await this.prisma.quizAttempt.create({
      data: {
        quizId,
        userId,
        score,
        answers: scoredAnswers,
        completedAt: new Date(),
      },
    });

    const passed = maxScore > 0 ? (score / maxScore) * 100 >= quiz.passingScore : false;

    return {
      id: attempt.id,
      score,
      maxScore,
      percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
      passingScore: quiz.passingScore,
      passed,
      totalQuestions: quiz.questions.length,
      correctAnswers: scoredAnswers.filter((a) => a.correct).length,
      answers: quiz.showResult ? scoredAnswers : undefined,
    };
  }

  async getAttempts(quizId: string, userId: string) {
    return this.prisma.quizAttempt.findMany({
      where: { quizId, userId },
      orderBy: { startedAt: 'desc' },
    });
  }
}
