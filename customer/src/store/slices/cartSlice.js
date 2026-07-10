import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array of { id, name, price, discount, sku, image, quantity }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, discount, sku, images } = action.payload;
      const existing = state.items.find(item => item.id === id);
      
      const img = images && images.length > 0 ? images[0] : '';
      
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          id,
          name,
          price: parseFloat(price),
          discount: parseFloat(discount || 0),
          sku,
          image: img,
          quantity: 1
        });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = Math.max(1, parseInt(quantity));
      }
    },
    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
