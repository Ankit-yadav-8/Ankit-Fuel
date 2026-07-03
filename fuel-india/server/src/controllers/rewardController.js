import Reward from '../models/Reward.js';
import User from '../models/User.js';

/**
 * GET /api/rewards/balance
 * Get user's total reward points
 */
export const getBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        totalPoints: user.rewardPoints,
        tier: user.rewardPoints >= 1000 ? 'Gold' :
              user.rewardPoints >= 500 ? 'Silver' :
              user.rewardPoints >= 100 ? 'Bronze' : 'Starter'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/rewards/history
 * Get user's reward history (paginated)
 */
export const getHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Reward.countDocuments({ userId: req.user._id });

    const rewards = await Reward.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        rewards,
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
 * POST /api/rewards/redeem
 * Redeem points for vouchers (placeholder)
 */
export const redeemPoints = async (req, res, next) => {
  try {
    const { points, redeemFor } = req.body;

    if (!points || points <= 0) {
      return res.status(400).json({ success: false, message: 'Valid points amount required' });
    }

    const user = await User.findById(req.user._id);

    if (user.rewardPoints < points) {
      return res.status(400).json({
        success: false,
        message: `Insufficient points. You have ${user.rewardPoints}, trying to redeem ${points}`
      });
    }

    // Deduct points
    user.rewardPoints -= points;
    await user.save();

    // Log redemption
    await Reward.create({
      userId: req.user._id,
      action: 'redemption',
      points: -points,
      description: `Redeemed ${points} points for: ${redeemFor || 'Fuel voucher'}`
    });

    res.json({
      success: true,
      message: `Successfully redeemed ${points} points`,
      data: {
        redeemedFor: redeemFor || 'Fuel voucher',
        remainingPoints: user.rewardPoints
      }
    });
  } catch (error) {
    next(error);
  }
};
