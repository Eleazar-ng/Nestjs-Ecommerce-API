import { Controller, Get, Param, Query, UseGuards, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guards';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';
import { GetInventoryDto } from './dto/get.inventory.dto';
import { success } from '../../utils/response.api';
import { GetInventoryRelationsDto } from './dto/get.inventory.relations.dto';

@ApiTags('inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all Inventory"})
  @ApiResponse({
    status:200
  })
  async findAll(
    @Query() query: GetInventoryDto,
  ){
    const data = await this.inventoryService.findAll(query);
    return success('Inventory retrieved successfully', data);
  }

  @Get("/product/:productId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get inventory by product Id"})
  @ApiResponse({
    status: 200
  })
  async findOneByProductId(
    @Param('productId') param: string,
    @Query() query: GetInventoryRelationsDto
  ){
    const data = await this.inventoryService.findOneByProductId(param, query);
    return success('Product retrieved successfully', data);
  }
}
