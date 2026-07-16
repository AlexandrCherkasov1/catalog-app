import type { ProductDto, ProductsResponseDto } from "../model";
import { getProductPrice } from "./get-product-price";

export const ALL_CATALOG_FILTER_VALUE = "all";
export const PRODUCTS_PER_PAGE = 8;

export type AvailabilityFilter = "all" | "available" | "unavailable";
export type CatalogSortValue =
  "default" | "price-asc" | "price-desc" | "name-asc" | "rating-desc";

export interface CatalogFilters {
  availability: AvailabilityFilter;
  category: string;
  maxPrice: string;
  minPrice: string;
  productType: string;
  search: string;
  sort: CatalogSortValue;
}

export function getProductCategory(product: ProductDto) {
  const [rawCategory = "Другое"] = product.name.trim().split(/\s+/);
  const category = rawCategory.toLowerCase();

  if (category === "ружьё" || category === "ружье") {
    return "Ружье";
  }

  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function getProductType(product: ProductDto) {
  const action = product.characteristics.find(
    (characteristic) => characteristic.name === "action",
  )?.value;

  if (action) {
    return action;
  }

  const name = product.name.toLowerCase();

  if (
    name.includes("semiauto") ||
    name.includes("полуавтомат") ||
    name.includes("п/а")
  ) {
    return "Полуавтоматический";
  }

  return null;
}

export function sortCatalogValues(values: string[]) {
  return [...values].sort((firstValue, secondValue) =>
    firstValue.localeCompare(secondValue, "ru"),
  );
}

export function getCatalogCategories(products: ProductDto[]) {
  return sortCatalogValues(
    Array.from(new Set(products.map((product) => getProductCategory(product)))),
  );
}

export function getCatalogProductTypes(products: ProductDto[]) {
  return sortCatalogValues(
    Array.from(
      new Set(
        products
          .map((product) => getProductType(product))
          .filter((type): type is string => Boolean(type)),
      ),
    ),
  );
}

export function filterAndSortProducts(
  products: ProductDto[],
  filters: CatalogFilters,
) {
  const normalizedSearch = filters.search.trim().toLowerCase();
  const minPriceValue =
    filters.minPrice === "" ? null : Number(filters.minPrice);
  const maxPriceValue =
    filters.maxPrice === "" ? null : Number(filters.maxPrice);

  return products
    .filter((product) => {
      const price = getProductPrice(product);
      const matchesSearch =
        normalizedSearch === "" ||
        product.name.toLowerCase().includes(normalizedSearch);
      const matchesAvailability =
        filters.availability === ALL_CATALOG_FILTER_VALUE ||
        (filters.availability === "available" && product.available) ||
        (filters.availability === "unavailable" && !product.available);
      const matchesMinPrice =
        minPriceValue === null ||
        (Number.isFinite(minPriceValue) && price >= minPriceValue);
      const matchesMaxPrice =
        maxPriceValue === null ||
        (Number.isFinite(maxPriceValue) && price <= maxPriceValue);
      const matchesCategory =
        filters.category === ALL_CATALOG_FILTER_VALUE ||
        getProductCategory(product) === filters.category;
      const matchesType =
        filters.productType === ALL_CATALOG_FILTER_VALUE ||
        getProductType(product) === filters.productType;

      return (
        matchesSearch &&
        matchesAvailability &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesCategory &&
        matchesType
      );
    })
    .sort((firstProduct, secondProduct) => {
      switch (filters.sort) {
        case "price-asc":
          return getProductPrice(firstProduct) - getProductPrice(secondProduct);
        case "price-desc":
          return getProductPrice(secondProduct) - getProductPrice(firstProduct);
        case "name-asc":
          return firstProduct.name.localeCompare(secondProduct.name, "ru");
        case "rating-desc":
          return secondProduct.reviews - firstProduct.reviews;
        default:
          return 0;
      }
    });
}

export function getCatalogPage<T>(
  items: T[],
  page: number,
  perPage = PRODUCTS_PER_PAGE,
) {
  const safePage = Math.max(1, page);
  const startIndex = (safePage - 1) * perPage;

  return items.slice(startIndex, startIndex + perPage);
}

export function normalizeProductsResponse(response: ProductsResponseDto) {
  return {
    ...response,
    items: response.items.map((product) => ({
      ...product,
      preview_picture: product.preview_picture?.replace(
        "https://ohotaktiv.ru",
        "https://img.ohotaktiv.ru",
      ),
    })),
  };
}