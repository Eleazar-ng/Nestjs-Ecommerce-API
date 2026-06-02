import { IsOptional, IsString } from "class-validator";

export class GetInventoryRelationsDto {
  @IsString()
  @IsOptional()
  includeRelations?: string;
}