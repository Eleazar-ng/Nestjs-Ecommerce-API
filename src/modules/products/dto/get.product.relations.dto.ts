import { IsOptional, IsString } from "class-validator";

export class GetProductRelationsDto {
  @IsString()
  @IsOptional()
  includeRelations?: string;
}