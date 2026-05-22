import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth-guards";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CategoryService } from "./category.service";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../generated/prisma/enums";
import { CreateCategoryDto } from "./dto/create.category.dto";
import { success } from "../../utils/response.api";
import { GetCategoriesDto } from "./dto/get.categories.dto";



@ApiTags('categories')
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all Categories"})
  @ApiResponse({
    status:200
  })
  async findAll(@Query() query: GetCategoriesDto){
    const data = await this.categoryService.findAll(query);
    return success('Categories retrieved successfully', data);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get category be ID or slug"})
  @ApiResponse({
    status: 200
  })
  async findOne(@Param('id') param: string){
    const data = await this.categoryService.findOne({id: param});
    return success('Category retrieved successfully', data);
  }

    

  // ---------------- ADMIN ----------------------------
  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a category',
  })
  @ApiResponse({
    status: 201, 
  })
  async create(@Body() createDto: CreateCategoryDto){
    const data = await this.categoryService.create(createDto);
    return success("Category created successfully", data);
  }
}