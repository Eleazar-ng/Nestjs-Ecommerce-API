import { Injectable } from '@nestjs/common';
import { User } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUser, GetUser, GetUserByEmail, GetUsersFilter, UpdateUser } from './interface/user.interface';
import { Page } from '../auth/interface/page.interface';
import { PAGE, PAGE_LIMIT } from '../../utils/constants';

@Injectable()
export class UserRepository {
  constructor(
    private prisma: PrismaService
  ){}

  async create(payload: CreateUser ): Promise<User> {
    return await this.prisma.user.create({ 
      data: payload 
    });
  }

  async update(user:GetUserByEmail, payload:UpdateUser ): Promise<User> {
    return await this.prisma.user.update({
      where:user,
      data:payload,
    })
  }

  async findOne(data: GetUser): Promise<User|null|any>{
    return await this.prisma.user.findFirst({
      where: data,
      omit:{
        password:true
      }
    });
  }

  async findOneByEmail(data: GetUserByEmail): Promise<User|null>{
    return await this.prisma.user.findUnique({
      where: data,
    });
  }

  async findAll(filters: GetUsersFilter, pagination: Page){
    const limit = pagination.limit ? Number(pagination.limit) : PAGE_LIMIT;
    const page = pagination.page ? Number(pagination.page) : PAGE;
    const skip = (page - 1) * limit

    const [users, count] = await Promise.all([
      await this.prisma.user.findMany({
        where:filters, skip, take:limit
      }),
      await this.prisma.user.count({
        where:filters
      })
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

    return { users, meta} 
  }
}