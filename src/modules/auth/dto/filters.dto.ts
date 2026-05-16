import { IsNumber, IsOptional, IsString } from "class-validator";

export class FiltersDto {
  @IsString()
  @IsOptional()
  page!: string;

  @IsString()
  @IsOptional()
  limit!: string;
}