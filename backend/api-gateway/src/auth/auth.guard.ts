import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import axios from 'axios';

@Injectable()
export class AuthGuard implements CanActivate {
  private authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const path = request.path;

    // Public endpoints that don't require authentication
    const publicPaths = [
      '/auth/register',
      '/auth/login',
      '/auth/google',
      '/auth/otp/send',
      '/auth/otp/verify',
      '/payment/webhook',
    ];

    const isPublicPath = publicPaths.some((publicPath) => path.startsWith(publicPath));

    if (isPublicPath) {
      return true;
    }

    // Extract token from header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.substring(7);

    try {
      // Verify token with auth service
      const response = await axios.get(`${this.authServiceUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Attach user to request
      request.user = response.data;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
