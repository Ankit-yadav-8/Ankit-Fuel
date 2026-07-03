import User from '../models/User.js';
import Station from '../models/Station.js';
import QueueReport from '../models/QueueReport.js';
import Review from '../models/Review.js';
import Reward from '../models/Reward.js';

/**
 * GET /api/admin/dashboard
 * Get summary stats for admin dashboard
 */
export const getDashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalStations, totalReports, totalReviews] = await Promise.all([
      User.countDocuments(),
      Station.countDocuments(),
      QueueReport.countDocuments(),
      Review.countDocuments()
    ]);

    // New users in last 7 days
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: weekAgo } });

    // Reports in last 24 hours
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const reportsToday = await QueueReport.countDocuments({ createdAt: { $gte: dayAgo } });

    // Verified vs unverified stations
    const verifiedStations = await Station.countDocuments({ isVerified: true });

    // Total reward points distributed
    const pointsResult = await Reward.aggregate([
      { $match: { points: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: '$points' } } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalStations,
          totalReports,
          totalReviews,
          verifiedStations,
          unverifiedStations: totalStations - verifiedStations
        },
        recent: {
          newUsersThisWeek,
          reportsToday
        },
        rewards: {
          totalPointsDistributed: pointsResult[0]?.total || 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users
 * List all users (paginated, searchable)
 */
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) filter.role = role;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        users,
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
 * PUT /api/admin/users/:id/role
 * Change a user's role
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be "user" or "admin"' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/analytics/peak-hours
 * Analyze peak hours from queue reports
 */
export const getPeakHours = async (req, res, next) => {
  try {
    const peakHours = await QueueReport.aggregate([
      {
        $group: {
          _id: { $hour: '$timestamp' },
          avgWait: { $avg: '$estimatedWaitMinutes' },
          avgVehicles: { $avg: '$vehiclesWaiting' },
          reportCount: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const formatted = peakHours.map(h => ({
      hour: `${h._id}:00`,
      avgWaitMinutes: Math.round(h.avgWait),
      avgVehicles: Math.round(h.avgVehicles),
      reportCount: h.reportCount,
      status: h.avgWait > 15 ? 'Peak' : h.avgWait > 5 ? 'Moderate' : 'Light'
    }));

    res.json({
      success: true,
      data: { peakHours: formatted }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/analytics/city-heatmap
 * Station density by city
 */
export const getCityHeatmap = async (req, res, next) => {
  try {
    const cityStats = await Station.aggregate([
      {
        $group: {
          _id: '$city',
          stationCount: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          fuelTypes: { $addToSet: '$fuelTypes' }
        }
      },
      { $sort: { stationCount: -1 } },
      { $limit: 50 }
    ]);

    res.json({
      success: true,
      data: { cities: cityStats }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/analytics/demand
 * Fuel demand trends (reports by fuel type over time)
 */
export const getFuelDemand = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const demand = await QueueReport.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            fuelType: '$fuelType',
            day: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
          },
          reportCount: { $sum: 1 },
          avgWait: { $avg: '$estimatedWaitMinutes' }
        }
      },
      { $sort: { '_id.day': 1 } }
    ]);

    res.json({
      success: true,
      data: { demand }
    });
  } catch (error) {
    next(error);
  }
};
