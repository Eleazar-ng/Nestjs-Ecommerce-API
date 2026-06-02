import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService} from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createWinstonLogger } from './logger/winston.config';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';
import * as Joi from 'joi';
import * as winston from 'winston';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { RefreshTokenModule } from './modules/refreshToken/refreshToken.module';
import { ProfileModule } from './modules/profile/profile.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/products/products.module';
import { HealthModule } from './modules/health/health.module';
import { InventoryModule } from './modules/inventory/inventory.module';

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
        DATABASE_URL: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRES_IN: Joi.string().required(),
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
    }),

    // Event Emitter
    EventEmitterModule.forRoot({
      wildcard: true,
      maxListeners: 10,
    }),

    //Caching
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [
            new KeyvRedis('redis://localhost:6379'),
          ],
        };
      },
    }),

    //Feature Modules
    AuthModule,
    PrismaModule,
    UserModule,
    RefreshTokenModule,
    ProfileModule,
    CategoryModule,
    ProductModule,
    HealthModule,
    InventoryModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
