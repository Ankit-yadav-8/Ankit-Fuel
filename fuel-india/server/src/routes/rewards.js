import { Router } from 'express';
import {
  getBalance,
  getHistory,
  redeemPoints
} from '../controllers/rewardController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// All routes are protected
router.get('/balance', protect, getBalance);
router.get('/history', protect, getHistory);
router.post('/redeem', protect, redeemPoints);

export default router;
