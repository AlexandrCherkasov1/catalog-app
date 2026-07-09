import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@app/store";

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectFavoriteIds = (state: RootState) => state.favorites.ids;

export const selectCartTotalCount = createSelector(selectCartItems, (items) =>
  Object.values(items).reduce((total, quantity) => total + quantity, 0),
);

export const selectCartProductIds = createSelector(selectCartItems, (items) =>
  Object.keys(items).map(Number),
);

export const selectFavoritesCount = createSelector(
  selectFavoriteIds,
  (ids) => ids.length,
);

export const selectCartItemQuantity = (productId: number) =>
  createSelector(selectCartItems, (items) => items[productId] ?? 0);

export const selectIsProductInCart = (productId: number) =>
  createSelector(selectCartItems, (items) => Boolean(items[productId]));

export const selectIsProductFavorite = (productId: number) =>
  createSelector(selectFavoriteIds, (ids) => ids.includes(productId));