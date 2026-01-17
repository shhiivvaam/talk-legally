import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { AppLoggerService } from '@shared/utils/logger.service';

process.env.SERVICE_NAME = process.env.SERVICE_NAME || 'wallet-service';

async function bootstrap() {
  const logger = AppLoggerService.create('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    app.useLogger(app.get(AppLoggerService));

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: process.env.NODE_ENV === 'production',
      })
    );

    // TCP Microservice for internal communication
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3002,
      },
    });

    await app.startAllMicroservices();

    const port = process.env.PORT || 3002;
    await app.listen(port);
    
    logger.log(`Wallet Service is running on port ${port}`, 'Bootstrap', {
      environment: process.env.NODE_ENV || 'development',
      port,
      microservicePort: 3002,
    });
  } catch (error) {
    logger.error(
      'Failed to start Wallet Service',
      error instanceof Error ? error.stack : String(error),
      'Bootstrap'
    );
    process.exit(1);
  }
}

bootstrap();
