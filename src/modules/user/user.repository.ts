import { Injectable } from '@nestjs/common';
import { User } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUser, GetUser, GetUserByEmail, UpdateUser } from './interface/user.interface';

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
}