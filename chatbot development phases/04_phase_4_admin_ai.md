# Phase 4: Admin AI Management & Conversation Logs

This document details the admin dashboard additions, data tables, analytical graphs, and Redux states for **Phase 4: Admin AI Portal**.

---

## 1. Goal
Provide administrators with an intuitive interface inside the Admin SPA (http://localhost:5174) to manage the vector knowledge base, monitor customer-agent conversations in real-time, view context citation success rates, and analyze AI performance metrics.

---

## 2. Redux State Management

Create a new Redux slice [admin/src/store/slices/knowledgeSlice.js](file:///d:/VELORA/admin/src/store/slices/knowledgeSlice.js) to manage the file upload states:

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const uploadDocument = createAsyncThunk(
  'knowledge/uploadDocument',
  async ({ file, namespace }, { rejectWithValue }) => {
    // API request to /api/admin/knowledge/upload
  }
);

const knowledgeSlice = createSlice({
  name: 'knowledge',
  initialState: {
    documents: [],
    loading: false,
    uploading: false,
    error: null,
  },
  reducers: {
    setDocuments: (state, action) => {
      state.documents = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Handling uploadDocument pending, fulfilled, rejected
  }
});
```

---

## 3. UI Views & Pages (Admin Dashboard)

Add two primary administration sections under the dashboard layout:

### A. Knowledge Base Manager (`/admin/knowledge`)
*   **Drag-and-Drop Ingestion Area**: A dotted outline container utilizing the vintage style (`border-dashed border-half border-[#2F2F2F]`).
*   **Document List Table**: A typographic data list displaying:
    *   *Document Title* (with file type icon).
    *   *Namespace* badge (e.g., `policies`, `faqs`).
    *   *Status* badge with corresponding status colors:
        *   `indexed`: Green text, simple vintage checkmark.
        *   `processing`/`pending`: Muted gray, light spinner.
        *   `failed`: Red text with hover tooltip displaying the error trace.
    *   *Word Count*.
    *   *Actions*: "Delete" button which triggers remote removal from PostgreSQL and Pinecone indexes.

### B. Conversation Analytics (`/admin/conversations`)
*   **Chat Logs Table**: Lists recent sessions (`chat_sessions`) including customer details, message count, and created timestamp. Clicking a row opens a details view drawer displaying the transcription side-by-side with citations/references.
*   **Metrics Summary Cards**:
    *   *Total Chats Routed*.
    *   *RAG Accuracy / Hit Rate* (percentage of questions answered using retrieved context).
    *   *Average Session Messages*.
    *   *Escalation Rate* (percentage of chats requesting a human).

---

## 4. API Endpoint Integration

Configure the server to serve administration dashboards:

### `GET /api/admin/knowledge/documents`
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "65b93d0c-...",
      "title": "Return Policy 2026",
      "file_type": "pdf",
      "status": "indexed",
      "vector_namespace": "policies",
      "word_count": 1250,
      "created_at": "2026-07-20T12:00:00Z"
    }
  ]
  ```

### `GET /api/admin/chat/analytics`
- **Response (200 OK)**:
  ```json
  {
    "totalSessions": 342,
    "hitRate": 92.4,
    "averageMessages": 4.6,
    "escalations": 12
  }
  ```

---

## 5. Verification Plan

### Manual Verification
1.  Log in as Administrator at http://localhost:5174/login.
2.  Navigate to `/admin/knowledge` using the sidebar navigation.
3.  Upload a document and verify the row is added in a `pending` state and updates to `indexed` dynamically.
4.  Navigate to `/admin/conversations` and confirm the history logs match the chat widget interactions initiated during customer tests in Phase 3.
