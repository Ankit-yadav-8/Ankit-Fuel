/**
 * Haversine formula — distance between two lat/lng points in km
 */
export const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg) => deg * (Math.PI / 180);

/**
 * Generate intermediate waypoints along a straight line between two points.
 * Used to create a route corridor for finding nearby stations.
 */
export const generateWaypoints = (originLat, originLng, destLat, destLng, intervalKm = 10) => {
  const totalDistance = haversineDistance(originLat, originLng, destLat, destLng);
  const numPoints = Math.max(Math.ceil(totalDistance / intervalKm), 2);
  const waypoints = [];

  for (let i = 0; i <= numPoints; i++) {
    const fraction = i / numPoints;
    waypoints.push({
      lat: originLat + fraction * (destLat - originLat),
      lng: originLng + fraction * (destLng - originLng)
    });
  }

  return waypoints;
};

/**
 * Convert km to radians for MongoDB geospatial queries
 */
export const kmToRadians = (km) => km / 6371;

/**
 * Convert km to meters
 */
export const kmToMeters = (km) => km * 1000;
