import { ConfigService } from '@nestjs/config';
import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export function createWinstonLogger(
  configService: ConfigService,
): WinstonModuleOptions {
  const logLevel = configService.get<string>('LOG_LEVEL', 'info');
  const logDir = configService.get<string>('LOG_DIR', 'logs');
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message, context, trace }) => {
      return `${timestamp} [${context || 'App'}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
    }),
  );

  const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  );

  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: nodeEnv === 'development' ? consoleFormat : fileFormat,
    }),
  ];

  if (nodeEnv !== 'test') {
    // Daily rotating file for all logs
    transports.push(
      new (winston.transports as any).DailyRotateFile({
        filename: `${logDir}/app-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d',
        format: fileFormat,
      }),
    );

    // Separate file for errors
    transports.push(
      new (winston.transports as any).DailyRotateFile({
        filename: `${logDir}/error-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '90d',
        level: 'error',
        format: fileFormat,
      }),
    );
  }

  return {
    level: logLevel,
    format: fileFormat,
    transports,
    exceptionHandlers: [
      new winston.transports.File({ filename: `${logDir}/exceptions.log` }),
    ],
    rejectionHandlers: [
      new winston.transports.File({ filename: `${logDir}/rejections.log` }),
    ],
  };
}