import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '@shared/database/entities/transaction.entity';
import { WalletTransaction } from '@shared/database/entities/wallet-transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(WalletTransaction)
    private walletTransactionRepository: Repository<WalletTransaction>,
  ) {}

  async getUserTransactions(userId: string, limit: number = 50, offset: number = 0) {
    const [transactions, total] = await this.transactionRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return {
      transactions,
      total,
      limit,
      offset,
    };
  }

  async getWalletTransactions(userId: string, limit: number = 50, offset: number = 0) {
    const [transactions, total] = await this.walletTransactionRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return {
      transactions,
      total,
      limit,
      offset,
    };
  }
}
