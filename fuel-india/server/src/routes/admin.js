import { Router } from 'express';
import {
  getDashboard,
  getUsers,
  updateUserRole,
  getPeakHours,
  getCityHeatmap,
  getFuelDemand
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/analytics/peak-hours', getPeakHours);
router.get('/analytics/city-heatmap', getCityHeatmap);
router.get('/analytics/demand', getFuelDemand);

export default router;
