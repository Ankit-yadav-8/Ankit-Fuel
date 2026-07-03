import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Google Maps style origin marker: white circle with dark ring
const originIcon = L.divIcon({
  className: 'gm-marker',
  html: '<div class="gm-origin-dot"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Google Maps style destination marker: red teardrop pin
const destinationIcon = L.divIcon({
  className: 'gm-marker',
  html: `<svg width="27" height="41" viewBox="0 0 27 41" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 0C6.04 0 0 6.04 0 13.5 0 23.6 13.5 41 13.5 41S27 23.6 27 13.5C27 6.04 20.96 0 13.5 0z" fill="#EA4335" stroke="#B31412" stroke-width="1"/>
    <circle cx="13.5" cy="13.5" r="4.8" fill="#7B231A"/>
  </svg>`,
  iconSize: [27, 41],
  iconAnchor: [13, 41],
});

// White info bubble on the route showing time + distance (like Google Maps)
function routeLabelIcon(duration, distance, selected) {
  return L.divIcon({
    className: 'gm-marker',
    html: `<div class="gm-route-label ${selected ? 'selected' : ''}"><b>${duration}</b><span>${distance}</span></div>`,
    iconSize: null,
    iconAnchor: [0, 0],
  });
}

function MapBounds({ routes }) {
  const map = useMap();
  useEffect(() => {
    if (routes && routes.length > 0) {
      const allCoords = routes.flatMap((r) => r.coords);
      const bounds = L.latLngBounds(allCoords);
      const isDesktop = window.innerWidth > 768;
      map.fitBounds(bounds, {
        // Panel floats over the map on desktop, so pad the left side past it
        paddingTopLeft: isDesktop ? [440, 60] : [40, 200],
        paddingBottomRight: isDesktop ? [60, 60] : [40, 60],
        animate: true,
      });
    }
  }, [routes, map]);
  return null;
}

const TRAVEL_MODES = [
  { id: 'drive', label: 'Driving', icon: <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" /> },
  { id: 'transit', label: 'Transit', icon: <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H6V6h5v5zm5.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6h-5V6h5v5z" /> },
  { id: 'walk', label: 'Walking', icon: <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7" /> },
  { id: 'bike', label: 'Cycling', icon: <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" /> },
];

export default function RoutePlanner() {
  const [startQuery, setStartQuery] = useState('Delhi');
  const [endQuery, setEndQuery] = useState('Jaipur');
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [routes, setRoutes] = useState([]); // [{ coords, distance, duration, summary }]
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const defaultCenter = [20.5937, 78.9629];
  const defaultZoom = 5;

  // Load the default route on first open so the page never looks empty
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const geocode = async (query) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', India')}`
    );
    const data = await res.json();
    if (!data || data.length === 0) throw new Error(`Could not find "${query}".`);
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!startQuery || !endQuery) {
      setError('Please enter both a starting point and a destination.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [startLat, startLon] = await geocode(startQuery);
      const [endLat, endLon] = await geocode(endQuery);

      setStartCoords([startLat, startLon]);
      setEndCoords([endLat, endLon]);

      // OSRM with alternatives + steps (steps give road-name summaries like "NH 48")
      const directionsRes = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson&alternatives=true&steps=true`
      );
      const directionsData = await directionsRes.json();

      if (directionsData.code !== 'Ok' || !directionsData.routes?.length) {
        throw new Error('Could not find a route between these locations.');
      }

      const parsed = directionsData.routes.slice(0, 3).map((route) => ({
        coords: route.geometry.coordinates.map((c) => [c[1], c[0]]),
        distance: route.distance,
        duration: route.duration,
        summary: route.legs?.[0]?.summary || '',
      }));

      setRoutes(parsed);
      setSelectedRoute(0);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch route. Please try again later.');
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setStartQuery(endQuery);
    setEndQuery(startQuery);
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.round((seconds % 3600) / 60);
    if (hours > 0) return `${hours} hr ${mins} min`;
    return `${mins} min`;
  };

  const formatDistance = (meters) => {
    const km = meters / 1000;
    return km >= 10 ? `${Math.round(km)} km` : `${km.toFixed(1)} km`;
  };

  return (
    <div className="gmaps-layout">
      {/* Full-screen map */}
      <div className="gmaps-map">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <ZoomControl position="bottomright" />

          {/* Alternative routes (gray, underneath) */}
          {routes.map((route, i) =>
            i !== selectedRoute ? (
              <React.Fragment key={`alt-${i}`}>
                <Polyline positions={route.coords} pathOptions={{ color: '#7B8A97', weight: 8, opacity: 0.6 }} eventHandlers={{ click: () => setSelectedRoute(i) }} />
                <Polyline positions={route.coords} pathOptions={{ color: '#BFC8D1', weight: 5, opacity: 1 }} eventHandlers={{ click: () => setSelectedRoute(i) }} />
              </React.Fragment>
            ) : null
          )}

          {/* Selected route (Google blue with darker casing, on top) */}
          {routes[selectedRoute] && (
            <>
              <Polyline positions={routes[selectedRoute].coords} pathOptions={{ color: '#1967D2', weight: 9, opacity: 0.85 }} />
              <Polyline positions={routes[selectedRoute].coords} pathOptions={{ color: '#4285F4', weight: 5.5, opacity: 1 }} />
            </>
          )}

          {/* Time/distance bubbles at each route's midpoint */}
          {routes.map((route, i) => (
            <Marker
              key={`label-${i}`}
              position={route.coords[Math.floor(route.coords.length * (i === selectedRoute ? 0.5 : 0.35))]}
              icon={routeLabelIcon(formatDuration(route.duration), formatDistance(route.distance), i === selectedRoute)}
              eventHandlers={{ click: () => setSelectedRoute(i) }}
              zIndexOffset={i === selectedRoute ? 1000 : 500}
            />
          ))}

          {startCoords && <Marker position={startCoords} icon={originIcon} />}
          {endCoords && <Marker position={endCoords} icon={destinationIcon} />}

          {routes.length > 0 && <MapBounds routes={routes} />}
        </MapContainer>
      </div>

      {/* Floating directions panel (Google Maps style) */}
      <div className="gmaps-panel">
        <div className="gmaps-panel__modes">
          {TRAVEL_MODES.map((mode, i) => (
            <button key={mode.id} type="button" className={`gmaps-mode ${i === 0 ? 'active' : ''}`} title={mode.label}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">{mode.icon}</svg>
            </button>
          ))}
          <button type="button" className="gmaps-close" title="Close directions" onClick={() => window.history.back()}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
          </button>
        </div>

        <form className="gmaps-panel__inputs" onSubmit={handleSearch}>
          <div className="gmaps-inputs__rail">
            <span className="rail-origin" />
            <span className="rail-dots">
              <i /><i /><i />
            </span>
            <svg className="rail-pin" width="14" height="18" viewBox="0 0 27 41" fill="none">
              <path d="M13.5 0C6.04 0 0 6.04 0 13.5 0 23.6 13.5 41 13.5 41S27 23.6 27 13.5C27 6.04 20.96 0 13.5 0z" fill="#EA4335" />
              <circle cx="13.5" cy="13.5" r="4.8" fill="#7B231A" />
            </svg>
          </div>
          <div className="gmaps-inputs__fields">
            <input
              type="text"
              value={startQuery}
              onChange={(e) => setStartQuery(e.target.value)}
              placeholder="Choose starting point"
            />
            <input
              type="text"
              value={endQuery}
              onChange={(e) => setEndQuery(e.target.value)}
              placeholder="Choose destination"
            />
          </div>
          <button type="button" className="gmaps-swap" title="Reverse starting point and destination" onClick={handleSwap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z" /></svg>
          </button>
          <button type="submit" style={{ display: 'none' }} aria-hidden="true" />
        </form>

        <div className="gmaps-adddest">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
          <span>Add destination</span>
        </div>

        <div className="gmaps-leavenow">
          <button type="button" className="gmaps-leavenow__btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>
            Leave now
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z" /></svg>
          </button>
          <span className="gmaps-leavenow__options">Options</span>
        </div>

        <div className="gmaps-panel__searchbar">
          <button type="button" className="gmaps-search-btn" onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </div>

        <div className="gmaps-panel__results">
          {error && <div className="gmaps-error">{error}</div>}

          {loading && (
            <div className="gmaps-loading">
              <div className="gmaps-spinner" />
              <span>Finding the best route…</span>
            </div>
          )}

          {!loading && !error && routes.length === 0 && (
            <div className="gmaps-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#9AA0A6"><path d="M21.71 11.29l-9-9a.996.996 0 00-1.41 0l-9 9a.996.996 0 000 1.41l9 9c.39.39 1.02.39 1.41 0l9-9a.996.996 0 000-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z" /></svg>
              <p>Enter a starting point and destination, then press Search to see driving directions.</p>
            </div>
          )}

          {!loading &&
            routes.map((route, i) => (
              <button
                type="button"
                key={i}
                className={`gmaps-route ${i === selectedRoute ? 'selected' : ''}`}
                onClick={() => setSelectedRoute(i)}
              >
                <div className="gmaps-route__info">
                  <span className="gmaps-route__via">{route.summary ? `via ${route.summary}` : i === 0 ? 'Fastest route' : `Route ${i + 1}`}</span>
                  <span className="gmaps-route__sub">{i === 0 ? 'Fastest route now' : 'Alternative route'}</span>
                  <span className="gmaps-route__details-link">Details<em>Preview</em></span>
                </div>
                <div className="gmaps-route__meta">
                  <span className="gmaps-route__time">{formatDuration(route.duration)}</span>
                  <span className="gmaps-route__dist">{formatDistance(route.distance)}</span>
                </div>
              </button>
            ))}

          {!loading && routes[selectedRoute] && (
            <div className="gmaps-fuel-row">
              <span className="gmaps-fuel-icon">⛽</span>
              <span>Fuel stations available along this route</span>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Full-screen page: hide app chrome */
        nav.navbar, footer.footer, .mobile-menu { display: none !important; }
        body { margin: 0; overflow: hidden; }

        .gmaps-layout {
          position: relative;
          height: 100vh;
          width: 100vw;
          font-family: Roboto, 'Segoe UI', Arial, sans-serif;
          overflow: hidden;
        }

        .gmaps-map {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        /* ---- Floating directions panel ---- */
        .gmaps-panel {
          position: absolute;
          top: 0;
          left: 0;
          width: 408px;
          height: 100%;
          background: #fff;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          box-shadow: 0 0 20px rgba(0,0,0,0.3);
        }

        .gmaps-panel__modes {
          display: flex;
          align-items: center;
          padding: 8px 16px 0;
          border-bottom: 1px solid #E8EAED;
          gap: 4px;
        }

        .gmaps-mode {
          background: none;
          border: none;
          padding: 12px 14px;
          cursor: pointer;
          color: #5F6368;
          border-bottom: 3px solid transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gmaps-mode:hover { color: #202124; }
        .gmaps-mode.active {
          color: #1A73E8;
          border-bottom-color: #1A73E8;
        }

        .gmaps-close {
          margin-left: auto;
          background: none;
          border: none;
          padding: 10px;
          cursor: pointer;
          color: #5F6368;
          border-radius: 50%;
          display: flex;
        }
        .gmaps-close:hover { background: #F1F3F4; }

        /* ---- Inputs ---- */
        .gmaps-panel__inputs {
          display: flex;
          align-items: center;
          padding: 16px 8px 8px 16px;
          gap: 4px;
        }

        .gmaps-inputs__rail {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding-top: 2px;
          width: 20px;
          flex-shrink: 0;
        }

        .rail-origin {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 4px solid #5F6368;
          background: #fff;
          box-sizing: border-box;
        }

        .rail-dots {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin: 4px 0;
        }
        .rail-dots i {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #BDC1C6;
        }

        .gmaps-inputs__fields {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .gmaps-inputs__fields input {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #DADCE0;
          border-radius: 4px;
          padding: 10px 12px;
          font-size: 15px;
          color: #202124;
          outline: none;
          background: #fff;
          font-family: inherit;
        }
        .gmaps-inputs__fields input:hover { background: #F8F9FA; }
        .gmaps-inputs__fields input:focus {
          border-color: #1A73E8;
          box-shadow: 0 0 0 1px #1A73E8;
          background: #fff;
        }

        .gmaps-swap {
          background: none;
          border: none;
          padding: 10px;
          cursor: pointer;
          color: #5F6368;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
        }
        .gmaps-swap:hover { background: #F1F3F4; }

        .gmaps-adddest {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 16px 8px 19px;
          color: #5F6368;
          font-size: 14px;
          cursor: pointer;
        }
        .gmaps-adddest:hover { color: #202124; }

        .gmaps-leavenow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 16px 12px;
        }

        .gmaps-leavenow__btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 1px solid #DADCE0;
          border-radius: 18px;
          padding: 7px 12px;
          font-size: 14px;
          color: #3C4043;
          font-family: inherit;
          cursor: pointer;
        }
        .gmaps-leavenow__btn:hover { background: #F8F9FA; }

        .gmaps-leavenow__options {
          font-size: 14px;
          font-weight: 500;
          color: #1A73E8;
          cursor: pointer;
        }

        .gmaps-panel__searchbar {
          padding: 4px 16px 14px;
          border-bottom: 1px solid #E8EAED;
        }

        .gmaps-search-btn {
          width: 100%;
          background: #1A73E8;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 10px;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          letter-spacing: 0.25px;
        }
        .gmaps-search-btn:hover { background: #1765CC; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
        .gmaps-search-btn:disabled { background: #A8C7FA; cursor: default; box-shadow: none; }

        /* ---- Results ---- */
        .gmaps-panel__results {
          flex: 1;
          overflow-y: auto;
        }

        .gmaps-error {
          margin: 16px;
          padding: 12px 16px;
          background: #FCE8E6;
          color: #C5221F;
          border-radius: 8px;
          font-size: 14px;
        }

        .gmaps-loading {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 16px;
          color: #5F6368;
          font-size: 14px;
        }

        .gmaps-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid #E8EAED;
          border-top-color: #1A73E8;
          border-radius: 50%;
          animation: gmaps-spin 0.8s linear infinite;
        }
        @keyframes gmaps-spin { to { transform: rotate(360deg); } }

        .gmaps-empty {
          padding: 48px 32px;
          text-align: center;
          color: #5F6368;
          font-size: 14px;
          line-height: 1.5;
        }
        .gmaps-empty svg { margin-bottom: 12px; }

        .gmaps-route {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          width: 100%;
          padding: 16px;
          background: none;
          border: none;
          border-bottom: 1px solid #E8EAED;
          border-left: 4px solid transparent;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
        }
        .gmaps-route:hover { background: #F8F9FA; }
        .gmaps-route.selected {
          background: #E8F0FE;
          border-left-color: #1A73E8;
        }

        .gmaps-route__info {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }

        .gmaps-route__via {
          font-size: 16px;
          font-weight: 500;
          color: #202124;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 240px;
        }

        .gmaps-route__sub {
          font-size: 12px;
          color: #5F6368;
        }

        .gmaps-route__details-link {
          font-size: 13px;
          color: #1A73E8;
          font-weight: 500;
          margin-top: 6px;
        }
        .gmaps-route__details-link em {
          font-style: normal;
          margin-left: 20px;
        }

        .gmaps-route__meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          flex-shrink: 0;
        }

        .gmaps-route__time {
          font-size: 16px;
          font-weight: 500;
          color: #188038;
          white-space: nowrap;
        }

        .gmaps-route__dist {
          font-size: 13px;
          color: #5F6368;
        }

        .gmaps-fuel-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          font-size: 13px;
          color: #5F6368;
        }
        .gmaps-fuel-icon { font-size: 16px; }

        /* Leaflet tweaks to feel like Google Maps */
        .gm-marker { background: none; border: none; }

        .gm-route-label {
          display: inline-flex;
          flex-direction: column;
          background: #fff;
          border-radius: 6px;
          padding: 5px 10px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.35);
          white-space: nowrap;
          font-family: Roboto, 'Segoe UI', Arial, sans-serif;
          line-height: 1.3;
          cursor: pointer;
          transform: translate(-50%, -120%);
        }
        .gm-route-label b {
          font-size: 13px;
          font-weight: 700;
          color: #5F6368;
        }
        .gm-route-label span {
          font-size: 11.5px;
          color: #80868B;
        }
        .gm-route-label.selected b { color: #202124; }
        .gm-route-label.selected { box-shadow: 0 2px 6px rgba(0,0,0,0.45); }
        .gm-origin-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          border: 4px solid #414549;
          box-sizing: border-box;
          box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3) !important;
          border-radius: 2px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          width: 40px !important;
          height: 40px !important;
          line-height: 40px !important;
          font-size: 18px !important;
          color: #666 !important;
          border: none !important;
        }
        .leaflet-control-zoom a:first-child { border-bottom: 1px solid #E6E6E6 !important; }

        /* ---- Mobile ---- */
        @media (max-width: 768px) {
          .gmaps-panel {
            width: 100%;
            height: auto;
            max-height: 60vh;
            border-radius: 0 0 16px 16px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.25);
          }
          .gmaps-route__via { max-width: 55vw; }
          .gmaps-empty { padding: 24px; }
          .gmaps-empty svg { display: none; }
        }
      ` }} />
    </div>
  );
}
