import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Product } from "../../generated/prisma/client";
import { CreateProduct, FindProduct, GetProductsFilter } from "./interface/products.interface";
import { Page } from "../auth/interface/page.interface";
import { PAGE, PAGE_LIMIT } from "../../utils/constants";


@Injectable()
export class ProductsRepository {
  constructor(
    private prisma: PrismaService
  ){}

  async create(payload: CreateProduct ): Promise<Product> {
    return await this.prisma.product.create({ 
      data: payload 
    });
  }

  async findOne(param: FindProduct, includes: any = {}): Promise<Product | null> {
    return await this.prisma.product.findFirst({
      where: param,
      include: {
        ...includes
      }
    })
  }

  async findAll(filters: GetProductsFilter, pagination: Page){
    const limit = pagination.limit ? Number(pagination.limit) : PAGE_LIMIT;
    const page = pagination.page ? Number(pagination.page) : PAGE;
    const skip = (page - 1) * limit

    const [products, count] = await Promise.all([
      await this.prisma.product.findMany({
        where:filters, skip, take:limit
      }),
      await this.prisma.product.count({
        where:filters
      })
    ])

    const totalPages = Math.ceil(count / limit);

    const meta = {
      currentPage: page,
      limit,
      totalPages,
      totalCount: count,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }

    return { products, meta} 
  }
}