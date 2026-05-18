import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  dob?: string;
}