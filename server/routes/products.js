import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  searchProducts,
  suggestProducts,
  getRecommendations,
} from '../controllers/products.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Search & Discovery Endpoints
router.get('/search', searchProducts);
router.get('/suggest', suggestProducts);
router.get('/recommendations', getRecommendations);

// Catalog CRUD Endpoints
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected Write Endpoints (Admin or Seller only)
router.post('/', requireAuth, requireRole(['admin', 'seller']), createProduct);
router.put('/:id', requireAuth, requireRole(['admin', 'seller']), updateProduct);
router.delete('/:id', requireAuth, requireRole(['admin', 'seller']), deleteProduct);

export default router;
