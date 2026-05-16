import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { UserRepository } from './user.repository';
import { Role, User } from '../../generated/prisma/client';
import { GetUserByEmailDto, GetUserByIdDto } from './dto/get.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { GetUsersDto } from './dto/get.users.dto';
import { GetUsersFilter } from './interface/user.interface';


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
    const user = await this.userRepository.findOne(getUserDto);
    if(!user) throw new NotFoundException("User not found")
    return user;
  }

  async findAll(filters: GetUsersDto){
    const {firstName, lastName, isEmailVerified, role, email, page, limit} = filters;

    const userFilter: GetUsersFilter= {};

    if(firstName) userFilter.firstName = { contains: firstName, mode: 'insensitive' };

    if(lastName) userFilter.lastName = { contains: lastName, mode: 'insensitive' }
    
    if(isEmailVerified == 'true') userFilter.isEmailVerified = { equals: true }
    if(isEmailVerified == 'false') userFilter.isEmailVerified = { equals: false }
    
    if(email) userFilter.email = { equals: email }
  
    if(role){
      if(role == "CUSTOMER") userFilter.role = Role.CUSTOMER;
      if(role == "ADMIN") userFilter.role = Role.ADMIN;
      if(role == "SUPER_ADMIN") userFilter.role = Role.SUPER_ADMIN
    }

    return await this.userRepository.findAll(userFilter, {page, limit});
  }
}