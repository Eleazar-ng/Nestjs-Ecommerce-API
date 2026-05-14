import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { RefreshToken } from "../../generated/prisma/client";
import { CreateRefreshToken } from "./interface/refreshToken.interface";



@Injectable()
export class RefreshTokenRepository {
  constructor(
    private prisma: PrismaService
  ){}

  async create(payload: CreateRefreshToken): Promise<RefreshToken> {
    return await this.prisma.refreshToken.create({ 
      data: payload 
    });
  }
}