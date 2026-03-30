import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterLawyerDto } from './dto/register-lawyer.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SendOtpDto, SendEmailOtpDto, SendPhoneOtpDto } from './dto/send-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register/user')
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('register/lawyer')
  async registerLawyer(@Body() registerLawyerDto: RegisterLawyerDto) {
    return this.authService.registerLawyer(registerLawyerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleAuth(@Body() googleAuthDto: GoogleAuthDto) {
    return this.authService.googleAuth(googleAuthDto);
  }

  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto.email, sendOtpDto.phone);
  }

  @Post('otp/send/email')
  @HttpCode(HttpStatus.OK)
  async sendEmailOtp(@Body() sendEmailOtpDto: SendEmailOtpDto) {
    return this.authService.sendOtp(sendEmailOtpDto.email, undefined);
  }

  @Post('otp/send/phone')
  @HttpCode(HttpStatus.OK)
  async sendPhoneOtp(@Body() sendPhoneOtpDto: SendPhoneOtpDto) {
    return this.authService.sendOtp(undefined, sendPhoneOtpDto.phone);
  }

  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    return this.authService.logout(req.user.userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user);
  }
}
