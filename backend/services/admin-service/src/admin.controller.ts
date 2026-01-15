import { Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { RolesGuard } from '@shared/guards/roles.guard';
import { UserRole } from '@shared/types';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getUsers(@Query('limit') limit: number = 20, @Query('offset') offset: number = 0) {
    return this.adminService.getUsers(limit, offset);
  }

  @Get('lawyers')
  async getLawyers(@Query('limit') limit: number = 20, @Query('offset') offset: number = 0) {
    return this.adminService.getLawyers(limit, offset);
  }

  @Get('transactions')
  async getTransactions(@Query('limit') limit: number = 50, @Query('offset') offset: number = 0) {
    return this.adminService.getTransactions(limit, offset);
  }

  @Put('commission')
  async updateCommission(@Query('rate') rate: number) {
    return this.adminService.updateCommissionRate(rate);
  }
}
