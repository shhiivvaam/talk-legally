import { Injectable } from '@nestjs/common';
import { Session } from '@shared/database/entities/session.entity';
import { Lawyer } from '@shared/database/entities/lawyer.entity';
import { SessionType } from '@shared/types';

@Injectable()
export class BillingService {
  private readonly PLATFORM_COMMISSION_RATE = 0.15; // 15%

  async calculateBilling(session: Session): Promise<{
    durationSeconds: number;
    totalCost: number;
    platformCommission: number;
    lawyerEarnings: number;
  }> {
    const lawyer = session.lawyer as Lawyer;
    
    // Get price per minute based on session type
    let pricePerMin = 0;
    switch (session.sessionType) {
      case SessionType.CHAT:
        pricePerMin = parseFloat(lawyer.chatPricePerMin.toString());
        break;
      case SessionType.VOICE:
        pricePerMin = parseFloat(lawyer.voicePricePerMin.toString());
        break;
      case SessionType.VIDEO:
        pricePerMin = parseFloat(lawyer.videoPricePerMin.toString());
        break;
    }

    // Calculate duration
    let durationSeconds = session.durationSeconds;
    if (session.startedAt && !session.endedAt) {
      const now = new Date();
      durationSeconds = Math.floor((now.getTime() - session.startedAt.getTime()) / 1000);
    } else if (session.startedAt && session.endedAt) {
      durationSeconds = Math.floor(
        (session.endedAt.getTime() - session.startedAt.getTime()) / 1000,
      );
    }

    // Calculate cost (round up to nearest minute)
    const minutes = Math.ceil(durationSeconds / 60);
    const totalCost = minutes * pricePerMin;

    // Calculate commission
    const platformCommission = totalCost * this.PLATFORM_COMMISSION_RATE;
    const lawyerEarnings = totalCost - platformCommission;

    return {
      durationSeconds,
      totalCost: parseFloat(totalCost.toFixed(2)),
      platformCommission: parseFloat(platformCommission.toFixed(2)),
      lawyerEarnings: parseFloat(lawyerEarnings.toFixed(2)),
    };
  }
}
