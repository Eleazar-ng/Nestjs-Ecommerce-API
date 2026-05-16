import { IsBoolean, IsBooleanString, IsEmail, IsOptional, IsString } from "class-validator";
import { Role } from "../../../generated/prisma/enums";
import { FiltersDto } from "../../auth/dto/filters.dto";

export class GetUsersDto extends FiltersDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
    @IsOptional()
  firstName?: string

  @IsString()
    @IsOptional()
  lastName?: string

  @IsString()
    @IsOptional()
  role?: Role

  @IsString()
  @IsOptional()
  isEmailVerified?: string
}