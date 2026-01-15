import { Controller, All, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiGatewayService } from './api-gateway.service';
import { AuthGuard } from './auth/auth.guard';

@Controller('*')
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @All('*')
  @UseGuards(AuthGuard)
  async proxy(@Req() req: Request, @Res() res: Response) {
    return this.apiGatewayService.proxyRequest(req, res);
  }
}
