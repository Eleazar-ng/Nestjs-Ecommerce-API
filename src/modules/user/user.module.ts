import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guards';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtAuthGuard],
  exports: [UserService, UserRepository],
})

export class UserModule {}