import { IsEmail, IsString } from "class-validator";

export class GetUserDto {
  @IsEmail()
  email?: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;
}

export class GetUserByEmailDto {
  @IsEmail()
  email!: string;
}