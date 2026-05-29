import { IsOptional, IsString } from "class-validator";
import { FiltersDto } from "../../auth/dto/filters.dto";

export class GetProductsDto extends FiltersDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  isFeatured?: string;

  @IsString()
  @IsOptional()
  isDigital?: string;

  @IsString()
  @IsOptional()
  tag?: string;
}