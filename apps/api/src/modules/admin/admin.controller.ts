import {
  Controller, Get, Patch, Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  getUsers(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getUsers(page || 1, limit || 20);
  }

  @Patch('users/:id/role')
  updateUserRole(@Param('id') id: string, @Body('role') role: UserRole) {
    return this.adminService.updateUserRole(id, role);
  }

  @Get('courses')
  getCourses(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getCourses(page || 1, limit || 20);
  }

  @Patch('courses/:id/toggle-published')
  togglePublished(@Param('id') id: string) {
    return this.adminService.toggleCoursePublished(id);
  }
}
