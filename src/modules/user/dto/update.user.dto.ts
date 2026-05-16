import { IsEmail, IsString, MinLength, MaxLength, IsStrongPassword, IsNotEmpty, IsOptional, IsBoolean, IsDateString, isDate, isDateString } from "class-validator";
import { Role } from "../../../generated/prisma/enums";

export class UpdateUserDto {

  //@IsOptional()
  //@IsString()
  //@IsStrongPassword()
  //@MaxLength(50)
  //password?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  role?: Role

  @IsOptional()
  auth0Id?: string | null

  @IsOptional()
  @IsDateString()
  lastLoginAt?: Date;
}