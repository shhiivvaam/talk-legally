import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Session } from '@shared/database/entities/session.entity';
import { LawyerEarning } from '@shared/database/entities/lawyer-earning.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(LawyerEarning)
    private earningRepository: Repository<LawyerEarning>,
  ) { }

  async getLawyerAnalytics(lawyerId: string, period: string = 'week') {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const sessions = await this.sessionRepository.find({
      where: {
        lawyerId,
        createdAt: Between(startDate, now),
      },
    });

    const earnings = await this.earningRepository.find({
      where: {
        lawyerId,
        createdAt: Between(startDate, now),
      },
    });

    const totalSessions = sessions.length;
    const totalEarnings = earnings.reduce((sum, e) => sum + parseFloat(e.netEarnings.toString()), 0);
    const avgSessionDuration = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / sessions.length
      : 0;

    return {
      period,
      totalSessions,
      totalEarnings,
      avgSessionDuration: Math.round(avgSessionDuration),
      sessionsByType: {
        chat: sessions.filter((s) => s.sessionType === 'chat').length,
        voice: sessions.filter((s) => s.sessionType === 'voice').length,
        video: sessions.filter((s) => s.sessionType === 'video').length,
      },
    };
  }
}
