import { Controller, Post, Get, Body,UseGuards, Request, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { SendEmailDto } from './dto/send.email.dto';
import { VerifyEmailDto } from './dto/verify.email.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { LoginUserDto } from './dto/login.user.dto';
import { success } from '../../utils/response.api';

@ApiTags('auth')
@Controller('auth')
// @UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Creates a new user account',
    description: 'This endpoint creates a new user account and sends a verification email.'
  })
  @ApiResponse({
    status: 201, 
    description: 'Account creation successful'
  })
  async register(@Body() registerDto: CreateUserDto){
    const data = await this.authService.register(registerDto);
    return success("User registered successfully", data);
  }

  @Public()
  @Post('resend-email')
  @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ 
    summary: 'Resend verification email',
    description: 'This endpoint sends a verification email.'
  })
  @ApiResponse({
    status: 201, 
    description: 'Verification email sent successfully'
  })
  async resend(@Body() resendDto: SendEmailDto){
    const data = await this.authService.resendEmail(resendDto);
    return success("Verification email sent successfully", data);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ 
    summary: 'Verify otp',
    description: 'This endpoint verifies otp.'
  })
  @ApiResponse({
    status: 201, 
    description: 'Email verified successfully'
  })
  async verify(@Body() verifyEmailDto: VerifyEmailDto){
    const data = await this.authService.verifyEmail(verifyEmailDto);
    return success("Email verified successfully", data);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ 
    summary: 'Login with email and password',
    description: 'This endpoint logs in a user'
  })
  @ApiResponse({
    status: 201, 
    description: 'Login successful'
  })
  async login(@Body() loginUserDto: LoginUserDto){
    const data = await this.authService.login(loginUserDto);
    return success("Logged In Successfully", data);
  }

}