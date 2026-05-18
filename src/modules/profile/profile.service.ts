import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Profile } from '../../generated/prisma/client';
import { ProfileRepository } from './profile.repository';
import { CreateProfileDto } from './dto/create.profile.dto';
import { GetProfileByIdDto, GetProfileByUserIdDto } from './dto/get.profile.dto';
import { UpdateProfileDto } from './dto/update.profile.dto';
import { GetProfilesDto } from './dto/get.profiles.dto';


@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private profileRepository: ProfileRepository) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile>{
    this.logger.log(`***** New Profile created: ${createProfileDto.userId} ******`);
    return await this.profileRepository.create(createProfileDto)
  }

  async findOneByUserId(getProfileDto: GetProfileByUserIdDto): Promise<Profile|null>{
    const profile = await this.profileRepository.findOne(getProfileDto);
    if(!profile) throw new NotFoundException("Profile not found");
    return profile;
  }

  async findOne(getProfileDto: GetProfileByIdDto): Promise<Profile|null>{
    const profile = await this.profileRepository.findOne(getProfileDto);
    if(!profile) throw new NotFoundException("Profile not found");
    return profile;
  }


  async update(getProfileDto: GetProfileByUserIdDto, updateProfileDto: UpdateProfileDto): Promise<Profile>{
    this.logger.log(`******* Updated Existing User Profile: ${getProfileDto.userId} ******`);
    return await this.profileRepository.update(getProfileDto, updateProfileDto);
  }

  async findAll(filters: GetProfilesDto) {
    const {page, limit} = filters;
    return await this.profileRepository.findAll({page, limit});
  }
}