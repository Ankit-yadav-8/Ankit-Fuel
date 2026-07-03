import Station from '../models/Station.js';
import { kmToMeters } from '../utils/geoUtils.js';

/**
 * GET /api/stations
 * List stations with pagination and filters
 */
export const getStations = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      fuelType,
      brand,
      amenity,
      city,
      state,
      sortBy = 'rating'
    } = req.query;

    const filter = {};

    if (fuelType) filter.fuelTypes = { $in: fuelType.split(',') };
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (amenity) filter.amenities = { $in: amenity.split(',') };
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (state) filter.state = { $regex: state, $options: 'i' };

    const sortOptions = {
      rating: { rating: -1 },
      name: { name: 1 },
      newest: { createdAt: -1 },
      reviews: { reviewCount: -1 }
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Station.countDocuments(filter);

    const stations = await Station.find(filter)
      .sort(sortOptions[sortBy] || sortOptions.rating)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        stations,
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
 * GET /api/stations/nearby
 * Find stations near a location using geospatial query
 */
export const getNearbyStations = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5, fuelType, limit = 20 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude (lat) and longitude (lng) are required'
      });
    }

    const filter = {
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: kmToMeters(parseFloat(radius))
        }
      }
    };

    if (fuelType) {
      filter.fuelTypes = { $in: fuelType.split(',') };
    }

    const stations = await Station.find(filter).limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        stations,
        count: stations.length,
        searchRadius: `${radius} km`
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/stations/search
 * Text search by name, brand, city
 */
export const searchStations = async (req, res, next) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query (q) is required' });
    }

    const stations = await Station.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: { stations, count: stations.length }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/stations/:id
 * Get single station details
 */
export const getStation = async (req, res, next) => {
  try {
    const station = await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({ success: false, message: 'Station not found' });
    }

    res.json({
      success: true,
      data: { station }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/stations
 * Admin: create a new station
 */
export const createStation = async (req, res, next) => {
  try {
    const station = await Station.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Station created',
      data: { station }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/stations/:id
 * Admin: update station
 */
export const updateStation = async (req, res, next) => {
  try {
    const station = await Station.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!station) {
      return res.status(404).json({ success: false, message: 'Station not found' });
    }

    res.json({
      success: true,
      message: 'Station updated',
      data: { station }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/stations/:id
 * Admin: delete station
 */
export const deleteStation = async (req, res, next) => {
  try {
    const station = await Station.findByIdAndDelete(req.params.id);

    if (!station) {
      return res.status(404).json({ success: false, message: 'Station not found' });
    }

    res.json({
      success: true,
      message: 'Station deleted'
    });
  } catch (error) {
    next(error);
  }
};
