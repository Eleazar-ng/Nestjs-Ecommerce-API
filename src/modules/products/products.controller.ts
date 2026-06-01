import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from "@nestjs/common";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../generated/prisma/enums";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth-guards";
import { RolesGuard } from "../auth/guards/roles.guard";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { success } from "../../utils/response.api";
import { GetProductsDto } from "./dto/get.products.dto";
import { GetProductRelationsDto } from "./dto/get.product.relations.dto";


@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all Products"})
  @ApiResponse({
    status:200
  })
  async findAll(@Query() query: GetProductsDto){
    const data = await this.productsService.findAll(query);
    return success('Products retrieved successfully', data);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get product by Id"})
  @ApiResponse({
    status: 200
  })
  async findOne(
    @Param('id') param: string,
    @Query() query: GetProductRelationsDto
  ){
    const data = await this.productsService.findOne({id: param}, query);
    return success('Product retrieved successfully', data);
  }


  // ---------------- ADMIN ----------------------------
  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product [Admin]' })
  async create(@Body() createDto: CreateProductDto) {
    const data = await this.productsService.create(createDto);
    return success("Product created successfully", data);
  }

}

