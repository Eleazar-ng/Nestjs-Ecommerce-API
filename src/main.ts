import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import helmet from 'helmet';
import compression from 'compression';
import { TransformInterceptor } from './common/interceptors/transform.intercept';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  // Use Winston for internal logging
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  // Security
  app.use(helmet());
  app.use(compression()); 
  
  // CORS
  app.enableCors({
    origin: configService.get<string>('ALLOWED_ORIGINS', '').split(','),
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  });

    // API Prefix
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

    // Global Filters & Interceptors
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalInterceptors(
    new LoggingInterceptor(logger),
    new TransformInterceptor(),
  );

    // Swagger Documentation
  if (configService.get<string>('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('E-Commerce API')
      .setDescription(
        `
        ## Scalable E-Commerce REST API
        
        ### Features
        - JWT & Auth0 Authentication
        - Product Management with Variants & Inventory
        - Shopping Cart with Coupon Support
        - Order Management with Status Tracking
        - Stripe Payment Integration
        - Admin Panel
        - Real-time Notifications
        
        ### Authentication
        Use **Bearer Token** in the Authorization header.
        Obtain tokens via \`POST /api/v1/auth/login\`
      `,
      )
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication & Authorization')
      .addTag('users', 'User Management')
      .addTag('products', 'Product Catalog')
      .addTag('categories', 'Product Categories')
      .addTag('cart', 'Shopping Cart')
      .addTag('orders', 'Order Management')
      .addTag('payments', 'Payment Processing')
      .addTag('reviews', 'Product Reviews')
      .addTag('wishlist', 'Wishlist')
      .addTag('admin', 'Admin Operations')
      .addTag('health', 'Health Check')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
      },
    });
  }

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  logger.log(`🚀🚀🚀 Application running on: http://localhost:${port}/${apiPrefix}`, 'Bootstrap');
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});;
