import { ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ProductsRepository } from "./products.repository";
import { Product } from "../../generated/prisma/client";
import { CreateProductDto } from "./dto/create-product.dto";
import { CategoryService } from "../category/category.service";
import slugify from 'slugify';
import { GetProductsDto } from "./dto/get.products.dto";
import { GetProductsFilter } from "./interface/products.interface";
import { GetProductDto } from "./dto/get.product.dto";
import { GetProductRelationsDto } from "./dto/get.product.relations.dto";
import { productsRelations } from "./products.provider";


@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
    
  constructor(
    private productsRepository: ProductsRepository,
    private categoryService: CategoryService
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product>{
    const existingProduct = await this.productsRepository.findOne({name: createProductDto.name.toLowerCase()});
    if(existingProduct) throw new ConflictException(`Product name: ${existingProduct.name} already exists`);

    const category = await this.categoryService.findOne({id: createProductDto.categoryId});

    const slug = slugify(createProductDto.name, { lower: true, strict: true });

    this.logger.log(`******* New Product created: ${createProductDto.name} ******`);

    return await this.productsRepository.create({
      ...createProductDto, 
      name:createProductDto.name.toLowerCase(),
      sku: `SKU-${createProductDto.name.substring(0, 3).toUpperCase()}-${category?.name.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      slug,
      images: createProductDto.images ? { 
        create: createProductDto.images
      } : undefined,
      variants: {
        create: createProductDto.variants.map((variant) => ({
          ...variant,
          sku: `SKU-${variant.name.substring(0, 3).toUpperCase()}-${createProductDto.name.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        }))
      },
      inventory: {
        create: {
          totalStock: createProductDto.variants?.reduce((sum, variant) => sum + (variant.stockQty || 0), 0) ?? 0
        }
      }
    })
  }

  async findAll(filters: GetProductsDto){
    const { name, sku, status, isDigital, isFeatured, tag, categoryId, page, limit} = filters;

    const productFilter: GetProductsFilter = {};

    if(name) productFilter.name = { contains: name, mode: 'insensitive' };

    if(sku) productFilter.sku  = { equals: sku };

    if(status){
      switch(status){
        case "draft":
          productFilter.status = { equals: "DRAFT"}
          break;
          
        case "active":
          productFilter.status = { equals: "ACTIVE"}
          break;

        case "inactive":
          productFilter.status = { equals: "INACTIVE"}
          break;

        case "out of stock":
          productFilter.status = { equals: "OUT_OF_STOCK"}
          break;

        case "discontinued":
          productFilter.status = { equals: "DISCONTINUED"}
          break;
      }
    } 

    if(isFeatured){
      productFilter.isFeatured = isFeatured == "true" ? { equals: true } : { equals: false }
    }

    if(isDigital){
      productFilter.isDigital = isDigital == "true" ? { equals: true } : { equals: false }
    }

    if(categoryId) productFilter.categoryId  = { equals: categoryId };

    if(tag){
      productFilter.tags = { has: tag }
    }

    return await this.productsRepository.findAll(productFilter, {page, limit});
  }

  async findOne(getProductDto: GetProductDto, relations: GetProductRelationsDto): Promise<Product|null>{
    let relationsArr: any;

    if(relations.includeRelations)  relationsArr = relations.includeRelations.split(",")

    let includes:object = {};

    if(Array.isArray(relationsArr) && relationsArr.length > 0){
      relationsArr.forEach(relation => {
        if(productsRelations.includes(relation)) includes[relation] = true
      })
    }
    
    const product = await this.productsRepository.findOne(getProductDto, includes);


    if(!product) throw new NotFoundException("Product not found");
    return product;
  }
}