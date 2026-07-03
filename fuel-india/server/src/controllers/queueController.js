import QueueReport from '../models/QueueReport.js';
import User from '../models/User.js';
import Reward from '../models/Reward.js';

/**
 * POST /api/queues/report
 * Submit a queue report (awards 10 points)
 */
export const submitReport = async (req, res, next) => {
  try {
    const { stationId, vehiclesWaiting, estimatedWaitMinutes, fuelAvailable, fuelType } = req.body;

    if (!stationId || vehiclesWaiting === undefined || !estimatedWaitMinutes || !fuelType) {
      return res.status(400).json({
        success: false,
        message: 'stationId, vehiclesWaiting, estimatedWaitMinutes, and fuelType are required'
      });
    }

    const report = await QueueReport.create({
      stationId,
      userId: req.user._id,
      vehiclesWaiting,
      estimatedWaitMinutes,
      fuelAvailable: fuelAvailable !== false,
      fuelType
    });

    // Award 10 reward points
    await Reward.create({
      userId: req.user._id,
      action: 'queue_report',
      points: 10,
      description: 'Queue report submitted',
      referenceId: report._id
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { rewardPoints: 10 } });

    res.status(201).json({
      success: true,
      message: 'Queue report submitted (+10 points)',
      data: { report, pointsEarned: 10 }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/queues/station/:stationId
 * Get recent queue reports for a station (last 2 hours)
 */
export const getStationReports = async (req, res, next) => {
  try {
    const { stationId } = req.params;
    const { fuelType } = req.query;

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const filter = {
      stationId,
      timestamp: { $gte: twoHoursAgo }
    };

    if (fuelType) filter.fuelType = fuelType;

    const reports = await QueueReport.find(filter)
      .sort({ timestamp: -1 })
      .populate('userId', 'name avatar')
      .limit(20);

    // Calculate averages from recent reports
    let avgWait = 0;
    let avgVehicles = 0;
    let fuelAvailableCount = 0;

    if (reports.length > 0) {
      const totals = reports.reduce((acc, r) => {
        acc.wait += r.estimatedWaitMinutes;
        acc.vehicles += r.vehiclesWaiting;
        if (r.fuelAvailable) acc.available++;
        return acc;
      }, { wait: 0, vehicles: 0, available: 0 });

      avgWait = Math.round(totals.wait / reports.length);
      avgVehicles = Math.round(totals.vehicles / reports.length);
      fuelAvailableCount = totals.available;
    }

    res.json({
      success: true,
      data: {
        reports,
        summary: {
          reportCount: reports.length,
          avgWaitMinutes: avgWait,
          avgVehiclesWaiting: avgVehicles,
          fuelLikelyAvailable: fuelAvailableCount > reports.length / 2
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/queues/station/:stationId/predict
 * AI queue prediction based on historical patterns
 */
export const predictQueue = async (req, res, next) => {
  try {
    const { stationId } = req.params;

    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0=Sunday

    // Get historical reports for this station from last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const historicalReports = await QueueReport.find({
      stationId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    if (historicalReports.length < 3) {
      return res.json({
        success: true,
        data: {
          prediction: null,
          message: 'Insufficient data for prediction. Need more community reports.',
          confidence: 'low'
        }
      });
    }

    // Filter reports from similar time windows (±2 hours, same day type)
    const isWeekend = currentDay === 0 || currentDay === 6;
    const relevantReports = historicalReports.filter(r => {
      const reportDate = new Date(r.createdAt);
      const reportHour = reportDate.getHours();
      const reportDay = reportDate.getDay();
      const reportIsWeekend = reportDay === 0 || reportDay === 6;

      const hourMatch = Math.abs(reportHour - currentHour) <= 2;
      const dayTypeMatch = isWeekend === reportIsWeekend;

      return hourMatch && dayTypeMatch;
    });

    if (relevantReports.length === 0) {
      // Fallback to all historical data
      const avg = historicalReports.reduce((s, r) => s + r.estimatedWaitMinutes, 0) / historicalReports.length;

      return res.json({
        success: true,
        data: {
          prediction: {
            estimatedWaitMinutes: Math.round(avg),
            estimatedVehicles: Math.round(historicalReports.reduce((s, r) => s + r.vehiclesWaiting, 0) / historicalReports.length),
            peakStatus: avg > 15 ? 'busy' : avg > 5 ? 'moderate' : 'light'
          },
          confidence: 'low',
          basedOn: `${historicalReports.length} total reports`
        }
      });
    }

    const avgWait = relevantReports.reduce((s, r) => s + r.estimatedWaitMinutes, 0) / relevantReports.length;
    const avgVehicles = relevantReports.reduce((s, r) => s + r.vehiclesWaiting, 0) / relevantReports.length;

    // Peak hour detection (7-9 AM, 5-8 PM)
    const isPeakHour = (currentHour >= 7 && currentHour <= 9) || (currentHour >= 17 && currentHour <= 20);
    const peakMultiplier = isPeakHour ? 1.3 : 1.0;

    const predictedWait = Math.round(avgWait * peakMultiplier);
    const predictedVehicles = Math.round(avgVehicles * peakMultiplier);

    res.json({
      success: true,
      data: {
        prediction: {
          estimatedWaitMinutes: predictedWait,
          estimatedVehicles: predictedVehicles,
          peakStatus: predictedWait > 15 ? 'busy' : predictedWait > 5 ? 'moderate' : 'light',
          isPeakHour,
          dayType: isWeekend ? 'weekend' : 'weekday'
        },
        confidence: relevantReports.length >= 10 ? 'high' : relevantReports.length >= 5 ? 'medium' : 'low',
        basedOn: `${relevantReports.length} similar-time reports`
      }
    });
  } catch (error) {
    next(error);
  }
};
