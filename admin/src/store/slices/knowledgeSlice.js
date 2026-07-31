import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/knowledge`;

// Fetch all ingested documents
export const fetchDocuments = createAsyncThunk(
  'knowledge/fetchDocuments',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/documents`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to fetch documents');
      return data;
    } catch (err) {
      return rejectWithValue('Network error fetching documents');
    }
  }
);

// Upload a document URL to be processed
export const uploadDocument = createAsyncThunk(
  'knowledge/uploadDocument',
  async (docData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(docData),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to trigger upload');
      return { id: data.documentId, ...docData, status: 'processing' };
    } catch (err) {
      return rejectWithValue('Network error submitting document');
    }
  }
);

// Delete an indexed document and its Pinecone vectors
export const deleteDocument = createAsyncThunk(
  'knowledge/deleteDocument',
  async ({ id, namespace }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      const params = namespace ? `?namespace=${namespace}` : '';
      const response = await fetch(`${API_URL}/documents/${id}${params}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || 'Failed to delete document');
      return id;
    } catch (err) {
      return rejectWithValue('Network error deleting document');
    }
  }
);

const initialState = {
  documentsList: [],
  loading: false,
  uploading: false,
  error: null,
};

const knowledgeSlice = createSlice({
  name: 'knowledge',
  initialState,
  reducers: {
    clearKnowledgeError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch documents
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documentsList = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Upload document
      .addCase(uploadDocument.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.uploading = false;
        state.documentsList.unshift(action.payload);
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })

      // Delete document
      .addCase(deleteDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documentsList = state.documentsList.filter(d => d.id !== action.payload);
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearKnowledgeError } = knowledgeSlice.actions;
export default knowledgeSlice.reducer;
