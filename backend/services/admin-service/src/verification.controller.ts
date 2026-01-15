import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { RolesGuard } from '@shared/guards/roles.guard';
import { UserRole } from '@shared/types';

@Controller('admin/verification')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class VerificationController {
  constructor(private readonly adminService: AdminService) {}

  @Get('lawyers/pending')
  async getPendingVerifications() {
    return this.adminService.getPendingVerifications();
  }

  @Post('lawyers/:id/verify')
  async verifyLawyer(@Param('id') id: string, @Body() body: { status: 'approved' | 'rejected'; notes?: string }) {
    return this.adminService.verifyLawyer(id, body.status, body.notes);
  }
}
