import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileRepository } from './profile.repository';
import { ProfileController } from './profile.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
  exports: [ProfileService, ProfileRepository],
})

export class ProfileModule {}