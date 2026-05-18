import { Injectable } from '@nestjs/common';
import { Profile } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProfile, GetProfile, GetProfileByUserId, UpdateProfile } from './interface/profile.interface';
import { Page } from '../auth/interface/page.interface';
import { PAGE, PAGE_LIMIT } from '../../utils/constants';

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

  async findOne(data: GetProfile): Promise<Profile|null>{
    return await this.prisma.profile.findFirst({
      where: data,
      include: {
        user: {
          omit: {
            password: true
          }
        }
      }
    });
  }

  async update(profile:GetProfileByUserId, payload:UpdateProfile ): Promise<Profile> {
    return await this.prisma.profile.update({
      where:profile,
      data:payload,
    })
  }

  async findAll(pagination: Page){
    const limit = pagination.limit ? Number(pagination.limit) : PAGE_LIMIT;
    const page = pagination.page ? Number(pagination.page) : PAGE;
    const skip = (page - 1) * limit

    const [profiles, count] = await Promise.all([
      await this.prisma.profile.findMany({
        include:{
          user: true
        },
        skip, take:limit
      }),
      await this.prisma.profile.count({})
    ])

    const totalPages = Math.ceil(count / limit);

    const meta = {
      currentPage: page,
      limit,
      totalPages,
      totalCount: count,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }

    return { profiles, meta} 
  }
}