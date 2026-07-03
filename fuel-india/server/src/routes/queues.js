import { Router } from 'express';
import {
  submitReport,
  getStationReports,
  predictQueue
} from '../controllers/queueController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Protected — must be logged in to report
router.post('/report', protect, submitReport);

// Public — anyone can view queue info
router.get('/station/:stationId', getStationReports);
router.get('/station/:stationId/predict', predictQueue);

export default router;
