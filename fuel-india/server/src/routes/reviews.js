import { Router } from 'express';
import {
  createReview,
  getStationReviews,
  deleteReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Protected — must be logged in to review
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

// Public — anyone can view reviews
router.get('/station/:stationId', getStationReviews);

export default router;
