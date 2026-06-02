import { IsOptional, IsString } from "class-validator";
import { FiltersDto } from "../../auth/dto/filters.dto";


export class GetInventoryDto extends FiltersDto {
  @IsString()
  @IsOptional()
  totalStock?: string;

  @IsString()
  @IsOptional()
  reservedStock?: string;

  @IsString()
  @IsOptional()
  soldCount?: string;

  @IsString()
  @IsOptional()
  includeRelations?: string;
}