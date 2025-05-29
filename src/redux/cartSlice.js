import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const cartAdapter = createEntityAdapter({
  selectId: (item) => item._id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState = cartAdapter.getInitialState({});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.entities[product._id];
      if (existing) {
        cartAdapter.updateOne(state, {
          id: product._id,
          changes: { quantity: existing.quantity + 1 },
        });
      } else {
        cartAdapter.addOne(state, { ...product, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      cartAdapter.removeOne(state, action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      if (quantity > 0) {
        cartAdapter.updateOne(state, { id, changes: { quantity } });
      } else {
        cartAdapter.removeOne(state, id);
      }
    },
    clearCart: (state) => {
      cartAdapter.removeAll(state);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export const {
  selectAll: selectAllCartItems,
  selectById: selectCartItemById,
  selectTotal: selectCartTotalItems,
} = cartAdapter.getSelectors((state) => state.cart);

export default cartSlice.reducer;
