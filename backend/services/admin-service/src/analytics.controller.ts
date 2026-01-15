import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { RolesGuard } from '@shared/guards/roles.guard';
import { UserRole } from '@shared/types';

@Controller('admin/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AnalyticsController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async getAnalytics(@Query('period') period: string = 'week') {
    return this.adminService.getPlatformAnalytics(period);
  }
}
