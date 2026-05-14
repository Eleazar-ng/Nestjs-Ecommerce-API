import { Injectable, Logger } from "@nestjs/common";
import { CreateRefreshTokenDto } from "./dto/create.refreshToken.dto";
import { RefreshToken } from "../../generated/prisma/client";
import { RefreshTokenRepository } from "./refreshToken.repository";



@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);

  constructor(private refreshTokenRepository: RefreshTokenRepository) {}

  async create(createRefreshToken: CreateRefreshTokenDto): Promise<RefreshToken>{
    return await this.refreshTokenRepository.create(createRefreshToken);
  }
}