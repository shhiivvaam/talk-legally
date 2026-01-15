import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '@shared/database/entities/session.entity';
import { User } from '@shared/database/entities/user.entity';
import { SessionStatus } from '@shared/types';
import { BillingService } from './billing.service';

@Injectable()
export class SessionMonitorService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private billingService: BillingService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async monitorActiveSessions() {
    const activeSessions = await this.sessionRepository.find({
      where: { status: SessionStatus.ACTIVE },
      relations: ['user', 'lawyer'],
    });

    for (const session of activeSessions) {
      await this.checkSessionBalance(session);
    }
  }

  private async checkSessionBalance(session: Session) {
    const user = await this.userRepository.findOne({ where: { id: session.userId } });
    if (!user) return;

    const billing = await this.billingService.calculateBilling(session);
    const currentBalance = parseFloat(user.walletBalance.toString());
    const estimatedCost = billing.totalCost;
    const remainingBalance = currentBalance - estimatedCost;

    // Low balance threshold (30 seconds worth)
    const lawyer = session.lawyer as any;
    let pricePerMin = 0;
    switch (session.sessionType) {
      case 'chat':
        pricePerMin = parseFloat(lawyer.chatPricePerMin?.toString() || '0');
        break;
      case 'voice':
        pricePerMin = parseFloat(lawyer.voicePricePerMin?.toString() || '0');
        break;
      case 'video':
        pricePerMin = parseFloat(lawyer.videoPricePerMin?.toString() || '0');
        break;
    }

    const lowBalanceThreshold = (30 / 60) * pricePerMin; // 30 seconds worth

    if (remainingBalance < lowBalanceThreshold && remainingBalance > 0) {
      // Send 30-second warning (via notification service)
      // This would emit an event or call notification service
      console.log(`Low balance warning for session ${session.id}`);
    }

    if (remainingBalance <= 0) {
      // Auto-terminate session
      session.status = SessionStatus.COMPLETED;
      session.endedAt = new Date();
      await this.sessionRepository.save(session);
      
      // End session billing
      // This would trigger endSession logic
      console.log(`Session ${session.id} terminated due to insufficient balance`);
    }
  }
}
