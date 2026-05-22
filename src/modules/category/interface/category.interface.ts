import { Category } from "../../../generated/prisma/client";

export interface CreateCategory {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
}

export interface FindCategory {
  name?: string;
  slug?: string;
  id?: string;
}

export interface GetCategoriesFilter {
  name?: string | any;
  parentId?: string | any;
  sortOrder?: string | any;
  isActive?: string | any;
}