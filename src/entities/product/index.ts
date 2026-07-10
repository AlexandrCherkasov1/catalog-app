export { productsApi, useGetProductsQuery } from "./api";
export {
  ALL_CATALOG_FILTER_VALUE,
  filterAndSortProducts,
  getCatalogCategories,
  getCatalogPage,
  getCatalogProductTypes,
  getProductCategory,
  getProductPrice,
  getProductType,
  PRODUCTS_PER_PAGE,
  sortCatalogValues,
} from "./lib";
export type {
  AvailabilityFilter,
  CatalogFilters,
  CatalogSortValue,
} from "./lib";
export {
  addToCart,
  addToFavorites,
  cartReducer,
  decreaseCartItem,
  favoritesReducer,
  hydrateCart,
  hydrateFavorites,
  removeFromCart,
  removeFromFavorites,
  restoreCartItem,
  selectCartItemQuantity,
  selectCartItems,
  selectCartProductIds,
  selectCartTotalCount,
  selectFavoriteIds,
  selectFavoritesCount,
  selectIsProductFavorite,
  selectIsProductInCart,
} from "./model";
export type {
  ProductCharacteristicDto,
  ProductDto,
  ProductLabelsDto,
  ProductsResponseDto,
  ProductTraitsDto,
} from "./model";
export { ProductActions, ProductCard } from "./ui";