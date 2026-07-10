import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'velora_customer_profile';

const loadProfile = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const defaultAddress = {
  first_name: '',
  last_name: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'India',
};

const savedProfile = loadProfile();

const initialState = {
  address: savedProfile?.address || defaultAddress,
  hasAddress: !!(savedProfile?.address?.first_name && savedProfile?.address?.city),
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    saveProfile: (state, action) => {
      state.address = { ...state.address, ...action.payload };
      state.hasAddress = !!(state.address.first_name && state.address.city);
      // Persist to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ address: state.address }));
    },
    clearProfile: (state) => {
      state.address = defaultAddress;
      state.hasAddress = false;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const { saveProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
