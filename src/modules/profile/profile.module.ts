import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileRepository } from './profile.repository';

@Module({
  imports: [],
  providers: [ProfileService, ProfileRepository],
  exports: [ProfileService, ProfileRepository],
})

export class ProfileModule {}