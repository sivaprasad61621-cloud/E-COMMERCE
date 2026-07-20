import express from 'express';
import { 
  getOrders, 
  getOrderById, 
  updateOrderStatus,
  createOrder,
  checkoutPayment,
} from '../controllers/orders.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/checkout-payment', checkoutPayment);
router.post('/', createOrder);
router.put('/:id/status', requireAuth, requireRole(['admin', 'seller']), updateOrderStatus);

export default router;
