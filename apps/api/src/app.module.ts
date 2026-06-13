import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { SectionsModule } from './modules/sections/sections.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { QaModule } from './modules/qa/qa.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, CoursesModule, SectionsModule, LessonsModule, EnrollmentsModule, QuizzesModule, AssignmentsModule, CertificatesModule, QaModule, AdminModule],
})
export class AppModule {}
