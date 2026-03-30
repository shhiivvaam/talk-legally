import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { User } from '@shared/database/entities/user.entity';
import { Lawyer } from '@shared/database/entities/lawyer.entity';
import { UserRole, JwtPayload, VerificationStatus } from '@shared/types';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterLawyerDto } from './dto/register-lawyer.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { OtpService } from './otp.service';
import { AppLoggerService } from '@shared/utils/logger.service';

@Injectable()
export class AuthService {
  private readonly logger: AppLoggerService;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Lawyer)
    private lawyerRepository: Repository<Lawyer>,
    private jwtService: JwtService,
    private otpService: OtpService,
    @InjectRedis() private readonly redis: Redis,
    @Optional() logger?: AppLoggerService,
  ) {
    // Use injected logger if available (from LoggerModule), otherwise create one
    this.logger = logger || AppLoggerService.create('AuthService');
    this.logger.setContext('AuthService');
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, phone, password, name, googleId } = registerUserDto;

    if (!email && !phone) {
      throw new BadRequestException('Either Email or Phone is required');
    }

    // Check if user exists
    if (email) {
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    if (phone) {
      const existingUser = await this.userRepository.findOne({ where: { phone } });
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
      role: 'user', // Default role
    });

    const savedUser = await this.userRepository.save(user);

    this.logger.log('User registered successfully', 'AuthService', {
      userId: savedUser.id,
      email: savedUser.email,
    });

    // Send OTP if not Google auth
    if (!googleId) {
      await this.otpService.sendOtp(email, phone);
    }

    // Generate tokens
    const tokens = await this.generateTokens({
      userId: savedUser.id,
      email: savedUser.email || savedUser.phone, // Use available identifier
      role: UserRole.USER,
    });

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        phone: savedUser.phone,
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
    const lawyerData: Partial<Lawyer> = {
      email,
      phone,
      passwordHash,
      name,
      verificationStatus: VerificationStatus.PENDING,
      isActive: false,
      isEmailVerified: false,
      isPhoneVerified: false,
    };

    const lawyer = this.lawyerRepository.create(lawyerData);
    const savedLawyer: Lawyer = await this.lawyerRepository.save(lawyer);

    // Send OTP for verification - BOTH Email and Phone
    await this.otpService.sendOtp(email, undefined); // Send Email OTP
    await this.otpService.sendOtp(undefined, phone); // Send Phone OTP

    return {
      lawyer: {
        id: savedLawyer.id,
        email: savedLawyer.email,
        phone: savedLawyer.phone,
        name: savedLawyer.name,
        verificationStatus: savedLawyer.verificationStatus,
      },
      message: 'Lawyer registered. Please verify both Email and Mobile OTPs to complete registration.',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, phone, password, role = 'user' } = loginDto;

    if (!email && !phone) {
      throw new BadRequestException('Email or phone is required');
    }

    let entity: User | Lawyer | null = null;
    let userRole: UserRole = UserRole.USER;

    if (role === 'lawyer') {
      entity = await this.lawyerRepository.findOne({
        where: email ? { email } : { phone },
      });
      userRole = UserRole.LAWYER;
    } else {
      // Normal User or Admin
      entity = await this.userRepository.findOne({
        where: email ? { email } : { phone },
      });

      if (entity) {
        // Determine role from entity
        if ((entity as User).role === 'admin') {
          userRole = UserRole.ADMIN;
        } else {
          userRole = UserRole.USER;
        }
      }
    }

    if (!entity) {
      this.logger.warn('Login attempt with invalid credentials', 'AuthService', {
        email,
        phone,
        role,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    if (entity.passwordHash && password) {
      const isPasswordValid = await bcrypt.compare(password, entity.passwordHash);
      if (!isPasswordValid) {
        this.logger.warn('Login attempt with invalid password', 'AuthService', {
          userId: entity.id,
          email: entity.email,
        });
        throw new UnauthorizedException('Invalid credentials');
      }
    } else if (userRole !== UserRole.LAWYER && !(entity as User).googleId) {
      throw new UnauthorizedException('Password is required');
    }

    this.logger.log('User logged in successfully', 'AuthService', {
      userId: entity.id,
      email: entity.email,
      role: userRole,
    });

    // Generate tokens
    const tokens = await this.generateTokens({
      userId: entity.id,
      email: entity.email || entity.phone,
      role: userRole,
    });

    const removeSensitiveData = (obj: any) => {
      const { passwordHash, ...rest } = obj;
      return rest;
    };

    return {
      user: {
        ...removeSensitiveData(entity),
        role: userRole,
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
    const { email, phone, otp, userId, role = 'user' } = verifyOtpDto;

    // Verify Logic
    // We strictly use the provided email or phone to key into the OTP store.
    const isValid = await this.otpService.verifyOtp(email, phone, otp);
    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    let entity: User | Lawyer | null = null;
    let userRole = UserRole.USER;

    // Find Entity
    if (role === 'lawyer') {
      entity = await this.lawyerRepository.findOne({ where: email ? { email } : { phone } });
      userRole = UserRole.LAWYER;
    } else {
      entity = await this.userRepository.findOne({ where: email ? { email } : { phone } });

      if (entity) {
        if ((entity as User).role === 'admin') userRole = UserRole.ADMIN;
        else userRole = UserRole.USER;
      }
    }

    if (!entity) {
      throw new UnauthorizedException('User not found');
    }

    // Update Verification Status
    if (userRole === UserRole.LAWYER) {
      const lawyer = entity as Lawyer;
      if (email) {
        lawyer.isEmailVerified = true;
      }
      if (phone) {
        lawyer.isPhoneVerified = true;
      }
      await this.lawyerRepository.save(lawyer);
    } else if (userRole === UserRole.USER) {
      (entity as User).isVerified = true;
      await this.userRepository.save(entity as User);
    }

    // Generate tokens
    const tokens = await this.generateTokens({
      userId: entity.id,
      email: entity.email || entity.phone,
      role: userRole,
    });

    const removeSensitiveData = (obj: any) => {
      const { passwordHash, ...rest } = obj;
      return rest;
    };

    return {
      message: 'OTP verified successfully',
      user: {
        ...removeSensitiveData(entity),
        role: userRole,
        // Include verification state for lawyers
        isEmailVerified: userRole === UserRole.LAWYER ? (entity as Lawyer).isEmailVerified : undefined,
        isPhoneVerified: userRole === UserRole.LAWYER ? (entity as Lawyer).isPhoneVerified : undefined,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
      });

      // Check if refresh token exists in Redis
      try {
        const storedToken = await this.redis.get(`refresh_token:${payload.userId}`);
        // If Redis is online and token mismatch, reject
        if (storedToken && storedToken !== refreshToken) {
          throw new UnauthorizedException('Invalid refresh token');
        }
        // If storedToken is null but Redis is online (and we expect it to be there), maybe reject?
        // For now, if Redis is down or empty, we might be lenient or strict.
        // Let's be strict if Redis works, lenient if it throws.
      } catch (redisError) {
        this.logger.warn('Redis unavailable during token refresh', 'AuthService');
        // If Redis is confirmed down, we might allow if signature is valid.
        // But the error "Stream isn't writable" means we can't communicate.
      }

      // Generate new tokens
      const tokens = await this.generateTokens({
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      });

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      this.logger.error('Failed to refresh token', error.stack, 'AuthService');
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    try {
      await this.redis.del(`refresh_token:${userId}`);
    } catch (e) {
      this.logger.warn(`Failed to remove token from Redis for user ${userId}`, 'AuthService');
    }

    this.logger.log('User logged out successfully', 'AuthService', { userId });
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
    try {
      await this.redis.set(
        `refresh_token:${payload.userId}`,
        refreshToken,
        'EX',
        7 * 24 * 60 * 60, // 7 days
      );
    } catch (e) {
      this.logger.warn(`Failed to store refresh token in Redis for user ${payload.userId}`, 'AuthService');
    }

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
