import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ProductId = number;

interface FavoritesState {
  ids: ProductId[];
}

const initialState: FavoritesState = {
  ids: [],
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<ProductId>) => {
      const productId = action.payload;

      if (!state.ids.includes(productId)) {
        state.ids.push(productId);
      }
    },
    hydrateFavorites: (state, action: PayloadAction<ProductId[]>) => {
      state.ids = action.payload;
    },
    removeFromFavorites: (state, action: PayloadAction<ProductId>) => {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
  },
});

export const { addToFavorites, hydrateFavorites, removeFromFavorites } =
  favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;