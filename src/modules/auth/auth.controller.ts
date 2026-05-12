import { Controller, Post, Get, Body,UseGuards, Request, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { SendEmailDto } from './dto/send.email.dto';
import { VerifyEmailDto } from './dto/verify.email.dto';

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
  register(@Body() registerDto: CreateUserDto){
    return this.authService.register(registerDto);
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
  resend(@Body() resendDto: SendEmailDto){
    return this.authService.resendEmail(resendDto);
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
  verify(@Body() verifyEmailDto: VerifyEmailDto){
    return this.authService.verifyEmail(verifyEmailDto);
  }

}