export { productsApi, useGetProductsQuery } from "./api";
export { getProductPrice } from "./lib";
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
export { ProductCard } from "./ui";