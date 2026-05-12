import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, maxLength, MinLength } from "class-validator";

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsString()
  // @MaxLength(6)
  @MinLength(6)
  otp!: string; 
}