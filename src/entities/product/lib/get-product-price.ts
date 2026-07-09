import type { ProductDto } from "../model";

export function getProductPrice(product: ProductDto) {
  return product.price_discount < product.price
    ? product.price_discount
    : product.price;
}