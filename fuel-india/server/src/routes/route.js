import { Router } from 'express';
import {
  planRoute,
  saveRoute,
  getSavedRoutes,
  deleteSavedRoute
} from '../controllers/routeController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Route planning — public
router.post('/plan', planRoute);

// Saved routes — protected
router.post('/save', protect, saveRoute);
router.get('/saved', protect, getSavedRoutes);
router.delete('/saved/:routeId', protect, deleteSavedRoute);

export default router;
