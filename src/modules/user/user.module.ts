import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@Module({
  imports: [],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})

export class UserModule {}