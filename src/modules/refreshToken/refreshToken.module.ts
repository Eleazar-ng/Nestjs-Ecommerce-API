import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { RefreshTokenService } from "./refreshToken.service";
import { RefreshTokenRepository } from "./refreshToken.repository";

@Module({
  imports: [],
  providers: [RefreshTokenService, RefreshTokenRepository],
  exports: [RefreshTokenService, RefreshTokenRepository],
})

export class RefreshTokenModule {}