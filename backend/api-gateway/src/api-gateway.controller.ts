import { Controller, All, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiGatewayService } from './api-gateway.service';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class ApiGatewayController {
    constructor(private readonly apiGatewayService: ApiGatewayService) { }

    @All('auth/*splat')
    @UseGuards(AuthGuard)
    async proxyAuth(@Req() req: Request, @Res() res: Response) {
        return this.apiGatewayService.proxyRequest(req, res);
    }

    @All('users/*splat')
    @UseGuards(AuthGuard)
    async proxyUsers(@Req() req: Request, @Res() res: Response) {
        return this.apiGatewayService.proxyRequest(req, res);
    }

    @All('lawyers/*splat')
    @UseGuards(AuthGuard)
    async proxyLawyers(@Req() req: Request, @Res() res: Response) {
        return this.apiGatewayService.proxyRequest(req, res);
    }

    @All('wallet/*splat')
    @UseGuards(AuthGuard)
    async proxyWallet(@Req() req: Request, @Res() res: Response) {
        return this.apiGatewayService.proxyRequest(req, res);
    }

    @All('payment/*splat')
    @UseGuards(AuthGuard)
    async proxyPayment(@Req() req: Request, @Res() res: Response) {
        return this.apiGatewayService.proxyRequest(req, res);
    }

    @All('sessions/*splat')
    @UseGuards(AuthGuard)
    async proxySessions(@Req() req: Request, @Res() res: Response) {
        return this.apiGatewayService.proxyRequest(req, res);
    }

    @All('admin/*splat')
    @UseGuards(AuthGuard)
    async proxyAdmin(@Req() req: Request, @Res() res: Response) {
        return this.apiGatewayService.proxyRequest(req, res);
    }

    @All('notifications/*splat')
    @UseGuards(AuthGuard)
    async proxyNotifications(@Req() req: Request, @Res() res: Response) {
        return this.apiGatewayService.proxyRequest(req, res);
    }

    @All('chat/*splat')
    @UseGuards(AuthGuard)
    async proxyChat(@Req() req: Request, @Res() res: Response) {
        return this.apiGatewayService.proxyRequest(req, res);
    }
}
