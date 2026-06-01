import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HealthIndicatorService, HealthIndicatorResult} from '@nestjs/terminus';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaHealthIndicator {
  constructor(
    private prisma: PrismaService,
    private readonly healthIndicatorService: HealthIndicatorService
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return indicator.up({ message: "Service is operational"});
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Database check failed',
        indicator.down({error: error.message})
      );
    }
  }
}
