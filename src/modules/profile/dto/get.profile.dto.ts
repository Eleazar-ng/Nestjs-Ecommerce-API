import { IsString } from "class-validator";


export class GetProfileByUserIdDto {
  @IsString()
  userId!: string;
}

export class GetProfileByIdDto {
  @IsString()
  id!: string;
}