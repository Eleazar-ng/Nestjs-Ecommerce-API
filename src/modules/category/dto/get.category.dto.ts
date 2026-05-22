import { IsNotEmpty, IsString } from "class-validator";

export class GetCategoryDto {
  @IsNotEmpty()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  slug?: string;

  @IsNotEmpty()
  @IsString()
  name?: string;
}