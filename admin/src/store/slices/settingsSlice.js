import { createSlice } from '@reduxjs/toolkit';

const getLocalStorage = (key, fallback) => {
  const value = localStorage.getItem(key);
  if (value === null) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const initialState = {
  storeName: getLocalStorage('settings_storeName', 'Velora'),
  currency: getLocalStorage('settings_currency', '₹'),
  lowStockThreshold: parseInt(getLocalStorage('settings_lowStockThreshold', 10)),
  theme: getLocalStorage('settings_theme', 'vintage'),
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      const { storeName, currency, lowStockThreshold, theme } = action.payload;
      
      if (storeName !== undefined) {
        state.storeName = storeName;
        localStorage.setItem('settings_storeName', JSON.stringify(storeName));
      }
      if (currency !== undefined) {
        state.currency = currency;
        localStorage.setItem('settings_currency', JSON.stringify(currency));
      }
      if (lowStockThreshold !== undefined) {
        state.lowStockThreshold = parseInt(lowStockThreshold);
        localStorage.setItem('settings_lowStockThreshold', JSON.stringify(parseInt(lowStockThreshold)));
      }
      if (theme !== undefined) {
        state.theme = theme;
        localStorage.setItem('settings_theme', JSON.stringify(theme));
      }
    },
  },
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
