import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getPostgresConfig } from '@shared/database/postgres.config';
import { LoggerModule } from '@shared/utils/logger.module';
import { LawyerController } from './lawyer.controller';
import { LawyerService } from './lawyer.service';
import { VerificationService } from './verification.service';
import { AnalyticsService } from './analytics.service';
import { Lawyer } from '@shared/database/entities/lawyer.entity';
import { Session } from '@shared/database/entities/session.entity';
import { LawyerEarning } from '@shared/database/entities/lawyer-earning.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    TypeOrmModule.forRoot(getPostgresConfig()),
    TypeOrmModule.forFeature([Lawyer, Session, LawyerEarning]),
  ],
  controllers: [LawyerController],
  providers: [LawyerService, VerificationService, AnalyticsService],
  exports: [LawyerService],
})
export class AppModule {}
