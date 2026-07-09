export {
  addToCart,
  cartReducer,
  decreaseCartItem,
  removeFromCart,
} from "./cart-slice";
export {
  addToFavorites,
  favoritesReducer,
  removeFromFavorites,
} from "./favorites-slice";
export {
  selectCartItemQuantity,
  selectCartItems,
  selectCartProductIds,
  selectCartTotalCount,
  selectFavoriteIds,
  selectFavoritesCount,
  selectIsProductFavorite,
  selectIsProductInCart,
} from "./selectors";
export type {
  ProductCharacteristicDto,
  ProductDto,
  ProductLabelsDto,
  ProductsResponseDto,
  ProductTraitsDto,
} from "./types";