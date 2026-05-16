import { IsEmail, IsString } from "class-validator";

export class GetUserByEmailDto {
  @IsEmail()
  email!: string;
}

export class GetUserByIdDto {
  @IsString()
  id!: string;
}