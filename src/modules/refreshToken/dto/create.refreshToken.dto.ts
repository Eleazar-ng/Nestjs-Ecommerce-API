import { IsEmail, IsString, MinLength, MaxLength, IsStrongPassword, IsNotEmpty, IsDate } from "class-validator";

export class CreateRefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  token!: string;

  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsNotEmpty()
  @IsDate()
  expiresAt!: Date;
}