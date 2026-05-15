import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { UserRepository } from './user.repository';
import { User } from '../../generated/prisma/client';
import { GetUserByEmailDto, GetUserByIdDto } from './dto/get.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';


@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private userRepository: UserRepository) {}

  async findOneByEmail(getUserDto: GetUserByEmailDto): Promise<User|null>{
    return await this.userRepository.findOneByEmail(getUserDto)
  }

  async create(createUserDto: CreateUserDto): Promise<User>{
    this.logger.log(`******* New User created: ${createUserDto.email, createUserDto.firstName } ******`);
    return await this.userRepository.create(createUserDto)
  }

  async update(getUserDto: GetUserByEmailDto, updateUserDto: UpdateUserDto): Promise<User>{
    this.logger.log(`******* Updated Existing User: ${getUserDto.email} ******`);
    return await this.userRepository.update(getUserDto, updateUserDto)
  }

  async findOneById(getUserDto: GetUserByIdDto): Promise<User|null>{
    return await this.userRepository.findOne(getUserDto)
  }
}