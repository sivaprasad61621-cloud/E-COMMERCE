# Phase 1: Chatbot Foundation Specification

This document details the environment configuration, package setup, core services initialization, and initial API scaffolding for the **Velora AI Chatbot Foundation (Phase 1)**.

---

## 1. Goal
Configure the package environment, set up connections to the Vector Database (Pinecone), configure the LLM provider interface, instantiate the embedding model, and scaffold the Express.js chatbot API routes.

---

## 2. Infrastructure & Dependency Setup

### Backend (Server) Setup
Install required vector storage, AI orchestration, and file parsing packages inside the `server/` directory:
```bash
cd server
npm install @pinecone-database/pinecone langchain @langchain/openai @langchain/community pdf-parse
```

### Environment Configuration (`server/.env`)
Append the following environment variables to manage remote AI services:
```env
# Vector Database
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here
PINECONE_INDEX=velora-chatbot-index

# LLM Gateway (OpenAI or compatible API)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1 # Or custom LLM provider gateway

# Local Development Settings
EMBEDDING_PROVIDER=huggingface # Options: huggingface | openai
```

---

## 3. Core Services Initialization

Create a service layer for embedding and vector operations under [server/services/aiService.js](file:///d:/VELORA/server/services/aiService.js):

### A. Embedding Engine
Initialize the embedding service to run locally via Hugging Face model pipelines or fallback to OpenAI depending on target configuration:
```javascript
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf_inference";
import { OpenAIEmbeddings } from "@langchain/openai";

export function getEmbeddingsClient() {
  if (process.env.EMBEDDING_PROVIDER === 'huggingface') {
    return new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HF_API_KEY, // Optional Hugging Face inference API
      model: "sentence-transformers/all-MiniLM-L6-v2",
    });
  }
  return new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
}
```

### B. Pinecone Client & Index Connection
Initialize connection client:
```javascript
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export const getVectorIndex = () => {
  return pinecone.index(process.env.PINECONE_INDEX || 'velora-chatbot-index');
};
```

---

## 4. Express.js Route Scaffolding

Scaffold initial routes in [server/routes/chat.js](file:///d:/VELORA/server/routes/chat.js) and mount inside the main server application.

### Route definition:
```javascript
import express from 'express';
const router = express.Router();

// Health/status check for Chat service
router.get('/status', async (req, res) => {
  try {
    const index = getVectorIndex();
    const stats = await index.describeIndexStats();
    res.json({
      status: 'healthy',
      service: 'Velora AI Engine',
      vectorCount: stats.totalRecordCount
    });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// Scaffold message endpoint
router.post('/message', (req, res) => {
  res.json({ status: 'mocked', message: 'Chat endpoint scaffolded' });
});

export default router;
```

Mount the router in [server/index.js](file:///d:/VELORA/server/index.js):
```javascript
import chatRoutes from './routes/chat.js';
app.use('/api/chat', chatRoutes);
```

---

## 5. Verification Plan

### Verification Steps
1. **Dependency Validation**: Run `npm run dev` to verify package compatibility and ensure no ES Modules import issues occur with `@langchain` and `@pinecone-database/pinecone`.
2. **Ping Service Status**: Send a `GET` request to `http://localhost:5000/api/chat/status`. Ensure it successfully describes the index status or returns a detailed connection timeout/error instead of a `404 Not Found`.
