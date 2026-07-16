import "server-only";

import {
  normalizeProductsResponse,
  type ProductsResponseDto,
} from "@entities/product";

const PRODUCTS_API_URL =
  "https://maxifoxy-testfront-96b4.twc1.net/api/products";

export async function getProducts(): Promise<ProductsResponseDto | null> {
  try {
    const response = await fetch(PRODUCTS_API_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as ProductsResponseDto;

    return normalizeProductsResponse(data);
  } catch {
    return null;
  }
}