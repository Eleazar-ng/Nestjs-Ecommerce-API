import { IsEmail, IsString, MinLength, MaxLength, IsStrongPassword, IsNotEmpty } from "class-validator";

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  @MaxLength(50)
  password!: string;
}