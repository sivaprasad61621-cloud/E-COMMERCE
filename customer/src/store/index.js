import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import wishlistReducer from './slices/wishlistSlice';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
    profile: profileReducer,
  },
});

export default store;

