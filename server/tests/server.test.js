import test from 'node:test';
import assert from 'node:assert/strict';
import SearchEngine from '../services/searchService.js';
import RecommendationEngine from '../services/recommendationService.js';
import PaymentService from '../services/paymentService.js';
import { cacheService } from '../services/cacheService.js';

test('1. SearchEngine Tokenization and Scoring', () => {
  const sampleProducts = [
    { id: '1', name: 'Apple MacBook Pro M3', category: 'electronics', price: 1999, description: 'High performance laptop' },
    { id: '2', name: 'Dell XPS 15', category: 'electronics', price: 1499, description: 'Sleek windows laptop' },
    { id: '3', name: 'Sony Noise Cancelling Headphones', category: 'audio', price: 349, description: 'Clear sound' },
  ];

  const searchResults = SearchEngine.search(sampleProducts, { q: 'macbook', category: 'all' });
  assert.equal(searchResults.total, 1);
  assert.equal(searchResults.hits[0].id, '1');
});

test('2. SearchEngine Faceted Filtering', () => {
  const sampleProducts = [
    { id: '1', name: 'Item A', category: 'tech', price: 40 },
    { id: '2', name: 'Item B', category: 'tech', price: 150 },
  ];

  const searchResults = SearchEngine.search(sampleProducts, { minPrice: 100 });
  assert.equal(searchResults.total, 1);
  assert.equal(searchResults.hits[0].id, '2');
});

test('3. RecommendationEngine Content-Based Similarity', () => {
  const sampleProducts = [
    { id: '1', name: 'Laptop A', category: 'computers', price: 1000, rating: 4.8 },
    { id: '2', name: 'Laptop B', category: 'computers', price: 1050, rating: 4.5 },
    { id: '3', name: 'Coffee Mug', category: 'kitchen', price: 15, rating: 4.0 },
  ];

  const recs = RecommendationEngine.getRecommendations({ productId: '1', products: sampleProducts });
  assert.equal(recs.length, 2);
  assert.equal(recs[0].id, '2');
});

test('4. PaymentService Test Mode Success & Failure', async () => {
  const successRes = await PaymentService.processPayment({
    amount: 199.99,
    cardNumber: '4242424242424242',
  });
  assert.equal(successRes.success, true);
  assert.equal(successRes.status, 'succeeded');
  assert.ok(successRes.transactionId.startsWith('txn_'));

  const declinedRes = await PaymentService.processPayment({
    amount: 50.00,
    cardNumber: '4242424242420000',
  });
  assert.equal(declinedRes.success, false);
  assert.equal(declinedRes.status, 'declined');
});

test('5. CacheService In-Memory Operations', async () => {
  await cacheService.set('test_key', { foo: 'bar' }, 60);
  const val = await cacheService.get('test_key');
  assert.deepEqual(val, { foo: 'bar' });
  await cacheService.del('test_key');
  const deletedVal = await cacheService.get('test_key');
  assert.equal(deletedVal, null);
});

test('6. Chatbot Text Chunking Utility', async () => {
  const { chunkText } = await import('../services/aiService.js');
  const sampleText = "Velora E-Commerce RAG assistant. First sentence of context. Second sentence of context. Third sentence of context.";
  const chunks = chunkText(sampleText, 50, 10);
  assert.ok(chunks.length > 0);
  assert.ok(chunks[0].length <= 50);
});

test('7. Chatbot Embeddings Factory Client', async () => {
  const { getEmbeddingsClient } = await import('../services/aiService.js');
  const client = getEmbeddingsClient();
  assert.ok(client !== null);
});
