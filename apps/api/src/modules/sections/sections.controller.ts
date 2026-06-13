import { Controller, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post('courses/:courseId/sections')
  create(
    @Param('courseId') courseId: string,
    @Body() dto: CreateSectionDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.sectionsService.create(courseId, dto, userId);
  }

  @Patch('sections/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSectionDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.sectionsService.update(id, dto, userId);
  }

  @Delete('sections/:id')
  delete(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.sectionsService.delete(id, userId);
  }
}
