import express from 'express';
import { 
  getSummary, 
  getSalesChart, 
  getLowStock 
} from '../controllers/reports.js';

const router = express.Router();

router.get('/summary', getSummary);
router.get('/sales-chart', getSalesChart);
router.get('/low-stock', getLowStock);

export default router;
