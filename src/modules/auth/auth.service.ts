import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { UserService } from '../user/user.service';
import { EventService } from '../../services/events/event.service';
import { encrypt } from '../../utils/hash';
import { EVENT_NAMES } from '../../services/events/event.name.constants';
import { generateRandomNumber } from '../../utils/random.string';
import { RedisService } from '../../services/redis/redis.service';
import { success } from '../../utils/response.api';
import { decryptObjectToken, encryptObjectToken } from '../../utils/object.token';
import { SendEmailDto } from './dto/send.email.dto';
import { VerifyEmailDto } from './dto/verify.email.dto';
import { User } from '../../generated/prisma/client';
import { TokensDto } from './dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenService } from '../refreshToken/refreshToken.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private redisService: RedisService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private refreshTokenService: RefreshTokenService
  ) {}

  async confirmUniqueUser(email: string): Promise<any> {
    //Confirm email is unique
    const isEmailUnique = await this.userService.findOneByEmail({email});  
    if (isEmailUnique) {
      throw new ConflictException('Email already registered');
    }
  }

  async register(registerDto: CreateUserDto){
    // Confirm request email uniqueness.
    await this.confirmUniqueUser(registerDto.email.toLowerCase());

    const hashedPassword = await encrypt(registerDto.password);

    //Create new user
    const user = await this.userService.create({
      ...registerDto,
      email: registerDto.email.toLowerCase(),
      password: hashedPassword
    });

    const requestToken = encryptObjectToken(registerDto);

    // Generate OTP
    const OTP = generateRandomNumber(6);

    //Store OTP for 30secs
    await this.redisService.setValue(OTP, requestToken, 180000);

    //Send OTP to user's email
    await this.eventService.emit(EVENT_NAMES.CREATE_NEW_USER, {...registerDto})

    console.log({ OTP })

    this.logger.log(`New user registered: ${user.email}`);

    const data = {
      email: registerDto.email,
      requiresVerification: true
    }

    return success("User registered successfully", data)
  }

  async resendEmail(resendEmailDto: SendEmailDto){
    const isExistingEmail = await this.userService.findOneByEmail({ 
      email: resendEmailDto.email.toLowerCase()
    });

    if(!isExistingEmail){
      throw new NotFoundException("Email not found");
    }

    if(isExistingEmail.isEmailVerified == true){
      throw new UnauthorizedException("Unable to send verification email, email already verified");
    }

    // Encrypt Payload
    const requestToken = encryptObjectToken(resendEmailDto);

    // Generate OTP
    const OTP = generateRandomNumber(6);

    //Store OTP for 3 mins
    await this.redisService.setValue(OTP, requestToken, 180000);

    // Send OTP TO user

    console.log({ OTP })

    const data = {
      email: resendEmailDto.email,
      requiresVerification: true
    }

    return success("Verification email sent successfully", data)
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto){
    // Validate otp
    const encryptedToken = await this.redisService.getValue(verifyEmailDto.otp);

    if(!encryptedToken){
      throw new BadRequestException("Invalid OTP code provided.");
    }

    const userData  = decryptObjectToken(encryptedToken);

    const user = await this.userService.findOneByEmail({email: userData.email.toLowerCase()})
    if(!user){
      throw new NotFoundException("Email not found");
    }

    if(user.isEmailVerified == true){
      throw new UnauthorizedException("Unable to send verification email, email already verified");
    }

    const updateUser = await this.userService.update({email:userData.email.toLowerCase()}, {
      isActive: true,
      isEmailVerified: true,
      lastLoginAt: new Date()
    })

    // Automatically login the user and retrieve token
    const data = await this.generateTokens(updateUser);

    return success("Email verified successfully", data)
  }

  async generateTokens(user: User): Promise<TokensDto> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    // Store hashed refresh token
    const hashedRefresh = await encrypt(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenService.create({
      token: hashedRefresh,
      userId: user.id,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 3600, // 60 minutes
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }


}