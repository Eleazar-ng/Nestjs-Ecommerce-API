import { ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CategoryRepository } from "./category.repository";
import { CreateCategoryDto } from "./dto/create.category.dto";
import { Category } from "../../generated/prisma/client";
import { GetCategoryDto } from "./dto/get.category.dto";
import slugify from 'slugify';
import { GetCategoriesDto } from "./dto/get.categories.dto";
import { GetCategoriesFilter } from "./interface/category.interface";

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  
  constructor(private categoryRepository: CategoryRepository) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category>{
    const existingCategory = await this.categoryRepository.findOne({name: createCategoryDto.name.toLowerCase()});
    if(existingCategory) throw new ConflictException(`Category name: ${existingCategory.name} already exist`);

    const slug = slugify(createCategoryDto.name, { lower: true, strict: true });

    if(createCategoryDto.parentId){
      const parent = await this.categoryRepository.findOne({ id: createCategoryDto.parentId});
      if(!parent) throw new NotFoundException("Parent category not found");
    }

    this.logger.log(`******* New Category created: ${createCategoryDto.name} ******`);
    return await this.categoryRepository.create({
      ...createCategoryDto, 
      name:createCategoryDto.name.toLowerCase(),
      slug
    });
  }

  async findOne(getCategoryDto: GetCategoryDto): Promise<Category|null>{
    const category = await this.categoryRepository.findOne(getCategoryDto);
    if(!category) throw new NotFoundException("Category not found");
    return category;
  }

  async findAll(filters: GetCategoriesDto){
    const { name, parentId, sortOrder, isActive, page, limit} = filters;

    const categoryFilter: GetCategoriesFilter = {};

    if(name) categoryFilter.name = { contains: name, mode: 'insensitive' };

    if(parentId) categoryFilter.parentId  = { equals: parentId };

    if(sortOrder) categoryFilter.sortOrder =  { equals: sortOrder };

    if(isActive == 'true') categoryFilter.isActive = { equals: true }
    if(isActive == 'false') categoryFilter.isActive = { equals: false }

    return await this.categoryRepository.findAll(categoryFilter, {page, limit});
  }
}