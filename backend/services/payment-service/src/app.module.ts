import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@shared/utils/logger.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { RazorpayProvider } from './providers/razorpay.provider';
import { PaytmProvider } from './providers/paytm.provider';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, RazorpayProvider, PaytmProvider],
  exports: [PaymentService],
})
export class AppModule {}
