import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ORDERS_API = `${API}/orders`;
const CUSTOMERS_API = `${API}/customers`;

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { status, page = 1 } = filters;
      const params = new URLSearchParams({ page });
      if (status) params.append('status', status);

      const response = await fetch(`${ORDERS_API}?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to fetch orders');
      return data;
    } catch (err) {
      return rejectWithValue('Network error');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ORDERS_API}/${id}`);
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to fetch order details');
      return data;
    } catch (err) {
      return rejectWithValue('Network error');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status, tracking_number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ORDERS_API}/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, tracking_number }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to update order status');
      return data;
    } catch (err) {
      return rejectWithValue('Network error');
    }
  }
);

export const fetchCustomers = createAsyncThunk(
  'orders/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(CUSTOMERS_API);
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to fetch customers');
      return data;
    } catch (err) {
      return rejectWithValue('Network error');
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  'orders/fetchCustomerById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${CUSTOMERS_API}/${id}`);
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to fetch customer profile');
      return data;
    } catch (err) {
      return rejectWithValue('Network error');
    }
  }
);

const initialState = {
  ordersList: [],
  pagination: { total: 0, page: 1, pages: 1 },
  currentOrderDetail: null,
  customersList: [],
  currentCustomerDetail: null,
  loading: false,
  error: null,
  filters: { status: '', page: 1 },
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrderFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetOrderFilters: (state) => {
      state.filters = { status: '', page: 1 };
    },
    clearOrderDetail: (state) => {
      state.currentOrderDetail = null;
    },
    clearCustomerDetail: (state) => {
      state.currentCustomerDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.ordersList = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Order Details
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrderDetail = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.ordersList.findIndex(o => o.id === action.payload.id);
        if (idx !== -1) {
          state.ordersList[idx].status = action.payload.status;
          state.ordersList[idx].tracking_number = action.payload.tracking_number;
        }
        if (state.currentOrderDetail && state.currentOrderDetail.id === action.payload.id) {
          state.currentOrderDetail.status = action.payload.status;
          state.currentOrderDetail.tracking_number = action.payload.tracking_number;
        }
      })
      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customersList = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Customer Details
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCustomerDetail = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setOrderFilters, resetOrderFilters, clearOrderDetail, clearCustomerDetail } = orderSlice.actions;
export default orderSlice.reducer;
