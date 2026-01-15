import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { PushProvider } from './providers/push.provider';
import { EmailProvider } from './providers/email.provider';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [NotificationController],
  providers: [NotificationService, PushProvider, EmailProvider],
  exports: [NotificationService],
})
export class AppModule {}
