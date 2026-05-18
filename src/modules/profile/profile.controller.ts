import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put, Query, Request, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth-guards";
import { RolesGuard } from "../auth/guards/roles.guard";
import { ProfileService } from "./profile.service";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../generated/prisma/enums";
import { success } from "../../utils/response.api";
import { UpdateProfileDto } from "./dto/update.profile.dto";
import { GetProfilesDto } from "./dto/get.profiles.dto";
import { GetProfileByIdDto } from "./dto/get.profile.dto";



@ApiTags('profiles')
@Controller('profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfileController {
  constructor(private profileService: ProfileService){}

  @Get('me')
  @Roles(Role.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get current User Profile',
    description: 'This endpoint retrieves the current user profile.'
  })
  @ApiResponse({
    status: 200, 
    description: 'User Profile retrieved successfully'
  })
  async getProfile(@Request() req){
    const data = await this.profileService.findOneByUserId({userId: req.user.sub});
    return success('User profile retrieved successfully', data);
  }

  @Put('me')
  @Roles(Role.CUSTOMER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Update current User Profile',
    description: 'This endpoint updates the current user profile.'
  })
  @ApiResponse({
    status: 200, 
    description: 'User Profile updated successfully'
  })
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto){
    await this.profileService.update({userId: req.user.sub}, {...updateProfileDto});
    return success('User Profile updated successfully', true);
  }



  // ---------------- ADMIN ----------------------------
  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "List all user profiles"})
  @ApiResponse({
    status:200
  })
  async findAll(@Query() query: GetProfilesDto){
    const data = await this.profileService.findAll(query);
    return success('Users profiles retrieved successfully', data);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get one user profile"})
  @ApiResponse({
    status: 200
  })
  async findOne(@Param() param: GetProfileByIdDto){
    const data = await this.profileService.findOne(param);
    return success('User profile retrieved successfully', data);
  }
}