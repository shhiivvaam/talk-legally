import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

const logDir = process.env.LOG_DIR || 'logs';
const nodeEnv = process.env.NODE_ENV || 'development';

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development (human-readable)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, context, trace, ...meta }) => {
    let log = `${timestamp} [${level}]`;
    if (context) {
      log += ` [${context}]`;
    }
    log += `: ${message}`;

    // Add stack trace for errors
    if (trace) {
      log += `\n${trace}`;
    }

    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }

    return log;
  })
);

// Create Winston logger instance
export const createWinstonLogger = (context?: string) => {
  const serviceName = process.env.SERVICE_NAME || 'service';
  const transports: winston.transport[] = [];

  // Console transport - always enabled
  transports.push(
    new winston.transports.Console({
      format: nodeEnv === 'production' ? logFormat : consoleFormat,
      level: nodeEnv === 'production' ? 'info' : 'debug',
    })
  );

  // File transports for production
  if (nodeEnv === 'production') {
    // Combined log file
    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, `${serviceName}-combined.log`),
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        tailable: true,
      })
    );

    // Error log file
    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, `${serviceName}-error.log`),
        level: 'error',
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 10,
        tailable: true,
      })
    );
  }

  // Development file logging (optional)
  if (nodeEnv === 'development') {
    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, `${serviceName}-dev.log`),
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 3,
      })
    );
  }

  return winston.createLogger({
    level: process.env.LOG_LEVEL || (nodeEnv === 'production' ? 'info' : 'debug'),
    format: logFormat,
    defaultMeta: {
      service: serviceName,
      context: context || 'Application',
    },
    transports,
    exceptionHandlers: [
      new winston.transports.File({
        filename: path.join(logDir, `${serviceName}-exceptions.log`),
        format: logFormat,
      }),
    ],
    rejectionHandlers: [
      new winston.transports.File({
        filename: path.join(logDir, `${serviceName}-rejections.log`),
        format: logFormat,
      }),
    ],
    exitOnError: false,
  });
};
