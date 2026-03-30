import { Controller, Get, Put, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { LawyerService } from './lawyer.service';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { RolesGuard } from '@shared/guards/roles.guard';
import { UserRole } from '@shared/types';
import { UpdateProfileDto, UpdatePricingDto, UpdateAvailabilityDto } from './dto/lawyer.dto';

interface AuthenticatedRequest {
  user: { userId: string; email: string; role: string };
}

interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
}

@Controller('lawyers')
@UseGuards(JwtAuthGuard)
export class LawyerController {
  constructor(
    private readonly lawyerService: LawyerService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Get('profile')
  @Roles(UserRole.LAWYER)
  @UseGuards(RolesGuard)
  async getProfile(@Request() req: AuthenticatedRequest) {
    return this.lawyerService.getProfile(req.user.userId);
  }

  @Put('profile')
  @Roles(UserRole.LAWYER)
  @UseGuards(RolesGuard)
  async updateProfile(@Request() req: AuthenticatedRequest, @Body() updateProfileDto: UpdateProfileDto) {
    return this.lawyerService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Post('documents')
  @Roles(UserRole.LAWYER)
  @UseGuards(RolesGuard)
  async uploadDocuments(@Request() req: AuthenticatedRequest, @Body() body: { barCouncilDocUrl: string; govtIdDocUrl: string }) {
    return this.lawyerService.uploadDocuments(req.user.userId, body.barCouncilDocUrl, body.govtIdDocUrl);
  }

  @Put('pricing')
  @Roles(UserRole.LAWYER)
  @UseGuards(RolesGuard)
  async updatePricing(@Request() req: AuthenticatedRequest, @Body() updatePricingDto: UpdatePricingDto) {
    return this.lawyerService.updatePricing(req.user.userId, updatePricingDto);
  }

  @Put('availability')
  @Roles(UserRole.LAWYER)
  @UseGuards(RolesGuard)
  async updateAvailability(@Request() req: AuthenticatedRequest, @Body() updateAvailabilityDto: UpdateAvailabilityDto) {
    return this.lawyerService.updateAvailability(req.user.userId, updateAvailabilityDto.availabilityStatus);
  }

  @Get('earnings')
  @Roles(UserRole.LAWYER)
  @UseGuards(RolesGuard)
  async getEarnings(@Request() req: AuthenticatedRequest, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.lawyerService.getEarnings(req.user.userId, startDate, endDate);
  }

  @Get('analytics')
  @Roles(UserRole.LAWYER)
  @UseGuards(RolesGuard)
  async getAnalytics(@Request() req: AuthenticatedRequest, @Query('period') period: string = 'week') {
    return this.analyticsService.getLawyerAnalytics(req.user.userId, period);
  }

  @Get('sessions')
  @Roles(UserRole.LAWYER)
  @UseGuards(RolesGuard)
  async getSessions(@Request() req: AuthenticatedRequest, @Query('limit') limit: number = 20, @Query('offset') offset: number = 0) {
    return this.lawyerService.getSessions(req.user.userId, limit, offset);
  }

  @Post('withdraw')
  @Roles(UserRole.LAWYER)
  @UseGuards(RolesGuard)
  async requestWithdrawal(@Request() req: AuthenticatedRequest, @Body() body: { amount: number; bankDetails: BankDetails }) {
    return this.lawyerService.requestWithdrawal(req.user.userId, body.amount, body.bankDetails);
  }
}
