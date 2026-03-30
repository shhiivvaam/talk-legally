import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { Request, Response } from 'express';

@Injectable()
export class ApiGatewayService {
  private readonly services: ReadonlyMap<string, string> = new Map([
    ['/auth', process.env.AUTH_SERVICE_URL || 'http://localhost:3001'],
    ['/wallet', process.env.WALLET_SERVICE_URL || 'http://localhost:3002'],
    ['/payment', process.env.PAYMENT_SERVICE_URL || 'http://localhost:3003'],
    ['/sessions', process.env.SESSION_SERVICE_URL || 'http://localhost:3004'],
    ['/chat', process.env.CHAT_SERVICE_URL || 'http://localhost:3005'],
    ['/users', process.env.USER_SERVICE_URL || 'http://localhost:3006'],
    ['/lawyers', process.env.LAWYER_SERVICE_URL || 'http://localhost:3007'],
    ['/notifications', process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3008'],
    ['/admin', process.env.ADMIN_SERVICE_URL || 'http://localhost:3009'],
  ]);

  private readonly httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      timeout: 30000,
    });
  }

  async proxyRequest(req: Request, res: Response) {
    const path = req.path;
    const serviceUrl = this.findServiceUrl(path);

    if (!serviceUrl) {
      return res.status(404).json({ message: 'Service not found' });
    }

    try {
      const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
      const targetUrl = `${serviceUrl}${path}${queryString}`;

      const response = await this.httpClient({
        method: req.method,
        url: targetUrl,
        data: req.body,
        headers: {
          ...req.headers,
          host: undefined,
        },
        params: req.query,
      });

      return res.status(response.status).json(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  private findServiceUrl(path: string): string | null {
    for (const [prefix, url] of this.services.entries()) {
      if (path.startsWith(prefix)) {
        return url;
      }
    }
    return null;
  }
}
