import { Injectable } from '@nestjs/common';
import { Profile } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProfile } from './interface/profile.interface';

@Injectable()
export class ProfileRepository {
  constructor(
    private prisma: PrismaService
  ){}

  async create(payload: CreateProfile ): Promise<Profile> {
    return await this.prisma.profile.create({ 
      data: payload 
    });
  }
}