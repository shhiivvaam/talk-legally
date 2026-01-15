import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class OtpService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async sendOtp(email?: string, phone?: string): Promise<{ message: string }> {
    if (!email && !phone) {
      throw new Error('Email or phone is required');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = email ? `otp:email:${email}` : `otp:phone:${phone}`;

    // Store OTP in Redis with 10-minute expiry
    await this.redis.set(key, otp, 'EX', 600);

    // In production, send OTP via SMS/Email service
    // For now, we'll log it (remove in production)
    console.log(`OTP for ${email || phone}: ${otp}`);

    return {
      message: 'OTP sent successfully',
      // Remove otp in production
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    };
  }

  async verifyOtp(email?: string, phone?: string, otp?: string): Promise<boolean> {
    if (!otp) {
      return false;
    }

    const key = email ? `otp:email:${email}` : `otp:phone:${phone}`;
    const storedOtp = await this.redis.get(key);

    if (!storedOtp || storedOtp !== otp) {
      return false;
    }

    // Delete OTP after verification
    await this.redis.del(key);
    return true;
  }
}
