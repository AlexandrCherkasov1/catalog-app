import { configureStore } from "@reduxjs/toolkit";

import { productsApi } from "@entities/product/api";
import { cartReducer, favoritesReducer } from "@entities/product/model";

export const createAppStore = () =>
  configureStore({
    reducer: {
      cart: cartReducer,
      favorites: favoritesReducer,
      [productsApi.reducerPath]: productsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsApi.middleware),
  });

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];