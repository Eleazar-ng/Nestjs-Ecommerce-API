import { Injectable, Logger } from '@nestjs/common';
import { Profile } from '../../generated/prisma/client';
import { ProfileRepository } from './profile.repository';
import { CreateProfileDto } from './dto/create.profile';


@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private profileRepository: ProfileRepository) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile>{
    this.logger.log(`***** New Profile created: ${createProfileDto.userId} ******`);
    return await this.profileRepository.create(createProfileDto)
  }
}