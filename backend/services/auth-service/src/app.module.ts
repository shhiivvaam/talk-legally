import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { getPostgresConfig } from '@shared/database/postgres.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '@shared/database/entities/user.entity';
import { Lawyer } from '@shared/database/entities/lawyer.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { OtpService } from './otp.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { getRedisConfig } from '@shared/database/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(getPostgresConfig()),
    TypeOrmModule.forFeature([User, Lawyer]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      },
    }),
    RedisModule.forRootAsync({
      useFactory: () => getRedisConfig(),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, OtpService, JwtStrategy, GoogleStrategy],
  exports: [AuthService, JwtModule],
})
export class AppModule {}
