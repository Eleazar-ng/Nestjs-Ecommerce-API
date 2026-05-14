import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { EventModule } from '../../services/events/event.module';
import { RedisService } from '../../services/redis/redis.service';
import { RefreshTokenModule } from '../refreshToken/refreshToken.module';
import { LocalStrategy } from './strategies/local.strategy';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<any>('JWT_ACCESS_EXPIRES_IN', '60m'),
        },
        global:true
      }),
      inject: [ConfigService],
    }),
    UserModule,
    EventModule,
    RefreshTokenModule,
    ProfileModule
  ],
  controllers: [AuthController],
  providers: [AuthService,RedisService, LocalStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
