import { Injectable, BadRequestException, Optional } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { AppLoggerService } from '@shared/utils/logger.service';

@Injectable()
export class OtpService {
  private readonly logger: AppLoggerService;

  constructor(
    @InjectRedis() private readonly redis: Redis,
    @Optional() logger?: AppLoggerService,
  ) {
    // Use injected logger if available (from LoggerModule), otherwise create one
    this.logger = logger || AppLoggerService.create('OtpService');
    this.logger.setContext('OtpService');
  }

  async sendOtp(email?: string, phone?: string): Promise<{ message: string; otp?: string }> {
    if (!email && !phone) {
      throw new BadRequestException('Email or phone is required');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = email ? `otp:email:${email}` : `otp:phone:${phone}`;

    // Store OTP in Redis with 10-minute expiry
    await this.redis.set(key, otp, 'EX', 600);

    // In production, send OTP via SMS/Email service
    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(`OTP for ${email || phone}: ${otp}`, 'OtpService');
    } else {
      this.logger.log(`OTP generated for ${email || phone}`, 'OtpService');
    }

    return {
      message: 'OTP sent successfully',
      // Remove otp in production
      otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    };
  }

  async verifyOtp(email?: string, phone?: string, otp?: string): Promise<boolean> {
    if (!otp) {
      return false;
    }

    const key = email ? `otp:email:${email}` : `otp:phone:${phone}`;
    const storedOtp = await this.redis.get(key);

    if (storedOtp && storedOtp === otp) {
      await this.redis.del(key);
      return true;
    }

    return false;
  }
}
