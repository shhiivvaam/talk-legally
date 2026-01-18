import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getPostgresConfig } from '@shared/database/postgres.config';
import { LoggerModule } from '@shared/utils/logger.module';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { TransactionService } from './transaction.service';
import { User } from '@shared/database/entities/user.entity';
import { Transaction } from '@shared/database/entities/transaction.entity';
import { WalletTransaction } from '@shared/database/entities/wallet-transaction.entity';
import { SharedAuthModule } from '@shared/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedAuthModule,
    LoggerModule,
    TypeOrmModule.forRoot(getPostgresConfig()),
    TypeOrmModule.forFeature([User, Transaction, WalletTransaction]),
  ],
  controllers: [WalletController],
  providers: [WalletService, TransactionService],
  exports: [WalletService, TransactionService],
})
export class AppModule { }
