import { createSlice } from '@reduxjs/toolkit';

const loadWishlistFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('velora_wishlist');
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn('Failed to load wishlist from localStorage:', err);
    return [];
  }
};

const saveWishlistToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('velora_wishlist', serializedState);
  } catch (err) {
    console.warn('Failed to save wishlist to localStorage:', err);
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: loadWishlistFromLocalStorage(),
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const index = state.items.findIndex(item => item.id === product.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(product);
      }
      saveWishlistToLocalStorage(state.items);
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
