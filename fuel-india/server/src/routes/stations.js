import { Router } from 'express';
import {
  getStations,
  getNearbyStations,
  searchStations,
  getStation,
  createStation,
  updateStation,
  deleteStation
} from '../controllers/stationController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getStations);
router.get('/nearby', getNearbyStations);
router.get('/search', searchStations);
router.get('/:id', getStation);

// Admin routes
router.post('/', protect, adminOnly, createStation);
router.put('/:id', protect, adminOnly, updateStation);
router.delete('/:id', protect, adminOnly, deleteStation);

export default router;
