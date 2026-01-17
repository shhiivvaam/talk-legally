# Production-Grade Logging Setup Guide

This guide explains how to set up production-grade structured logging across all services in the Talk Legally platform.

## Overview

We've implemented a Winston-based logging system that provides:
- **Structured JSON logging** for production (machine-readable)
- **Human-readable console logging** for development
- **Automatic log rotation** with file size limits
- **Separate error logs** for easier debugging
- **HTTP request/response logging** with automatic sanitization
- **Exception handling** with full context

## Architecture

The logging system consists of:

1. **Winston Configuration** (`backend/shared/utils/winston.config.ts`)
   - Configures Winston logger with appropriate transports
   - Production: JSON format to files + console
   - Development: Human-readable console + optional file

2. **Logger Service** (`backend/shared/utils/logger.service.ts`)
   - NestJS-compatible logger service
   - Provides structured logging methods
   - Includes helpers for HTTP, database, etc.

3. **Logger Module** (`backend/shared/utils/logger.module.ts`)
   - Global NestJS module
   - Automatically registers HTTP interceptor and exception filter

4. **HTTP Exception Filter** (`backend/shared/utils/http-exception.filter.ts`)
   - Catches all exceptions
   - Logs with full context (request, body, query, params)
   - Returns structured error responses

5. **Logging Interceptor** (`backend/shared/utils/logging.interceptor.ts`)
   - Logs all HTTP requests/responses
   - Measures response times
   - Sanitizes sensitive data (passwords, tokens, etc.)

## Setup Instructions

### Step 1: Add Dependencies

Add these dependencies to each service's `package.json`:

```json
{
  "dependencies": {
    "winston": "^3.11.0",
    "winston-daily-rotate-file": "^4.7.1"
  },
  "devDependencies": {
    "@types/winston": "^2.4.4"
  }
}
```

### Step 2: Update App Module

Import `LoggerModule` in your service's `app.module.ts`:

```typescript
import { LoggerModule } from '@shared/utils/logger.module';

@Module({
  imports: [
    // ... other imports
    LoggerModule,
  ],
  // ...
})
export class AppModule {}
```

### Step 3: Update Main Bootstrap

Update `main.ts` to use the logger:

```typescript
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppLoggerService } from '@shared/utils/logger.service';

// Set service name for logging
process.env.SERVICE_NAME = process.env.SERVICE_NAME || 'your-service-name';

async function bootstrap() {
  const logger = new AppLoggerService('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    // Use custom logger for application logs
    app.useLogger(app.get(AppLoggerService));

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: process.env.NODE_ENV === 'production',
      })
    );

    // ... other app configuration

    const port = process.env.PORT || 3000;
    await app.listen(port);
    
    logger.log(`Service is running on port ${port}`, 'Bootstrap', {
      environment: process.env.NODE_ENV || 'development',
      port,
    });
  } catch (error) {
    logger.error(
      'Failed to start service',
      error instanceof Error ? error.stack : String(error),
      'Bootstrap'
    );
    process.exit(1);
  }
}

bootstrap();
```

### Step 4: Use Logger in Services

Inject and use the logger in your services:

```typescript
import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '@shared/utils/logger.service';

@Injectable()
export class YourService {
  private readonly logger: AppLoggerService;

  constructor() {
    this.logger = new AppLoggerService('YourService');
  }

  async someMethod() {
    try {
      this.logger.log('Processing request', 'YourService', { data: 'value' });
      // ... your logic
    } catch (error) {
      this.logger.error(
        'Error in someMethod',
        error instanceof Error ? error.stack : String(error),
        'YourService',
        { additionalContext: 'value' }
      );
      throw error;
    }
  }
}
```

## Environment Variables

Configure logging via environment variables:

```bash
# Service name (used in log file names)
SERVICE_NAME=auth-service

# Log directory (default: 'logs')
LOG_DIR=logs

# Log level (error, warn, info, debug, verbose)
LOG_LEVEL=info

# Node environment (development, production)
NODE_ENV=production
```

## Log File Structure

Logs are organized as follows:

```
logs/
├── {service-name}-combined.log    # All logs (production)
├── {service-name}-error.log        # Error logs only (production)
├── {service-name}-exceptions.log   # Uncaught exceptions
├── {service-name}-rejections.log   # Unhandled promise rejections
└── {service-name}-dev.log          # Development logs
```

## Log Format

### Production (JSON)
```json
{
  "timestamp": "2026-01-16 16:45:30.123",
  "level": "error",
  "message": "Database connection failed",
  "service": "auth-service",
  "context": "Database",
  "error": "Connection timeout",
  "stack": "Error: Connection timeout\n    at ...",
  "query": "SELECT * FROM users"
}
```

### Development (Human-readable)
```
2026-01-16 16:45:30 [error] [Database]: Database connection failed
Error: Connection timeout
    at ...
```

## Features

### Automatic Request Logging
All HTTP requests are automatically logged with:
- Method, URL, status code
- Response time
- IP address, user agent
- Request body (sanitized)

### Automatic Error Logging
All exceptions are automatically logged with:
- Full stack trace
- Request context (method, URL, body, query, params)
- Error type and message

### Sensitive Data Sanitization
The following fields are automatically redacted:
- `password`
- `token`
- `secret`
- `apiKey`
- `authorization`

## Services to Update

Update these services following the steps above:

- [x] auth-service (completed)
- [ ] admin-service
- [ ] chat-service
- [ ] lawyer-service
- [ ] notification-service
- [ ] payment-service
- [ ] session-service
- [ ] user-service
- [ ] wallet-service
- [ ] api-gateway

## Testing

After setup, test the logging:

1. Start your service
2. Make a request
3. Check console output (development) or log files (production)
4. Trigger an error and verify it's logged with full context

## Best Practices

1. **Always include context** in log messages
2. **Use appropriate log levels**:
   - `error`: Errors that need attention
   - `warn`: Warnings that might indicate issues
   - `info`: Important business events
   - `debug`: Detailed debugging information
   - `verbose`: Very detailed information

3. **Include relevant metadata** in log calls:
   ```typescript
   this.logger.log('User registered', 'AuthService', {
     userId: user.id,
     email: user.email,
   });
   ```

4. **Don't log sensitive information** - the interceptor handles this, but be careful in your code

5. **Use structured logging** - always pass metadata as objects, not strings

## Troubleshooting

### Logs not appearing
- Check `LOG_DIR` environment variable
- Ensure log directory is writable
- Check `LOG_LEVEL` - it might be filtering logs

### Logs too verbose
- Set `LOG_LEVEL=info` or `LOG_LEVEL=warn` in production
- Review interceptor configuration

### Log files too large
- Log rotation is automatic (5MB per file, 5-10 files kept)
- Adjust in `winston.config.ts` if needed
