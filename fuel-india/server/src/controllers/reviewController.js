import Review from '../models/Review.js';
import User from '../models/User.js';
import Reward from '../models/Reward.js';

/**
 * POST /api/reviews
 * Submit a review for a station (awards 15 points, +5 for photo)
 */
export const createReview = async (req, res, next) => {
  try {
    const { stationId, rating, comment, photos, reportedPrice } = req.body;

    if (!stationId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'stationId and rating are required'
      });
    }

    const review = await Review.create({
      stationId,
      userId: req.user._id,
      rating,
      comment,
      photos: photos || [],
      reportedPrice
    });

    // Award points: 15 for review + 5 for photo
    let totalPoints = 15;
    let description = 'Station review submitted';

    if (photos && photos.length > 0) {
      totalPoints += 5;
      description += ' (with photo bonus)';
    }

    await Reward.create({
      userId: req.user._id,
      action: photos && photos.length > 0 ? 'photo' : 'review',
      points: totalPoints,
      description,
      referenceId: review._id
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { rewardPoints: totalPoints } });

    res.status(201).json({
      success: true,
      message: `Review submitted (+${totalPoints} points)`,
      data: { review, pointsEarned: totalPoints }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reviews/station/:stationId
 * Get reviews for a station (paginated)
 */
export const getStationReviews = async (req, res, next) => {
  try {
    const { stationId } = req.params;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      highest: { rating: -1 },
      lowest: { rating: 1 }
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Review.countDocuments({ stationId });

    const reviews = await Review.find({ stationId })
      .sort(sortOptions[sort] || sortOptions.newest)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name avatar');

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/reviews/:id
 * Delete a review (own review or admin)
 */
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check ownership or admin
    if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Review deleted'
    });
  } catch (error) {
    next(error);
  }
};
