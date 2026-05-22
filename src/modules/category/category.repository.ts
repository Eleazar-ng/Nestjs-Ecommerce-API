import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Category } from "../../generated/prisma/client";
import { CreateCategory, FindCategory, GetCategoriesFilter } from "./interface/category.interface";
import { Page } from "../auth/interface/page.interface";
import { PAGE, PAGE_LIMIT } from "../../utils/constants";



@Injectable()
export class CategoryRepository {
  constructor(
    private prisma: PrismaService
  ){}

  async create(payload: CreateCategory ): Promise<Category> {
    return await this.prisma.category.create({ 
      data: payload 
    });
  }

  async findOne(param: FindCategory): Promise<Category | null> {
    return await this.prisma.category.findFirst({
      where: param
    })
  }

  async findAll(filters: GetCategoriesFilter, pagination: Page){
    const limit = pagination.limit ? Number(pagination.limit) : PAGE_LIMIT;
    const page = pagination.page ? Number(pagination.page) : PAGE;
    const skip = (page - 1) * limit

    const [categories, count] = await Promise.all([
      await this.prisma.category.findMany({
        where:filters, skip, take:limit
      }),
      await this.prisma.category.count({
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

    return { categories, meta} 
  }
}