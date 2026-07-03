import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon path issues with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;

// Component to dynamically update map bounds to fit the route
function MapBounds({ routeCoords }) {
  const map = useMap();
  useEffect(() => {
    if (routeCoords && routeCoords.length > 0) {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [routeCoords, map]);
  return null;
}

export default function RoutePlanner() {
  const [startQuery, setStartQuery] = useState('');
  const [endQuery, setEndQuery] = useState('');
  
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  
  const [routeDetails, setRouteDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default center (India)
  const defaultCenter = [20.5937, 78.9629];
  const defaultZoom = 5;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!startQuery || !endQuery) {
      setError('Please enter both start and destination locations.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // 1. Geocode Start Location
      const startRes = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(startQuery)}`);
      const startData = await startRes.json();
      if (!startData.features || startData.features.length === 0) throw new Error('Start location not found.');
      const startLon = startData.features[0].geometry.coordinates[0];
      const startLat = startData.features[0].geometry.coordinates[1];
      
      // 2. Geocode End Location
      const endRes = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(endQuery)}`);
      const endData = await endRes.json();
      if (!endData.features || endData.features.length === 0) throw new Error('Destination location not found.');
      const endLon = endData.features[0].geometry.coordinates[0];
      const endLat = endData.features[0].geometry.coordinates[1];
      
      setStartCoords([startLat, startLon]);
      setEndCoords([endLat, endLon]);

      // 3. Get Directions
      const directionsRes = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${startLon},${startLat}&end=${endLon},${endLat}`);
      const directionsData = await directionsRes.json();
      
      if (directionsData.error) {
         throw new Error(directionsData.error.message || 'Could not find a route between these locations.');
      }
      
      if (directionsData.features && directionsData.features.length > 0) {
        const feature = directionsData.features[0];
        
        // Decode coordinates from GeoJSON
        // Note: GeoJSON coordinates are [lon, lat], Leaflet wants [lat, lon]
        const coords = feature.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        setRouteCoords(coords);
        
        // Extract summary
        const summary = feature.properties.segments[0];
        setRouteDetails({
          distance: (summary.distance / 1000).toFixed(1), // km
          duration: formatDuration(summary.duration), // string
        });
      }

    } catch (err) {
      setError(err.message || 'Failed to fetch route. Please check your inputs or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="route-planner page">
      {/* Sidebar Overlay */}
      <div className="route-planner__sidebar">
        <div className="route-planner__header">
          <button className="route-planner__back" onClick={() => window.history.back()}>←</button>
          <h2 className="route-planner__title">Plan Route</h2>
          <button className="route-planner__menu">⋮</button>
        </div>
        
        <form className="route-planner__form" onSubmit={handleSearch}>
          <div className="route-planner__inputs">
            <div className="route-planner__input-group">
              <span className="route-planner__icon">O</span>
              <input 
                type="text" 
                placeholder="From: e.g. Delhi" 
                value={startQuery} 
                onChange={(e) => setStartQuery(e.target.value)}
                className="route-planner__input"
              />
            </div>
            <div className="route-planner__input-line"></div>
            <div className="route-planner__input-group">
              <span className="route-planner__icon route-planner__icon--dest">O</span>
              <input 
                type="text" 
                placeholder="To: e.g. Jaipur" 
                value={endQuery} 
                onChange={(e) => setEndQuery(e.target.value)}
                className="route-planner__input"
              />
            </div>
          </div>
          <button type="submit" className="btn btn--primary route-planner__btn" disabled={loading}>
            {loading ? 'Calculating...' : 'Find Route'}
          </button>
        </form>

        {error && <div className="route-planner__error">{error}</div>}

        {routeDetails && (
          <div className="route-planner__details">
            <div className="route-planner__details-header">Route Details</div>
            <div className="route-planner__details-body">
              <div className="route-planner__detail-item">
                <span className="route-planner__detail-label">Duration</span>
                <span className="route-planner__detail-value">{routeDetails.duration}</span>
              </div>
              <div className="route-planner__detail-item">
                <span className="route-planner__detail-label">Distance</span>
                <span className="route-planner__detail-value">{routeDetails.distance} km</span>
              </div>
            </div>
            <div className="route-planner__fuel-stations">
              <span className="route-planner__fuel-label">Fuel Stations</span>
              <span className="route-planner__fuel-value">12 stations</span>
              <p className="route-planner__fuel-desc">Available on your route</p>
            </div>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="route-planner__map">
        <MapContainer 
          center={defaultCenter} 
          zoom={defaultZoom} 
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Powered by openrouteservice'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {startCoords && <Marker position={startCoords} />}
          {endCoords && <Marker position={endCoords} />}
          
          {routeCoords.length > 0 && (
            <Polyline 
              positions={routeCoords} 
              color="#0D9488" 
              weight={6} 
              opacity={0.8}
            />
          )}

          {routeCoords.length > 0 && <MapBounds routeCoords={routeCoords} />}
        </MapContainer>
      </div>
    </div>
  );
}
