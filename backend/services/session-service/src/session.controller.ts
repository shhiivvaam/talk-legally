import { Controller, Post, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SessionService } from './session.service';
import { AgoraService } from './agora.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { CreateSessionDto, HeartbeatDto } from './dto/session.dto';

interface AuthenticatedRequest {
  user: { userId: string; email: string; role: string };
}

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly agoraService: AgoraService,
  ) {}

  @Post('create')
  async createSession(@Request() req: AuthenticatedRequest, @Body() createSessionDto: CreateSessionDto) {
    return this.sessionService.createSession(
      req.user.userId,
      createSessionDto.lawyerId,
      createSessionDto.sessionType,
    );
  }

  @Get(':id')
  async getSession(@Param('id') id: string) {
    return this.sessionService.getSession(id);
  }

  @Put(':id/start')
  async startSession(@Param('id') id: string) {
    return this.sessionService.startSession(id);
  }

  @Put(':id/end')
  async endSession(@Param('id') id: string) {
    return this.sessionService.endSession(id);
  }

  @Get(':id/agora-token')
  async getAgoraToken(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.agoraService.generateToken(id, req.user.userId);
  }

  @Post(':id/heartbeat')
  async heartbeat(@Param('id') id: string, @Body() heartbeatDto: HeartbeatDto) {
    return this.sessionService.updateSessionDuration(id, heartbeatDto.durationSeconds);
  }
}
