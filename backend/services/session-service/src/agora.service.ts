import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RtcTokenBuilder, RtcRole } from 'agora-token';
import { Session } from '@shared/database/entities/session.entity';

@Injectable()
export class AgoraService {
  private readonly appId: string;
  private readonly appCertificate: string;

  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {
    this.appId = process.env.AGORA_APP_ID || '';
    this.appCertificate = process.env.AGORA_APP_CERTIFICATE || '';
  }

  async generateToken(sessionId: string, userId: string): Promise<{
    token: string;
    channelName: string;
    appId: string;
  }> {
    const session = await this.sessionRepository.findOne({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Generate or reuse channel name
    let channelName = session.agoraChannelName;
    if (!channelName) {
      channelName = `session_${sessionId}`;
      session.agoraChannelName = channelName;
      await this.sessionRepository.save(session);
    }

    // Generate token (valid for 24 hours)
    const expirationTimeInSeconds = Math.floor(Date.now() / 1000) + 24 * 3600;
    const role = RtcRole.PUBLISHER;

    const token = RtcTokenBuilder.buildTokenWithUid(
      this.appId,
      this.appCertificate,
      channelName,
      userId,
      role,
      expirationTimeInSeconds,
    );

    // Save token to session
    session.agoraToken = token;
    await this.sessionRepository.save(session);

    return {
      token,
      channelName,
      appId: this.appId,
    };
  }
}
