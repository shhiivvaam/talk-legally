import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class ApiGatewayService {
  private services: Map<string, string> = new Map([
    ['/auth', process.env.AUTH_SERVICE_URL || 'http://localhost:3001'],
    ['/users', process.env.USER_SERVICE_URL || 'http://localhost:3006'],
    ['/lawyers', process.env.LAWYER_SERVICE_URL || 'http://localhost:3007'],
    ['/wallet', process.env.WALLET_SERVICE_URL || 'http://localhost:3002'],
    ['/payment', process.env.PAYMENT_SERVICE_URL || 'http://localhost:3003'],
    ['/sessions', process.env.SESSION_SERVICE_URL || 'http://localhost:3004'],
    ['/admin', process.env.ADMIN_SERVICE_URL || 'http://localhost:3009'],
    ['/notifications', process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3008'],
  ]);

  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      timeout: 30000,
    });
  }

  async proxyRequest(req: any, res: any) {
    const path = req.path;
    const serviceUrl = this.findServiceUrl(path);

    if (!serviceUrl) {
      return res.status(404).json({ message: 'Service not found' });
    }

    try {
      const targetUrl = `${serviceUrl}${path}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
      
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
    } catch (error) {
      if (error.response) {
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
