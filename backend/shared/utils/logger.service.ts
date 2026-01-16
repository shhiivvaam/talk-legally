import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { createWinstonLogger } from './winston.config';

@Injectable()
export class AppLoggerService implements NestLoggerService {
  private logger: ReturnType<typeof createWinstonLogger>;
  private defaultContext: string;

  constructor() {
    // No constructor parameters - works with NestJS DI
    this.defaultContext = 'Application';
    this.logger = createWinstonLogger(this.defaultContext);
  }

  /**
   * Create a logger instance with a specific context
   * Use this for manual instantiation outside of DI
   */
  static create(context?: string): AppLoggerService {
    const instance = new AppLoggerService();
    if (context) {
      instance.setContext(context);
    }
    return instance;
  }

  /**
   * Set the default context for this logger instance
   */
  setContext(context: string): void {
    this.defaultContext = context;
  }

  log(message: string, context?: string, meta?: Record<string, any>) {
    this.logger.info(message, { context, ...meta });
  }

  error(message: string, trace?: string, context?: string, meta?: Record<string, any>) {
    this.logger.error(message, {
      context,
      trace,
      stack: trace,
      ...meta,
    });
  }

  warn(message: string, context?: string, meta?: Record<string, any>) {
    this.logger.warn(message, { context, ...meta });
  }

  debug(message: string, context?: string, meta?: Record<string, any>) {
    this.logger.debug(message, { context, ...meta });
  }

  verbose(message: string, context?: string, meta?: Record<string, any>) {
    this.logger.verbose(message, { context, ...meta });
  }

  // Additional helper methods for structured logging
  logHttpRequest(req: any, res: any, responseTime?: number) {
    this.logger.info('HTTP Request', {
      context: 'HTTP',
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: responseTime ? `${responseTime}ms` : undefined,
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('user-agent'),
    });
  }

  logHttpError(error: any, req: any, meta?: Record<string, any>) {
    this.logger.error('HTTP Error', {
      context: 'HTTP',
      method: req?.method,
      url: req?.url,
      error: error.message,
      stack: error.stack,
      statusCode: error.status || error.statusCode || 500,
      ...meta,
    });
  }

  logDatabaseQuery(query: string, duration?: number, meta?: Record<string, any>) {
    this.logger.debug('Database Query', {
      context: 'Database',
      query,
      duration: duration ? `${duration}ms` : undefined,
      ...meta,
    });
  }

  logDatabaseError(error: any, query?: string, meta?: Record<string, any>) {
    this.logger.error('Database Error', {
      context: 'Database',
      error: error.message,
      stack: error.stack,
      query,
      ...meta,
    });
  }
}
