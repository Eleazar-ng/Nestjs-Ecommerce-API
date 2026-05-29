import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ProductController } from "./products.controller";
import { ProductsService } from "./products.service";
import { ProductsRepository } from "./products.repository";
import { CategoryModule } from "../category/category.module";

@Module({
  imports: [JwtModule, CategoryModule],
  controllers: [ProductController],
  providers: [ProductsService, ProductsRepository,],
})

export class ProductModule {}