import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InventoryRepository } from "./inventory.repository";
import { GetInventoryRelationsDto } from "./dto/get.inventory.relations.dto";
import { Inventory } from "../../generated/prisma/client";
import { inventoryRelations } from "./inventory.provider";
import { GetInventoryDto } from "./dto/get.inventory.dto";
import { GetInventoryFilter } from "./interface/inventory.interface";


@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);
    
  constructor(
    private inventoryRepository: InventoryRepository,
  ) {}

  async findOneByProductId(productId: string, relations: GetInventoryRelationsDto): Promise<Inventory|null> {
    let relationsArr: any;

    if(relations.includeRelations)  relationsArr = relations.includeRelations.split(",")

    let includes:object = {};

    if(Array.isArray(relationsArr) && relationsArr.length > 0){
      relationsArr.forEach(relation => {
        if(inventoryRelations.includes(relation)) includes[relation] = true
      })
    }

    const inventory = await this.inventoryRepository.findOne({productId}, includes);

    if (!inventory) throw new NotFoundException('Inventory record not found');
    return inventory;
  }

  async findAll(filters: GetInventoryDto){

    const { totalStock, reservedStock, soldCount, page, limit, includeRelations} = filters

    const inventoryFilter: GetInventoryFilter = {};

    if(totalStock) inventoryFilter.totalStock = { equals: Number(totalStock)};

    if(reservedStock) inventoryFilter.reservedStock = { equals: Number(reservedStock)};

    if(soldCount) inventoryFilter.soldCount = { equals: Number(soldCount)};

    let relationsArr: any;

    if(includeRelations)  relationsArr = includeRelations.split(",")

    let includes:object = {};

    if(Array.isArray(relationsArr) && relationsArr.length > 0){
      relationsArr.forEach(relation => {
        if(inventoryRelations.includes(relation)) includes[relation] = true
      })
    }

    return await this.inventoryRepository.findAll(inventoryFilter, {page, limit}, includes)
  }
}