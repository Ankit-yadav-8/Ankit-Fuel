import QueueReport from '../models/QueueReport.js';
import { haversineDistance } from '../utils/geoUtils.js';

/**
 * AI Recommendation Engine
 *
 * Ranks stations by a weighted scoring system:
 *   - Queue score    (40%) — fewer waiting vehicles = higher score
 *   - Distance score (25%) — closer to user = higher score
 *   - Price score    (15%) — lower price = higher score
 *   - Rating score   (10%) — higher rating = higher score
 *   - Amenity score  (10%) — more amenities = higher score
 *
 * Returns sorted stations with scores and human-readable recommendation text.
 */
export const getAIRecommendations = async (stations, userLocation, fuelType, vehicleType) => {
  if (!stations || stations.length === 0) return [];

  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

  // Fetch recent queue reports for all stations in one query
  const stationIds = stations.map(s => s._id);
  const recentReports = await QueueReport.find({
    stationId: { $in: stationIds },
    timestamp: { $gte: twoHoursAgo }
  });

  // Build a map of stationId → average queue data
  const queueMap = {};
  for (const report of recentReports) {
    const sid = report.stationId.toString();
    if (!queueMap[sid]) {
      queueMap[sid] = { totalWait: 0, totalVehicles: 0, count: 0, fuelAvailable: true };
    }
    queueMap[sid].totalWait += report.estimatedWaitMinutes;
    queueMap[sid].totalVehicles += report.vehiclesWaiting;
    queueMap[sid].count++;
    if (!report.fuelAvailable) queueMap[sid].fuelAvailable = false;
  }

  // Calculate distances
  const distances = stations.map(s => {
    const [lng, lat] = s.location.coordinates;
    return haversineDistance(userLocation.lat, userLocation.lng, lat, lng);
  });

  const maxDistance = Math.max(...distances, 1);

  // Get price range for normalization
  const priceKey = fuelType === 'ev' ? 'evPerKwh' : fuelType || 'petrol';
  const prices = stations.map(s => s.priceList?.[priceKey] || 0);
  const maxPrice = Math.max(...prices, 1);
  const minPrice = Math.min(...prices.filter(p => p > 0), maxPrice);

  // Score each station
  const scored = stations.map((station, i) => {
    const sid = station._id.toString();
    const queue = queueMap[sid];
    const distance = distances[i];
    const price = station.priceList?.[priceKey] || 0;

    // Queue score (0-100): Lower queue = higher score
    let queueScore = 100; // Default if no reports (assume no queue)
    if (queue && queue.count > 0) {
      const avgWait = queue.totalWait / queue.count;
      const avgVehicles = queue.totalVehicles / queue.count;
      queueScore = Math.max(0, 100 - (avgWait * 3) - (avgVehicles * 5));
      if (!queue.fuelAvailable) queueScore = 0; // No fuel = worst score
    }

    // Distance score (0-100): Closer = higher score
    const distanceScore = Math.max(0, 100 * (1 - distance / maxDistance));

    // Price score (0-100): Cheaper = higher score
    let priceScore = 50; // Default if no price data
    if (price > 0 && maxPrice > minPrice) {
      priceScore = 100 * (1 - (price - minPrice) / (maxPrice - minPrice));
    }

    // Rating score (0-100)
    const ratingScore = (station.rating / 5) * 100;

    // Amenity score (0-100)
    const amenityScore = Math.min(100, (station.amenities?.length || 0) * 15);

    // Weighted total
    const totalScore = Math.round(
      queueScore * 0.40 +
      distanceScore * 0.25 +
      priceScore * 0.15 +
      ratingScore * 0.10 +
      amenityScore * 0.10
    );

    // Generate recommendation text
    let recommendation = '';
    if (queueScore >= 80 && distanceScore >= 60) {
      recommendation = `Great choice! Short queue and only ${distance.toFixed(1)} km away.`;
    } else if (queueScore < 40 && i < stations.length - 1) {
      const nextStation = stations[i + 1];
      const nextDistance = distances[i + 1];
      if (nextDistance) {
        const extraKm = (nextDistance - distance).toFixed(1);
        recommendation = `Consider skipping this station. Drive ${extraKm} km further to avoid a long queue.`;
      }
    } else if (price > 0 && price === minPrice) {
      recommendation = `Best price in the area at ₹${price}/${fuelType === 'ev' ? 'kWh' : 'L'}.`;
    } else {
      recommendation = `Score: ${totalScore}/100. ${station.amenities?.length || 0} amenities available.`;
    }

    return {
      station,
      distanceKm: Math.round(distance * 10) / 10,
      scores: {
        total: totalScore,
        queue: Math.round(queueScore),
        distance: Math.round(distanceScore),
        price: Math.round(priceScore),
        rating: Math.round(ratingScore),
        amenity: Math.round(amenityScore)
      },
      queueInfo: queue ? {
        avgWaitMinutes: Math.round(queue.totalWait / queue.count),
        avgVehiclesWaiting: Math.round(queue.totalVehicles / queue.count),
        fuelAvailable: queue.fuelAvailable,
        reportsCount: queue.count
      } : null,
      recommendation
    };
  });

  // Sort by total score descending
  scored.sort((a, b) => b.scores.total - a.scores.total);

  return scored;
};
