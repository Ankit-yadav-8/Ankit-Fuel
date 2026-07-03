import Station from '../models/Station.js';
import QueueReport from '../models/QueueReport.js';
import { haversineDistance, generateWaypoints, kmToMeters } from '../utils/geoUtils.js';
import { getAIRecommendations } from '../services/aiRecommendation.js';

/**
 * POST /api/route/plan
 * Plan a route and find recommended fuel stops along the way
 */
export const planRoute = async (req, res, next) => {
  try {
    const { origin, destination, fuelType, vehicleType } = req.body;

    if (!origin || !destination || !origin.lat || !origin.lng || !destination.lat || !destination.lng) {
      return res.status(400).json({
        success: false,
        message: 'Origin and destination with lat/lng are required'
      });
    }

    const totalDistance = haversineDistance(origin.lat, origin.lng, destination.lat, destination.lng);

    // Generate waypoints every 10km along the route
    const waypoints = generateWaypoints(origin.lat, origin.lng, destination.lat, destination.lng, 10);

    // Find all stations within 2km of any waypoint
    const stationIds = new Set();
    const allStations = [];

    for (const wp of waypoints) {
      const nearbyStations = await Station.find({
        location: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [wp.lng, wp.lat]
            },
            $maxDistance: kmToMeters(2) // 2km corridor
          }
        },
        ...(fuelType && { fuelTypes: { $in: [fuelType] } })
      }).limit(10);

      for (const station of nearbyStations) {
        const id = station._id.toString();
        if (!stationIds.has(id)) {
          stationIds.add(id);
          allStations.push(station);
        }
      }
    }

    // Get AI-ranked recommendations
    const rankedStations = await getAIRecommendations(
      allStations,
      { lat: origin.lat, lng: origin.lng },
      fuelType,
      vehicleType
    );

    res.json({
      success: true,
      data: {
        route: {
          origin,
          destination,
          totalDistanceKm: Math.round(totalDistance * 10) / 10,
          waypointCount: waypoints.length
        },
        stations: rankedStations,
        stationCount: rankedStations.length,
        recommendation: rankedStations.length > 0
          ? `Found ${rankedStations.length} stations along your ${Math.round(totalDistance)} km route.`
          : 'No stations found along this route. Try expanding your search.'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/route/save
 * Save a route to user's profile
 */
export const saveRoute = async (req, res, next) => {
  try {
    const { name, origin, destination } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ success: false, message: 'Origin and destination are required' });
    }

    const user = req.user;

    // Max 10 saved routes
    if (user.savedRoutes && user.savedRoutes.length >= 10) {
      return res.status(400).json({ success: false, message: 'Maximum 10 saved routes allowed' });
    }

    user.savedRoutes.push({
      name: name || `Route ${(user.savedRoutes?.length || 0) + 1}`,
      origin,
      destination
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Route saved',
      data: { savedRoutes: user.savedRoutes }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/route/saved
 * Get user's saved routes
 */
export const getSavedRoutes = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: { savedRoutes: req.user.savedRoutes || [] }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/route/saved/:routeId
 * Delete a saved route
 */
export const deleteSavedRoute = async (req, res, next) => {
  try {
    const user = req.user;
    user.savedRoutes = user.savedRoutes.filter(
      r => r._id.toString() !== req.params.routeId
    );
    await user.save();

    res.json({
      success: true,
      message: 'Route deleted',
      data: { savedRoutes: user.savedRoutes }
    });
  } catch (error) {
    next(error);
  }
};
