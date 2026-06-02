import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { CategoryModule } from "../category/category.module";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";
import { InventoryRepository } from "./inventory.repository";

@Module({
  imports: [JwtModule],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryRepository],
})

export class InventoryModule {}