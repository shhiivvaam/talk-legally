import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getPostgresConfig } from '@shared/database/postgres.config';
import { LoggerModule } from '@shared/utils/logger.module';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { BillingService } from './billing.service';
import { AgoraService } from './agora.service';
import { SessionMonitorService } from './session-monitor.service';
import { Session } from '@shared/database/entities/session.entity';
import { User } from '@shared/database/entities/user.entity';
import { Lawyer } from '@shared/database/entities/lawyer.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(getPostgresConfig()),
    TypeOrmModule.forFeature([Session, User, Lawyer]),
  ],
  controllers: [SessionController],
  providers: [SessionService, BillingService, AgoraService, SessionMonitorService],
  exports: [SessionService],
})
export class AppModule {}
