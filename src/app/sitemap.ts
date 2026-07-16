import type { MetadataRoute } from "next";

import { PRODUCTS_PER_PAGE } from "@entities/product";
import { getAbsoluteUrl } from "@shared/config/site";

import { getProducts } from "./lib/get-products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const productPages =
    products?.items.map((product) => ({
      url: getAbsoluteUrl(`/product/${product.id}`),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })) ?? [];
  const catalogPageCount = Math.ceil(
    (products?.items.length ?? 0) / PRODUCTS_PER_PAGE,
  );
  const catalogPages = Array.from(
    { length: Math.max(0, catalogPageCount - 1) },
    (_, index) => ({
      url: getAbsoluteUrl(`/?page=${index + 2}`),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }),
  );

  return [
    {
      url: getAbsoluteUrl(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...catalogPages,
    ...productPages,
  ];
}