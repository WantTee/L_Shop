import type { Product } from "./product.ts";

export interface BasketProduct {
  count: number;
  product: Product;
}

export interface Basket {
  id: string | number;
  userId: string | number;
  basket: BasketProduct[];
}
