import {
  Controller, Get, Post, Param, UseGuards,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller()
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post('courses/:courseId/issue-certificate')
  @UseGuards(JwtAuthGuard)
  issue(@Param('courseId') courseId: string, @CurrentUser('id') userId: string) {
    return this.certificatesService.issue(courseId, userId);
  }

  @Get('courses/:courseId/certificate-eligibility')
  @UseGuards(JwtAuthGuard)
  checkEligibility(@Param('courseId') courseId: string, @CurrentUser('id') userId: string) {
    return this.certificatesService.checkEligibility(courseId, userId);
  }

  @Get('certificates/my')
  @UseGuards(JwtAuthGuard)
  findMy(@CurrentUser('id') userId: string) {
    return this.certificatesService.findMy(userId);
  }

  @Get('certificates/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.certificatesService.findOne(id, userId);
  }
}
