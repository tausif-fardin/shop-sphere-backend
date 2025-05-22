import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

@Module({
    imports: [
        WinstonModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const environment = configService.get<string>('NODE_ENV');
                const logLevel = configService.get<string>('LOG_LEVEL') || 'info';

                return {
                    level: logLevel,
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json(),
                        environment !== 'production'
                            ? winston.format.colorize()
                            : winston.format.uncolorize(),
                        winston.format.printf(({ timestamp, level, message, context, trace }) => {
                            return `${timestamp} [${context}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
                        }),
                    ),
                    transports: [
                        new winston.transports.Console(),
                        new winston.transports.File({
                            filename: 'logs/error.log',
                            level: 'error',
                            maxsize: 10 * 1024 * 1024, // 10MB
                            maxFiles: 5,
                        }),
                        new winston.transports.File({
                            filename: 'logs/combined.log',
                            maxsize: 10 * 1024 * 1024, // 10MB
                            maxFiles: 5,
                        }),
                    ],
                };
            },
        }),
    ],
})
export class LoggingModule { }
