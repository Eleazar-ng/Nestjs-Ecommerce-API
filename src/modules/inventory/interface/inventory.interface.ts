
export interface FindInventory {
  productId?: string;
  id?: string;
}

export interface GetInventoryFilter {
  totalStock?: string | any;
  reservedStock?: string | any;
  soldCount?: string | any;
}