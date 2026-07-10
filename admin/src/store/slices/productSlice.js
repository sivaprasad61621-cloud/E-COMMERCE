import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products`;

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { category_id, status, search, page = 1 } = filters;
      const params = new URLSearchParams({ page });
      if (category_id) params.append('category_id', category_id);
      if (status) params.append('status', status);
      if (search) params.append('search', search);

      const response = await fetch(`${API_URL}?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to fetch products');
      return data; // returns { data, pagination: { total, page, pages } }
    } catch (err) {
      return rejectWithValue('Network error');
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to create product');
      return data;
    } catch (err) {
      return rejectWithValue('Network error');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to update product');
      return data;
    } catch (err) {
      return rejectWithValue('Network error');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to delete product');
      return id;
    } catch (err) {
      return rejectWithValue('Network error');
    }
  }
);

const initialState = {
  productsList: [],
  pagination: { total: 0, page: 1, pages: 1 },
  loading: false,
  error: null,
  filters: { category_id: '', status: '', search: '', page: 1 },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetProductFilters: (state) => {
      state.filters = { category_id: '', status: '', search: '', page: 1 };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productsList = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.productsList.unshift(action.payload);
      })
      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.productsList.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) {
          state.productsList[idx] = action.payload;
        }
      })
      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.productsList = state.productsList.filter(p => p.id !== action.payload);
      });
  },
});

export const { setProductFilters, resetProductFilters } = productSlice.actions;
export default productSlice.reducer;
