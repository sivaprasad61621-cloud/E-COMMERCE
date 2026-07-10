import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/categories`;

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to fetch categories');
      return data;
    } catch (err) {
      // Offline mock fallback if fetch fails
      return rejectWithValue('Network error');
    }
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to create category');
      return data;
    } catch (err) {
      return rejectWithValue('Network error');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to update category');
      return data;
    } catch (err) {
      return rejectWithValue('Network error');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to delete category');
      return id;
    } catch (err) {
      return rejectWithValue('Network error');
    }
  }
);

const initialState = {
  categoriesList: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categoriesList = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categoriesList.push(action.payload);
      })
      // Update
      .addCase(updateCategory.fulfilled, (state, action) => {
        const idx = state.categoriesList.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) {
          state.categoriesList[idx] = action.payload;
        }
      })
      // Delete
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categoriesList = state.categoriesList.filter(c => c.id !== action.payload);
      });
  },
});

export default categorySlice.reducer;
