import { IsOptional, IsString } from "class-validator";
import { FiltersDto } from "../../auth/dto/filters.dto";


export class GetCategoriesDto extends FiltersDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  isActive?: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsOptional()
  sortOrder?: string;

}