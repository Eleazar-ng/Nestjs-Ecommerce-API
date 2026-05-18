import { IsString, IsNotEmpty } from "class-validator";

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  userId!: string;
}