import { Controller, Get, Put, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { UpdateProfileDto, SearchLawyersDto } from './dto/user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.getProfile(req.user.userId);
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Post('documents')
  async uploadDocument(@Request() req, @Body() body: { documentUrl: string; documentName: string }) {
    return this.userService.uploadDocument(req.user.userId, body.documentUrl, body.documentName);
  }

  @Get('lawyers/search')
  async searchLawyers(@Query() searchDto: SearchLawyersDto, @Request() req) {
    return this.userService.searchLawyers(req.user.userId, searchDto);
  }

  @Get('lawyers/map')
  async getLawyersMap(@Query('lat') lat: number, @Query('lng') lng: number, @Request() req) {
    return this.userService.getLawyersMap(req.user.userId, lat, lng);
  }

  @Post('favorites/:lawyerId')
  async addFavorite(@Request() req, @Param('lawyerId') lawyerId: string) {
    return this.userService.addFavorite(req.user.userId, lawyerId);
  }

  @Delete('favorites/:lawyerId')
  async removeFavorite(@Request() req, @Param('lawyerId') lawyerId: string) {
    return this.userService.removeFavorite(req.user.userId, lawyerId);
  }

  @Get('sessions')
  async getSessions(@Request() req, @Query('limit') limit: number = 20, @Query('offset') offset: number = 0) {
    return this.userService.getSessions(req.user.userId, limit, offset);
  }
}
