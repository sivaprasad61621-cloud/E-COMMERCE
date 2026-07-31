# Phase 5: Production, Security & Deployment

This document details the production configurations, security policies, rate-limiting logic, and monitoring steps for **Phase 5: Chatbot Production & Deployment**.

---

## 1. Goal
Ensure safe, authenticated, and performant operations of the AI RAG engine in production. Deploy the updated backend and frontend apps to Vercel, configure API rate limiting to control LLM request costs, and set up robust fallback behaviors when external APIs fail.

---

## 2. Production Environment Checklist

Before pushing changes to GitHub to trigger the Vercel CI/CD pipeline, confirm the presence of these environment keys in the Vercel Project Dashboard:

### Server Project Secrets
*   `PINECONE_API_KEY`: Production Pinecone read/write key.
*   `OPENAI_API_KEY`: API token with quota limits.
*   `HF_API_KEY`: Hugging Face Inference client key (if using remote inference).
*   `SUPABASE_SERVICE_ROLE_KEY`: Service role bypass keys (for admin document deletion routines).

### Frontend Client Variables
*   `VITE_API_URL`: Set to production server API origin (e.g., `https://api.velora-commerce.com`).
*   `VITE_SUPABASE_URL`: Live Supabase project URL.
*   `VITE_SUPABASE_ANON_KEY`: Client authorization token.

---

## 3. Security & Rate Limiting Configurations

### A. CORS Configuration (`server/index.js`)
Lock down endpoints to ensure only verified frontend clients can post queries to the LLM agent:
```javascript
import cors from 'cors';

const allowedOrigins = [
  'https://velora-customer.vercel.app',
  'https://velora-admin.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin blocked by CORS policy'));
    }
  }
}));
```

### B. Chat Route Rate Limiting (`server/routes/chat.js`)
Configure `express-rate-limit` to restrict API abuse and manage service expenses:
```javascript
import rateLimit from 'express-rate-limit';

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 30, // Limit each IP address to 30 chat messages per window
  message: {
    status: 'error',
    message: 'Too many requests sent to the assistant. Please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/message', chatLimiter, handleChatMessage);
```

---

## 4. Fallback and Error Boundaries

If Pinecone, the LLM, or Hugging Face services experience an outage, the backend must fail gracefully:

1.  **Pinecone Retrieval Failure**:
    *   Log error inside logging interface.
    *   Fallback to generic Postgres text-matching queries on categories/products or output responses explaining: *"Our digital catalogs are undergoing scheduled maintenance. How else can I assist you?"*
2.  **LLM Token Outage**:
    *   If API requests return status code `429` (Quota exceeded), catch the exception.
    *   Return a message asking the customer to connect to support: *"My apologies, I am temporarily offline. Please reach our support line directly at support@velora.com."*

---

## 5. Verification Plan

### Verification Steps
1.  **Deployment Verification**: Push modifications to GitHub `main` branch. Confirm that the GitHub action executes the automated test suites successfully.
2.  **Vercel Build Checks**: Inspect building logs inside Vercel Dashboard for any build errors.
3.  **Live Endpoint Validation**: Connect to the production chatbot API gateway and verify responses.
4.  **CORS Validation**: Try querying the production `/api/chat/message` endpoint from an unauthorized origin using shell curl requests and confirm it is blocked.
