import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
// import * as WinstonCloudWatch from 'winston-cloudwatch';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor(configService: ConfigService) {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        // Consola (todos los logs)
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),

        // Archivos rotativos (todos los logs, con rotación diaria)
        new winston.transports.DailyRotateFile({
          filename: 'logs/app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: configService.get('LOG_MAX_SIZE') || '20m',
          maxFiles: configService.get('LOG_EXPIRATION') || '14d',
          level: 'info',
        }),

        // CloudWatch (solo errores críticos)
        // new WinstonCloudWatch({
        //   logGroupName: 'MyAppLogs',
        //   logStreamName: 'Production',
        //   awsRegion: 'us-east-1',
        //   level: 'error', // Solo logs de error van a CloudWatch
        // }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(`${message} - Trace: ${trace}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
