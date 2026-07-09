import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ProductId = number;

interface CartState {
  items: Record<ProductId, number>;
}

const initialState: CartState = {
  items: {},
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ProductId>) => {
      const productId = action.payload;

      state.items[productId] = (state.items[productId] ?? 0) + 1;
    },
    decreaseCartItem: (state, action: PayloadAction<ProductId>) => {
      const productId = action.payload;
      const quantity = state.items[productId];

      if (quantity === undefined) {
        return;
      }

      if (quantity <= 1) {
        delete state.items[productId];
        return;
      }

      state.items[productId] = quantity - 1;
    },
    removeFromCart: (state, action: PayloadAction<ProductId>) => {
      delete state.items[action.payload];
    },
  },
});

export const { addToCart, decreaseCartItem, removeFromCart } =
  cartSlice.actions;
export const cartReducer = cartSlice.reducer;