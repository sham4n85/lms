import {
  Controller, Get, Post, Delete,
  Param, UseGuards,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller()
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @Post('courses/:id/enroll')
  @UseGuards(JwtAuthGuard)
  enroll(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.enrollmentsService.enroll(id, userId);
  }

  @Delete('courses/:id/unenroll')
  @UseGuards(JwtAuthGuard)
  unenroll(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.enrollmentsService.unenroll(id, userId);
  }

  @Get('enrollments/my')
  @UseGuards(JwtAuthGuard)
  getMyEnrollments(@CurrentUser('id') userId: string) {
    return this.enrollmentsService.getMyEnrollments(userId);
  }

  @Get('courses/:id/enrollment-status')
  @UseGuards(JwtAuthGuard)
  getStatus(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.enrollmentsService.getStatus(id, userId);
  }

  @Get('courses/:id/students')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  getStudents(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.enrollmentsService.getCourseStudents(id, userId);
  }
}
