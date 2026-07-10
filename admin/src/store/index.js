import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    categories: categoryReducer,
    products: productReducer,
    orders: orderReducer,
    settings: settingsReducer,
  },
});

export default store;
