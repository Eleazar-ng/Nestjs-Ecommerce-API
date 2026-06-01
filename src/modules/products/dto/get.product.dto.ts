import { IsNotEmpty, IsString } from "class-validator";

export class GetProductDto {
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