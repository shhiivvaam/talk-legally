import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Lawyer } from '@shared/database/entities/lawyer.entity';
import { User } from '@shared/database/entities/user.entity';
import { Session } from '@shared/database/entities/session.entity';
import { Transaction } from '@shared/database/entities/transaction.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Lawyer)
    private lawyerRepository: Repository<Lawyer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async getPendingVerifications() {
    return this.lawyerRepository.find({
      where: { verificationStatus: 'pending' },
      order: { createdAt: 'ASC' },
    });
  }

  async verifyLawyer(lawyerId: string, status: 'approved' | 'rejected', notes?: string) {
    const lawyer = await this.lawyerRepository.findOne({ where: { id: lawyerId } });
    if (!lawyer) {
      throw new NotFoundException('Lawyer not found');
    }

    lawyer.verificationStatus = status;
    lawyer.isActive = status === 'approved';
    await this.lawyerRepository.save(lawyer);

    return { success: true, lawyer };
  }

  async getUsers(limit: number, offset: number) {
    const [users, total] = await this.userRepository.findAndCount({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });

    return { users, total, limit, offset };
  }

  async getLawyers(limit: number, offset: number) {
    const [lawyers, total] = await this.lawyerRepository.findAndCount({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });

    return { lawyers, total, limit, offset };
  }

  async getTransactions(limit: number, offset: number) {
    const [transactions, total] = await this.transactionRepository.findAndCount({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });

    return { transactions, total, limit, offset };
  }

  async updateCommissionRate(rate: number) {
    // In production, this would update platform_settings table
    return { success: true, commissionRate: rate };
  }

  async getPlatformAnalytics(period: string = 'week') {
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

    const [sessions, totalSessions] = await this.sessionRepository.findAndCount({
      where: {
        createdAt: Between(startDate, now),
      },
    });

    const [transactions, totalTransactions] = await this.transactionRepository.findAndCount({
      where: {
        createdAt: Between(startDate, now),
        status: 'completed',
      },
    });

    const totalRevenue = transactions.reduce(
      (sum, t) => sum + parseFloat(t.amount.toString()),
      0,
    );

    const activeUsers = await this.userRepository
      .createQueryBuilder('user')
      .where('user.createdAt >= :startDate', { startDate })
      .getCount();

    const activeLawyers = await this.lawyerRepository
      .createQueryBuilder('lawyer')
      .where('lawyer.isActive = :active', { active: true })
      .andWhere('lawyer.verificationStatus = :status', { status: 'approved' })
      .getCount();

    return {
      period,
      totalSessions,
      totalRevenue,
      totalTransactions,
      activeUsers,
      activeLawyers,
      avgSessionDuration: sessions.length > 0
        ? sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / sessions.length
        : 0,
    };
  }
}
