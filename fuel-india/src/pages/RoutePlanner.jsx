import React, { useState, useEffect } from 'react';
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

function MapBounds({ routeCoords }) {
  const map = useMap();
  useEffect(() => {
    if (routeCoords && routeCoords.length > 0) {
      const bounds = L.latLngBounds(routeCoords);
      // Offset left padding by 400px on desktop so the route centers in the visible map area
      const isDesktop = window.innerWidth > 768;
      map.fitBounds(bounds, { 
        paddingTopLeft: [isDesktop ? 450 : 50, 50], 
        paddingBottomRight: [50, 50],
        animate: true 
      });
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
      // 1. Geocode Start Location using free Nominatim API
      const startRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(startQuery + ', India')}`);
      const startData = await startRes.json();
      if (!startData || startData.length === 0) throw new Error('Start location not found.');
      const startLat = parseFloat(startData[0].lat);
      const startLon = parseFloat(startData[0].lon);
      
      // 2. Geocode End Location using free Nominatim API
      const endRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endQuery + ', India')}`);
      const endData = await endRes.json();
      if (!endData || endData.length === 0) throw new Error('Destination location not found.');
      const endLat = parseFloat(endData[0].lat);
      const endLon = parseFloat(endData[0].lon);
      
      setStartCoords([startLat, startLon]);
      setEndCoords([endLat, endLon]);

      // 3. Get Directions using free OSRM API (no API key needed)
      const directionsRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`);
      const directionsData = await directionsRes.json();
      
      if (directionsData.code !== 'Ok') {
         throw new Error('Could not find a route between these locations.');
      }
      
      if (directionsData.routes && directionsData.routes.length > 0) {
        const route = directionsData.routes[0];
        
        // Decode coordinates from GeoJSON
        const coords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        setRouteCoords(coords);
        
        // Extract summary
        setRouteDetails({
          distance: (route.distance / 1000).toFixed(0), // km
          duration: formatDuration(route.duration), // string
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
    <div className="route-planner-layout">
      {/* Sidebar Panel (Google Maps Style) */}
      <div className="route-sidebar">
        <div className="route-sidebar__header">
          <button className="icon-btn" onClick={() => window.history.back()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <h2>{startQuery && endQuery ? `${startQuery} to ${endQuery}` : 'Plan Route'}</h2>
          <button className="icon-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>
        </div>

        <form className="route-sidebar__search" onSubmit={handleSearch}>
          <div className="search-inputs-vertical">
            <div className="input-group">
              <span className="input-icon">O</span>
              <input 
                type="text" 
                value={startQuery} 
                onChange={(e) => setStartQuery(e.target.value)}
                placeholder="Starting point"
              />
            </div>
            <div className="input-line"></div>
            <div className="input-group">
              <span className="input-icon dest-icon">O</span>
              <input 
                type="text" 
                value={endQuery} 
                onChange={(e) => setEndQuery(e.target.value)}
                placeholder="Destination"
              />
            </div>
            <button type="button" className="swap-btn-vertical" onClick={() => {
                const temp = startQuery;
                setStartQuery(endQuery);
                setEndQuery(temp);
              }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 16V4h10M7 4l-3 3 3 3M17 8v12H7M17 20l3-3-3-3"/></svg>
            </button>
          </div>
          <button type="submit" className="btn-find-route" disabled={loading}>
            {loading ? 'Calculating...' : 'Find Route'}
          </button>
        </form>

        <div className="route-sidebar__tabs">
          <div className="tab active">Route</div>
          <div className="tab">Map</div>
        </div>

        <div className="route-sidebar__content">
          {error && (
            <div className="error-box">
              <p>{error}</p>
            </div>
          )}

          {routeDetails && !error && (
            <div className="route-details-card">
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
        </div>

        <div className="route-sidebar__footer">
          <button className="btn-start" onClick={handleSearch}>
            Start Route
          </button>
          <button className="btn-add">
            Add Stop
          </button>
          <button className="btn-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          </button>
        </div>
      </div>

      {/* Map Background */}
      <div className="route-map-area">
        <MapContainer 
          center={defaultCenter} 
          zoom={defaultZoom} 
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
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

      <style dangerouslySetInnerHTML={{__html: `
        /* Hide navbar/footer */
        nav.navbar, footer.footer, .mobile-menu { display: none !important; }
        body { margin: 0; overflow: hidden; }
        
        .route-planner-layout {
          display: flex;
          height: 100vh;
          width: 100vw;
          font-family: 'Inter', sans-serif;
          background: #f0f0f0;
        }

        .route-sidebar {
          width: 400px;
          min-width: 400px;
          background: white;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 24px rgba(0,0,0,0.1);
          z-index: 10;
          position: relative;
        }

        .route-map-area {
          flex: 1;
          height: 100%;
          position: relative;
          z-index: 1;
        }

        .route-sidebar__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 20px 16px;
        }
        
        .route-sidebar__header h2 {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .icon-btn {
          background: none; border: none; padding: 8px; cursor: pointer; color: #111827;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
        }
        .icon-btn:hover { background: #F3F4F6; }

        .route-sidebar__search {
          padding: 0 20px 16px;
        }

        .search-inputs-vertical {
          background: #F3F4F6;
          border-radius: 16px;
          padding: 16px;
          position: relative;
          margin-bottom: 16px;
        }

        .input-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .input-icon {
          font-size: 12px; color: #0D9488; font-weight: bold;
        }
        .dest-icon { color: #DC2626; }

        .input-group input {
          border: none;
          background: transparent;
          font-size: 15px;
          font-weight: 600;
          color: #111827;
          width: 100%;
          outline: none;
        }

        .input-line {
          height: 1px;
          background: #E5E7EB;
          margin: 12px 0 12px 24px;
        }

        .swap-btn-vertical {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: white; 
          border: 1px solid #E5E7EB;
          border-radius: 50%;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #6B7280;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .btn-find-route {
          width: 100%;
          background: #111827;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .route-sidebar__tabs {
          display: flex;
          padding: 0 20px;
          border-bottom: 1px solid #E5E7EB;
        }

        .tab {
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          color: #6B7280;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }

        .tab.active {
          color: #0D9488;
          border-bottom-color: #0D9488;
        }

        .route-sidebar__content {
          flex: 1;
          padding: 24px 20px;
          overflow-y: auto;
          background: #F9FAFB;
        }

        .error-box {
          background: #FEF2F2;
          border: 1px solid #FCA5A5;
          color: #DC2626;
          padding: 16px;
          border-radius: 12px;
          font-weight: 500;
          font-size: 14px;
        }

        .route-details-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border: 1px solid #E5E7EB;
        }

        .route-details-card h3 {
          font-size: 16px;
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

        .route-sidebar__footer {
          padding: 20px;
          border-top: 1px solid #E5E7EB;
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
        }

        .btn-start {
          flex: 1;
          background: #0D9488;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-add {
          background: white;
          color: #111827;
          border: 1px solid #E5E7EB;
          padding: 14px 20px;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-icon {
          background: white;
          color: #111827;
          border: 1px solid #E5E7EB;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .route-planner-layout {
            flex-direction: column;
          }
          .route-sidebar {
            width: 100%;
            min-width: 100%;
            height: auto;
            max-height: 50vh;
            border-radius: 0 0 24px 24px;
            position: absolute;
            top: 0;
            left: 0;
          }
          .route-map-area {
            height: 100vh;
          }
          .route-sidebar__footer {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            border-radius: 100px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            border-top: none;
            padding: 12px;
          }
          .route-sidebar__content {
            display: none; /* Hide details on small mobile to save space, or make expandable */
          }
        }
      `}} />
    </div>
  );
}
