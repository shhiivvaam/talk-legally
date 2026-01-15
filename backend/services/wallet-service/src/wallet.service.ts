import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '@shared/database/entities/user.entity';
import { Transaction } from '@shared/database/entities/transaction.entity';
import { WalletTransaction } from '@shared/database/entities/wallet-transaction.entity';
import { TransactionType } from '@shared/types';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(WalletTransaction)
    private walletTransactionRepository: Repository<WalletTransaction>,
    private dataSource: DataSource,
  ) {}

  async getBalance(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'walletBalance'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      userId: user.id,
      balance: parseFloat(user.walletBalance.toString()),
    };
  }

  async addBalance(userId: string, amount: number, referenceId?: string) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const balanceBefore = parseFloat(user.walletBalance.toString());
      const balanceAfter = balanceBefore + amount;

      // Update user balance
      user.walletBalance = balanceAfter;
      await queryRunner.manager.save(user);

      // Create transaction record
      const transaction = queryRunner.manager.create(Transaction, {
        userId,
        transactionType: TransactionType.DEPOSIT,
        amount,
        balanceBefore,
        balanceAfter,
        status: 'completed',
        description: `Wallet top-up of ₹${amount}`,
        referenceId,
      });
      await queryRunner.manager.save(transaction);

      // Create wallet transaction
      const walletTransaction = queryRunner.manager.create(WalletTransaction, {
        userId,
        amount,
        type: 'credit',
        referenceId: referenceId || transaction.id,
        description: `Wallet top-up`,
      });
      await queryRunner.manager.save(walletTransaction);

      await queryRunner.commitTransaction();

      return {
        success: true,
        balanceBefore,
        balanceAfter,
        transactionId: transaction.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deductBalance(userId: string, amount: number, description?: string, sessionId?: string) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const balanceBefore = parseFloat(user.walletBalance.toString());

      if (balanceBefore < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      const balanceAfter = balanceBefore - amount;

      // Update user balance
      user.walletBalance = balanceAfter;
      await queryRunner.manager.save(user);

      // Create transaction record
      const transaction = queryRunner.manager.create(Transaction, {
        userId,
        transactionType: TransactionType.SESSION_PAYMENT,
        amount,
        balanceBefore,
        balanceAfter,
        status: 'completed',
        sessionId,
        description: description || `Payment of ₹${amount}`,
      });
      await queryRunner.manager.save(transaction);

      // Create wallet transaction
      const walletTransaction = queryRunner.manager.create(WalletTransaction, {
        userId,
        amount,
        type: 'debit',
        referenceId: transaction.id,
        description: description || `Payment`,
      });
      await queryRunner.manager.save(walletTransaction);

      await queryRunner.commitTransaction();

      return {
        success: true,
        balanceBefore,
        balanceAfter,
        transactionId: transaction.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async checkBalance(userId: string, requiredAmount: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['walletBalance'],
    });

    if (!user) {
      return false;
    }

    return parseFloat(user.walletBalance.toString()) >= requiredAmount;
  }
}
