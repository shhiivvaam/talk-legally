import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getPostgresConfig } from '@shared/database/postgres.config';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { VerificationController } from './verification.controller';
import { AnalyticsController } from './analytics.controller';
import { Lawyer } from '@shared/database/entities/lawyer.entity';
import { User } from '@shared/database/entities/user.entity';
import { Session } from '@shared/database/entities/session.entity';
import { Transaction } from '@shared/database/entities/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(getPostgresConfig()),
    TypeOrmModule.forFeature([Lawyer, User, Session, Transaction]),
  ],
  controllers: [AdminController, VerificationController, AnalyticsController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AppModule {}
