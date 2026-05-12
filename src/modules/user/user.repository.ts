import { Injectable } from '@nestjs/common';
import { User } from '../../generated/prisma/client';
import { CreateUserDto } from './dto/create.user.dto';
import { GetUserDto, GetUserByEmailDto } from './dto/get.user.dto';
import { PrismaService } from '../../prisma/prisma.service';
// import { GetUser, UpdateUser } from './user.interface';
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
      data:payload
    })
  }

  async findOne(data: GetUser): Promise<User|null>{
    return await this.prisma.user.findFirst({
      where: data
    });
  }

  async findOneByEmail(data: GetUserByEmail): Promise<User|null>{
    return await this.prisma.user.findUnique({
      where: data
    });
  }
}