import { Controller, Post, Get, UseGuards, Request, HttpCode, HttpStatus, Put, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guards';
import { UpdateUserDto } from './dto/update.user.dto';
import { success } from '../../utils/response.api';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';
import { GetUsersDto } from './dto/get.users.dto';
import { GetUserByIdDto } from './dto/get.user.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get signed-in User Info',
    description: 'This endpoint retrieves the current signed-in user.'
  })
  @ApiResponse({
    status: 200, 
    description: 'User Information retrieved successfully'
  })
  async getUser(@Request() req){
    const data = await this.userService.findOneById({id: req.user.id});
    return success('User retrieved successfully', data);
  }

  @Put('me')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Update signed-in User Info',
    description: 'This endpoint updates the current signed-in user.'
  })
  @ApiResponse({
    status: 200, 
    description: 'User Information updated successfully'
  })
  async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto){
    await this.userService.update({email: req.user.email}, {...updateUserDto});
    return success('User Information updated successfully', true);
  }



  // ---------------- ADMIN ----------------------------
  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "List all users"})
  @ApiResponse({
    status:200
  })
  async findAll(@Query() query: GetUsersDto){
    const data = await this.userService.findAll(query);
    return success('Users retrieved successfully', data);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get one user"})
  @ApiResponse({
    status: 200
  })
  async findOne(@Param() param: GetUserByIdDto){
    const data = await this.userService.findOneById(param);
    return success('User retrieved successfully', data);
  }

}