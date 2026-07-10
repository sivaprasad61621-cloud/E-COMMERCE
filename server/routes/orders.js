import express from 'express';
import { 
  getOrders, 
  getOrderById, 
  updateOrderStatus,
  createOrder
} from '../controllers/orders.js';

const router = express.Router();

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.post('/', createOrder);

export default router;
