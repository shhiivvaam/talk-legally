import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Session } from '@shared/database/entities/session.entity';
import { User } from '@shared/database/entities/user.entity';
import { Lawyer } from '@shared/database/entities/lawyer.entity';
import { SessionType, SessionStatus } from '@shared/types';
import { BillingService } from './billing.service';
import { WalletService } from '@shared/services/wallet.service';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Lawyer)
    private lawyerRepository: Repository<Lawyer>,
    private billingService: BillingService,
    private dataSource: DataSource,
  ) {}

  async createSession(userId: string, lawyerId: string, sessionType: SessionType) {
    const lawyer = await this.lawyerRepository.findOne({ where: { id: lawyerId } });
    if (!lawyer || lawyer.verificationStatus !== 'approved' || !lawyer.isActive) {
      throw new BadRequestException('Lawyer not available');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get price per minute
    let pricePerMin = 0;
    switch (sessionType) {
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

    if (pricePerMin <= 0) {
      throw new BadRequestException('Lawyer has not set pricing for this session type');
    }

    // Check minimum balance (at least 1 minute)
    const minBalance = pricePerMin;
    if (parseFloat(user.walletBalance.toString()) < minBalance) {
      throw new BadRequestException('Insufficient balance. Please add funds to your wallet.');
    }

    const session = this.sessionRepository.create({
      userId,
      lawyerId,
      sessionType,
      status: SessionStatus.INITIATED,
    });

    const savedSession = await this.sessionRepository.save(session);

    return {
      sessionId: savedSession.id,
      sessionType,
      pricePerMin,
      lawyer: {
        id: lawyer.id,
        name: lawyer.name,
      },
    };
  }

  async startSession(sessionId: string) {
    const session = await this.sessionRepository.findOne({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.status !== SessionStatus.INITIATED) {
      throw new BadRequestException('Session cannot be started');
    }

    session.status = SessionStatus.ACTIVE;
    session.startedAt = new Date();
    await this.sessionRepository.save(session);

    return { success: true, session };
  }

  async endSession(sessionId: string) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['user', 'lawyer'],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.status === SessionStatus.COMPLETED) {
      return session;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Calculate final billing
      const billing = await this.billingService.calculateBilling(session);

      // Deduct from user wallet
      // Note: In production, this should call wallet service via HTTP or message queue
      const user = await queryRunner.manager.findOne(User, {
        where: { id: session.userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (user) {
        const balanceBefore = parseFloat(user.walletBalance.toString());
        user.walletBalance = balanceBefore - billing.totalCost;
        await queryRunner.manager.save(user);
      }

      // Update session
      session.status = SessionStatus.COMPLETED;
      session.endedAt = new Date();
      session.durationSeconds = billing.durationSeconds;
      session.totalCost = billing.totalCost;
      session.platformCommission = billing.platformCommission;
      session.lawyerEarnings = billing.lawyerEarnings;
      await queryRunner.manager.save(session);

      // Update lawyer earnings
      const lawyer = await queryRunner.manager.findOne(Lawyer, {
        where: { id: session.lawyerId },
      });
      if (lawyer) {
        lawyer.totalEarnings = parseFloat(lawyer.totalEarnings.toString()) + billing.lawyerEarnings;
        await queryRunner.manager.save(lawyer);
      }

      await queryRunner.commitTransaction();
      return session;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getSession(sessionId: string) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['user', 'lawyer'],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async updateSessionDuration(sessionId: string, durationSeconds: number) {
    const session = await this.sessionRepository.findOne({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    session.durationSeconds = durationSeconds;
    await this.sessionRepository.save(session);

    // Check balance and send warning if low
    const user = await this.userRepository.findOne({ where: { id: session.userId } });
    if (user) {
      const lawyer = await this.lawyerRepository.findOne({ where: { id: session.lawyerId } });
      if (lawyer) {
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

        const usedAmount = (durationSeconds / 60) * pricePerMin;
        const remainingBalance = parseFloat(user.walletBalance.toString()) - usedAmount;
        const lowBalanceThreshold = 50; // From platform settings

        if (remainingBalance < lowBalanceThreshold && remainingBalance > 0) {
          // Send low balance warning (via notification service)
          // This would trigger a notification
        }
      }
    }

    return { success: true, durationSeconds };
  }
}
