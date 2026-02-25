import path from "path";
import { readJSON, writeJSON } from "../../utils/file";
import { Basket, BasketProduct } from "../../types/bascket";
import { Product } from "../../types/product";

const BASKET_PATH = path.join(__dirname, "../../../database/basket.json");
const PRODUCTS_PATH = path.join(__dirname, "../../../database/products.json");

export class BasketService {
  static async getUserBasket(userId: string | number): Promise<Basket> {
    const baskets = await readJSON<Basket[]>(BASKET_PATH);

    let basket = baskets.find(b => b.userId == userId);

    if (!basket) {
      basket = { id: Date.now(), userId, basket: [] };
      baskets.push(basket);
      await writeJSON(BASKET_PATH, baskets);
    }

    return basket;
  }

  static async addProduct(userId: string | number, productId: string | number, count: number) {
    const baskets = await readJSON<Basket[]>(BASKET_PATH);
    const products = await readJSON<Product[]>(PRODUCTS_PATH);

    const basket = baskets.find(b => b.userId == userId);
    if (!basket) throw new Error("Basket not found");

    const product = products.find(p => p.id == productId);
    if (!product) throw new Error("Product not found");

    const existing = basket.basket.find(item => item.product.id == productId);

    if (existing) {
      existing.count += count;
    } else {
      basket.basket.push({
        count,
        product
      });
    }

    await writeJSON(BASKET_PATH, baskets);
    return basket;
  }

  static async updateCount(userId: string | number, productId: string | number, count: number) {
    const baskets = await readJSON<Basket[]>(BASKET_PATH);

    const basket = baskets.find(b => b.userId == userId);
    if (!basket) throw new Error("Basket not found");

    const item = basket.basket.find(i => i.product.id == productId);
    if (!item) throw new Error("Product not in basket");

    item.count = count;

    await writeJSON(BASKET_PATH, baskets);
    return basket;
  }

  static async removeProduct(userId: string | number, productId: string | number) {
    const baskets = await readJSON<Basket[]>(BASKET_PATH);

    const basket = baskets.find(b => b.userId == userId);
    if (!basket) throw new Error("Basket not found");

    basket.basket = basket.basket.filter(i => i.product.id != productId);

    await writeJSON(BASKET_PATH, baskets);
    return basket;
  }
}
