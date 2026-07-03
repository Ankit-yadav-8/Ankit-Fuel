import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon path issues with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// We use the provided key as fallback in case .env wasn't loaded by the dev server yet
const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY || '5b3ce3597851110001cf62489b3cf7b41d9b4347b23abf61edc95b22';

function MapBounds({ routeCoords }) {
  const map = useMap();
  useEffect(() => {
    if (routeCoords && routeCoords.length > 0) {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [routeCoords, map]);
  return null;
}

export default function RoutePlanner() {
  const [startQuery, setStartQuery] = useState('Delhi');
  const [endQuery, setEndQuery] = useState('Jaipur');
  
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
    if (e) e.preventDefault();
    if (!startQuery || !endQuery) {
      setError('Please enter both start and destination locations.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // 1. Geocode Start Location
      const startRes = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(startQuery)}`);
      if (!startRes.ok) throw new Error('Network error. Check API key or connection.');
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
        const coords = feature.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        setRouteCoords(coords);
        
        // Extract summary
        const summary = feature.properties.segments[0];
        setRouteDetails({
          distance: (summary.distance / 1000).toFixed(0), // km
          duration: formatDuration(summary.duration), // string
        });
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch route. Please try again later.');
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
    <div className="route-planner-container">
      {/* Map Background */}
      <div className="route-planner-map-bg">
        <MapContainer 
          center={defaultCenter} 
          zoom={defaultZoom} 
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // Cleaner map tiles matching the mockup
          />
          
          {startCoords && <Marker position={startCoords} />}
          {endCoords && <Marker position={endCoords} />}
          
          {routeCoords.length > 0 && (
            <Polyline 
              positions={routeCoords} 
              color="#0D9488" 
              weight={6} 
              opacity={0.9}
            />
          )}

          {routeCoords.length > 0 && <MapBounds routeCoords={routeCoords} />}
        </MapContainer>
      </div>

      {/* Floating Top Panel */}
      <div className="floating-top-panel">
        <div className="top-panel-header">
          <button className="icon-btn" onClick={() => window.history.back()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <h2>{startQuery && endQuery ? `${startQuery} to ${endQuery}` : 'Plan Route'}</h2>
          <button className="icon-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>
        </div>

        <form className="top-panel-search" onSubmit={handleSearch}>
          <div className="search-inputs">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <div className="input-fields">
              <span className="input-label">From:</span>
              <input 
                type="text" 
                value={startQuery} 
                onChange={(e) => setStartQuery(e.target.value)}
                placeholder="Start Location"
              />
              <span className="input-divider">|</span>
              <span className="input-label">To:</span>
              <input 
                type="text" 
                value={endQuery} 
                onChange={(e) => setEndQuery(e.target.value)}
                placeholder="Destination"
              />
            </div>
            <button type="submit" className="swap-btn" title="Swap & Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 10V4h10M7 4l-3 3 3 3M17 14v6H7M17 20l3-3-3-3"/></svg>
            </button>
          </div>
        </form>

        <div className="top-panel-tabs">
          <div className="tab active">Route</div>
          <div className="tab">Map</div>
        </div>
      </div>

      {/* Floating Route Details (Left Side) */}
      {error && (
        <div className="floating-details-panel error-panel">
          <p>{error}</p>
        </div>
      )}

      {routeDetails && !error && (
        <div className="floating-details-panel">
          <h3>Route Details</h3>
          
          <div className="detail-row">
            <span className="detail-label">Duration</span>
            <span className="detail-value">{routeDetails.duration}</span>
          </div>
          
          <div className="detail-divider"></div>
          
          <div className="detail-row">
            <span className="detail-label">Distance</span>
            <span className="detail-value">{routeDetails.distance} km</span>
          </div>
          
          <div className="detail-divider"></div>
          
          <div className="detail-row">
            <span className="detail-label">Fuel Stations</span>
            <span className="detail-value">12 stations</span>
          </div>
        </div>
      )}

      {/* Floating Bottom Bar */}
      <div className="floating-bottom-bar">
        <button className="btn-start-route" onClick={handleSearch}>
          {loading ? 'Routing...' : 'Start Route'}
        </button>
        <button className="btn-add-stop">
          Add Stop
        </button>
        <button className="btn-nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
        </button>
      </div>

      {/* Inline Styles specifically for Route Planner to override global padding and ensure full screen */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Hide regular navbar and footer on this page to make it full screen map */
        nav.navbar, footer.footer, .mobile-menu { display: none !important; }
        body { margin: 0; overflow: hidden; }
        
        .route-planner-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          background: #f0f0f0;
          font-family: 'Inter', sans-serif;
        }

        .route-planner-map-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 1;
        }

        /* Floating Top Panel */
        .floating-top-panel {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 480px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          z-index: 10;
          overflow: hidden;
        }

        .top-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
        }
        
        .top-panel-header h2 {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .icon-btn {
          background: none; border: none; padding: 4px; cursor: pointer; color: #111827;
          display: flex; align-items: center; justify-content: center;
        }

        .top-panel-search {
          padding: 0 20px 16px;
        }

        .search-inputs {
          display: flex;
          align-items: center;
          background: #F3F4F6;
          border-radius: 100px;
          padding: 12px 16px;
          gap: 12px;
        }

        .input-fields {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .input-label {
          font-size: 14px; color: #6B7280;
        }

        .input-divider {
          color: #D1D5DB; margin: 0 4px;
        }

        .input-fields input {
          border: none;
          background: transparent;
          font-size: 15px;
          font-weight: 600;
          color: #111827;
          width: 100%;
          outline: none;
        }

        .swap-btn {
          background: none; border: none; cursor: pointer; color: #6B7280;
        }

        .top-panel-tabs {
          display: flex;
          padding: 0 20px;
        }

        .tab {
          padding: 12px 24px;
          font-size: 15px;
          font-weight: 600;
          color: #6B7280;
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }

        .tab.active {
          color: #0D9488;
          border-bottom-color: #0D9488;
        }

        /* Floating Details Panel (Left) */
        .floating-details-panel {
          position: absolute;
          top: 200px;
          left: 20px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          z-index: 10;
          min-width: 200px;
        }

        .error-panel {
          color: #DC2626;
          font-weight: 600;
        }

        .floating-details-panel h3 {
          font-size: 15px;
          font-weight: 800;
          color: #111827;
          margin: 0 0 16px 0;
        }

        .detail-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-label {
          font-size: 13px;
          color: #6B7280;
        }

        .detail-value {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
        }

        .detail-divider {
          height: 1px;
          background: #E5E7EB;
          margin: 12px 0;
        }

        /* Floating Bottom Bar */
        .floating-bottom-bar {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 12px;
          border-radius: 100px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-start-route {
          background: #0D9488;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 100px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-start-route:hover {
          background: #0F766E;
        }

        .btn-add-stop {
          background: white;
          color: #111827;
          border: 1px solid #E5E7EB;
          padding: 12px 24px;
          border-radius: 100px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-nav-icon {
          background: white;
          color: #111827;
          border: 1px solid #E5E7EB;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .floating-details-panel {
            top: auto;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 480px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
          }
          .floating-details-panel h3 { display: none; }
          .detail-divider { width: 1px; height: 30px; margin: 0 12px; }
          .floating-bottom-bar {
            width: 90%;
            max-width: 480px;
            justify-content: space-between;
            padding: 12px 16px;
          }
        }
      `}} />
    </div>
  );
}
