import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService} from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createWinstonLogger } from './logger/winston.config';
import * as Joi from 'joi';
import * as winston from 'winston';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().port().default(3001),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    //Logging
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => 
        createWinstonLogger(configService),
      inject: [ConfigService],
    })
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
