import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { FindInventory, GetInventoryFilter } from "./interface/inventory.interface";
import { Page } from "../auth/interface/page.interface";
import { PAGE, PAGE_LIMIT } from "../../utils/constants";
import { Inventory } from "../../generated/prisma/client";


@Injectable()
export class InventoryRepository {
  constructor(
    private prisma: PrismaService
  ){}

  async findOne(param: FindInventory, includes: any = {}): Promise<Inventory | null> {
    return await this.prisma.inventory.findFirst({
      where: param,
      include: {
        ...includes
      }
    })
  }

  async findAll(filters: GetInventoryFilter, pagination: Page, includes: any = {}){
    const limit = pagination.limit ? Number(pagination.limit) : PAGE_LIMIT;
    const page = pagination.page ? Number(pagination.page) : PAGE;
    const skip = (page - 1) * limit

    const [inventory, count] = await Promise.all([
      await this.prisma.inventory.findMany({
        where:filters, skip, take:limit, 
        include: {
          ...includes
        }
      }),
      await this.prisma.inventory.count({
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

    return { inventory, meta} 
  }
}