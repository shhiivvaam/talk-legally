import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { User } from '@shared/database/entities/user.entity';
import { Lawyer } from '@shared/database/entities/lawyer.entity';
import { UserRole, JwtPayload } from '@shared/types';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterLawyerDto } from './dto/register-lawyer.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Lawyer)
    private lawyerRepository: Repository<Lawyer>,
    private jwtService: JwtService,
    private otpService: OtpService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, phone, password, name, googleId } = registerUserDto;

    // Check if user exists
    if (email) {
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    if (phone) {
      const existingUser = await this.userRepository.findOne({
        where: { phone },
      });
      if (existingUser) {
        throw new ConflictException('User with this phone already exists');
      }
    }

    // Hash password if provided
    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 12);
    }

    // Create user
    const user = this.userRepository.create({
      email,
      phone,
      passwordHash,
      googleId,
      name,
      isVerified: !!googleId, // Google users are pre-verified
    });

    const savedUser = await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens({
      userId: savedUser.id,
      email: savedUser.email,
      role: UserRole.USER,
    });

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        role: UserRole.USER,
      },
      ...tokens,
    };
  }

  async registerLawyer(registerLawyerDto: RegisterLawyerDto) {
    const { email, phone, password, name } = registerLawyerDto;

    // Check if lawyer exists
    const existingLawyer = await this.lawyerRepository.findOne({
      where: [{ email }, { phone }],
    });
    if (existingLawyer) {
      throw new ConflictException('Lawyer with this email or phone already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create lawyer (verification status: pending)
    const lawyer = this.lawyerRepository.create({
      email,
      phone,
      passwordHash,
      name,
      verificationStatus: 'pending',
      isActive: false,
    });

    const savedLawyer = await this.lawyerRepository.save(lawyer);

    // Send OTP for verification
    await this.otpService.sendOtp(email, phone);

    return {
      lawyer: {
        id: savedLawyer.id,
        email: savedLawyer.email,
        name: savedLawyer.name,
        verificationStatus: savedLawyer.verificationStatus,
      },
      message: 'Lawyer registered. Please verify OTP to complete registration.',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, phone, password } = loginDto;

    if (!email && !phone) {
      throw new BadRequestException('Email or phone is required');
    }

    // Find user
    const user = await this.userRepository.findOne({
      where: email ? { email } : { phone },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    if (user.passwordHash && password) {
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
    } else if (!user.googleId) {
      throw new UnauthorizedException('Password is required');
    }

    // Generate tokens
    const tokens = await this.generateTokens({
      userId: user.id,
      email: user.email,
      role: UserRole.USER,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: UserRole.USER,
      },
      ...tokens,
    };
  }

  async googleAuth(googleAuthDto: GoogleAuthDto) {
    const { googleId, email, name, profileImageUrl } = googleAuthDto;

    // Find or create user
    let user = await this.userRepository.findOne({
      where: [{ googleId }, { email }],
    });

    if (!user) {
      user = this.userRepository.create({
        googleId,
        email,
        name,
        profileImageUrl,
        isVerified: true,
      });
      user = await this.userRepository.save(user);
    } else if (!user.googleId) {
      // Link Google account to existing user
      user.googleId = googleId;
      if (profileImageUrl) user.profileImageUrl = profileImageUrl;
      user = await this.userRepository.save(user);
    }

    // Generate tokens
    const tokens = await this.generateTokens({
      userId: user.id,
      email: user.email,
      role: UserRole.USER,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: UserRole.USER,
      },
      ...tokens,
    };
  }

  async sendOtp(email?: string, phone?: string) {
    if (!email && !phone) {
      throw new BadRequestException('Email or phone is required');
    }
    return this.otpService.sendOtp(email, phone);
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, phone, otp, userId } = verifyOtpDto;

    const isValid = await this.otpService.verifyOtp(email, phone, otp);
    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // If userId provided, verify user
    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user) {
        user.isVerified = true;
        await this.userRepository.save(user);
      }
    }

    return { message: 'OTP verified successfully' };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
      });

      // Check if refresh token exists in Redis
      const storedToken = await this.redis.get(`refresh_token:${payload.userId}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens({
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      });

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    // Remove refresh token from Redis
    await this.redis.del(`refresh_token:${userId}`);
    return { message: 'Logged out successfully' };
  }

  async getProfile(payload: JwtPayload) {
    if (payload.role === UserRole.USER) {
      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
        select: ['id', 'email', 'phone', 'name', 'profileImageUrl', 'walletBalance', 'isVerified'],
      });
      return { ...user, role: UserRole.USER };
    } else if (payload.role === UserRole.LAWYER) {
      const lawyer = await this.lawyerRepository.findOne({
        where: { id: payload.userId },
        select: ['id', 'email', 'phone', 'name', 'profileImageUrl', 'verificationStatus', 'isActive'],
      });
      return { ...lawyer, role: UserRole.LAWYER };
    }
    throw new UnauthorizedException('Invalid role');
  }

  private async generateTokens(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    // Store refresh token in Redis
    await this.redis.set(
      `refresh_token:${payload.userId}`,
      refreshToken,
      'EX',
      7 * 24 * 60 * 60, // 7 days
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(userId: string, role: UserRole) {
    if (role === UserRole.USER) {
      return this.userRepository.findOne({ where: { id: userId } });
    } else if (role === UserRole.LAWYER) {
      return this.lawyerRepository.findOne({ where: { id: userId } });
    }
    return null;
  }
}
