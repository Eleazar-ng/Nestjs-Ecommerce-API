import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { CategoryRepository } from "./category.repository";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [JwtModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
})

export class CategoryModule {}