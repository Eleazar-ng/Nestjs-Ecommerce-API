import { JsonObject } from "@prisma/client/runtime/client";
import { ProductStatus } from "../../../generated/prisma/enums";

export interface CreateProduct {
  name: string;
  slug: string;
  description?: string;
  shortDesc?: string;
  sku: string;
  barcode?: string;
  categoryId: string;
  status?: ProductStatus;
  isFeatured?: boolean;
  isDigital?: boolean;
  weight?: number;
  tags?: string[];
  metaTitle?: string;
  metaDesc?: string;
  variants?: {
    create: CreateProductVariant[];
  };
  images?: {
    create: CreateProductImage[];
  }
  inventory?: {
    create: {
      totalStock: number
    }
  }
}

interface CreateProductVariant {
  name: string;
  sku: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  stockQty?: number;
  lowStockThreshold?: number;
  attributes: JsonObject
}

interface CreateProductImage {
  url: string;
  altText?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface FindProduct {
  name?: string;
  slug?: string;
  id?: string;
}

export interface GetProductsFilter {
  name?: string | any;
  sku?: string | any;
  categoryId?: string | any;
  status?: string | any;
  isFeatured?: string | any;
  isDigital?: string | any;
  tags?: string | any;
}