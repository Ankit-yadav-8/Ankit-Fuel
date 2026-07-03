import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// India bounding box for geocoding bias (minLon,minLat,maxLon,maxLat)
const INDIA_BBOX = '68.1,6.5,97.4,37.1';

/* ---------- Fuzzy place matching (approximates Google's spell correction) ---------- */

// Edit distance with adjacent-transposition support ("kahtu" vs "khatu" = 1)
function editDistance(a, b) {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const d = Array.from({ length: m + 1 }, (_, i) => {
    const row = new Array(n + 1).fill(0);
    row[0] = i;
    return row;
  });
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[m][n];
}

// 0..1: how well a candidate place matches what the user typed
function matchScore(query, candidateText) {
  const qTokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  const cTokens = candidateText.toLowerCase().split(/[\s,]+/).filter(Boolean);
  if (!qTokens.length || !cTokens.length) return 0;
  let total = 0;
  for (const q of qTokens) {
    let best = 0;
    for (const c of cTokens) {
      let sim = 1 - editDistance(q, c) / Math.max(q.length, c.length);
      if (c.startsWith(q)) sim = Math.max(sim, 0.9);
      if (sim > best) best = sim;
    }
    total += best;
  }
  return total / qTokens.length;
}

// Spelling variants via adjacent-letter swaps per word ("kahtu shayam" -> "khatu shayam")
function spellingVariants(query, max = 6) {
  const tokens = query.toLowerCase().split(/\s+/);
  const variants = [];
  tokens.forEach((tok, ti) => {
    if (tok.length < 4) return;
    for (let i = 0; i < tok.length - 1 && variants.length < max; i++) {
      if (tok[i] === tok[i + 1]) continue;
      const swapped = tok.slice(0, i) + tok[i + 1] + tok[i] + tok.slice(i + 2);
      variants.push(tokens.map((t, j) => (j === ti ? swapped : t)).join(' '));
    }
  });
  return variants;
}

async function photonSearch(query, limit = 8) {
  const res = await fetch(
    `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=${limit}&lang=en&bbox=${INDIA_BBOX}`
  );
  const data = await res.json();
  return (data.features || [])
    .map((f) => {
      const p = f.properties || {};
      const secondary = [p.street, p.district, p.city, p.county, p.state]
        .filter((v) => v && v !== p.name)
        .filter((v, i, a) => a.indexOf(v) === i)
        .join(', ');
      return {
        name: p.name || '',
        secondary,
        lat: f.geometry.coordinates[1],
        lon: f.geometry.coordinates[0],
      };
    })
    .filter((it) => it.name);
}

// Search Photon, score results, and retry with corrected spellings when they look wrong.
// Returns candidates sorted best-first, each with a .score.
async function findPlaces(query, goodScore = 0.65) {
  let candidates = [];
  try {
    candidates = await photonSearch(query);
  } catch {
    /* keep going — variants may still work */
  }
  candidates.forEach((c) => {
    c.score = matchScore(query, `${c.name} ${c.secondary}`);
  });
  let best = candidates.length ? Math.max(...candidates.map((c) => c.score)) : 0;

  if (best < goodScore) {
    for (const variant of spellingVariants(query)) {
      try {
        const more = await photonSearch(variant, 4);
        more.forEach((c) => {
          // small penalty so exact-spelling matches win ties
          c.score = matchScore(variant, `${c.name} ${c.secondary}`) - 0.05;
        });
        candidates = candidates.concat(more);
        if (more.length) best = Math.max(best, ...more.map((c) => c.score));
        if (best >= 0.85) break;
      } catch {
        /* try next variant */
      }
    }
  }

  const seen = new Set();
  return candidates
    .sort((a, b) => b.score - a.score)
    .filter((c) => {
      const key = `${c.name}|${c.secondary}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

// Resolve free text to one place; throws (with .didYouMean when we have a guess)
// instead of routing to a low-confidence match.
async function resolvePlace(query) {
  const candidates = await findPlaces(query);
  const best = candidates[0];
  if (best && best.score >= 0.6) return best;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&q=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    if (data?.length) {
      return {
        name: data[0].display_name.split(',')[0],
        secondary: '',
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        score: 1,
      };
    }
  } catch {
    /* fall through */
  }
  const err = new Error(`Could not find "${query}". Try picking a place from the suggestions.`);
  if (best && best.score >= 0.35) err.didYouMean = best;
  throw err;
}

// Google Maps style origin marker: white circle with dark ring
const originIcon = L.divIcon({
  className: 'gm-marker',
  html: '<div class="gm-origin-dot"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Small gray dot for intermediate stops
const stopIcon = L.divIcon({
  className: 'gm-marker',
  html: '<div class="gm-stop-dot"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
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

// Blue "my location" dot like Google Maps
const myLocationIcon = L.divIcon({
  className: 'gm-marker',
  html: '<div class="gm-mylocation"><div class="gm-mylocation__pulse"></div><div class="gm-mylocation__dot"></div></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
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

function MapRefCapture({ mapRef }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
}

// Free OSRM servers per travel mode (FOSSGIS instances, no API key)
const OSRM_BASE = {
  drive: 'https://routing.openstreetmap.de/routed-car',
  bike: 'https://routing.openstreetmap.de/routed-bike',
  walk: 'https://routing.openstreetmap.de/routed-foot',
};

const TRAVEL_MODES = [
  { id: 'drive', label: 'Driving', icon: <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" /> },
  { id: 'transit', label: 'Transit', icon: <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H6V6h5v5zm5.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6h-5V6h5v5z" /> },
  { id: 'walk', label: 'Walking', icon: <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7" /> },
  { id: 'bike', label: 'Cycling', icon: <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" /> },
];

let fieldIdCounter = 10;

export default function RoutePlanner() {
  // Ordered stops: first = origin, last = destination, middle = waypoints
  const [fields, setFields] = useState([
    { id: 1, text: 'Delhi', coords: null },
    { id: 2, text: 'Jaipur', coords: null },
  ]);
  const [travelMode, setTravelMode] = useState('drive');
  const [routes, setRoutes] = useState([]); // [{ coords, distance, duration, summary }]
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [stopMarkers, setStopMarkers] = useState([]); // resolved [lat,lon] per stop
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [didYouMean, setDidYouMean] = useState(null); // { fieldIdx, item }

  // Autocomplete state
  const [suggestions, setSuggestions] = useState({ fieldIdx: -1, items: [] });
  const suggestTimer = useRef(null);
  const suggestSeq = useRef(0);
  const searchSeq = useRef(0);

  const [myLocation, setMyLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [mapType, setMapType] = useState('road'); // 'road' | 'satellite'
  const mapRef = useRef(null);
  const fieldsRef = useRef(fields);
  fieldsRef.current = fields;

  const defaultCenter = [20.5937, 78.9629];
  const defaultZoom = 5;

  // Load the default route on first open so the page never looks empty
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If location permission is already granted, show the blue dot right away
  useEffect(() => {
    if (!navigator.permissions?.query || !navigator.geolocation) return;
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((status) => {
        if (status.state === 'granted') {
          navigator.geolocation.getCurrentPosition(
            (pos) => setMyLocation([pos.coords.latitude, pos.coords.longitude]),
            () => {},
            { enableHighAccuracy: true, timeout: 15000 }
          );
        }
      })
      .catch(() => {});
  }, []);

  // Re-route automatically when the travel mode changes
  const firstModeRender = useRef(true);
  useEffect(() => {
    if (firstModeRender.current) {
      firstModeRender.current = false;
      return;
    }
    if (travelMode !== 'transit') handleSearch(null, travelMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelMode]);

  /* ---------- Autocomplete (Photon: free, typo-tolerant) ---------- */

  const fetchSuggestions = async (fieldIdx, query) => {
    const seq = ++suggestSeq.current;
    try {
      // findPlaces retries corrected spellings when results score poorly
      const items = await findPlaces(query, 0.5);
      // Discard stale responses: a newer fetch started, or the input text changed
      if (seq !== suggestSeq.current) return;
      if (fieldsRef.current[fieldIdx]?.text.trim() !== query) return;
      setSuggestions({ fieldIdx, items: items.slice(0, 8) });
    } catch {
      /* suggestions are best-effort */
    }
  };

  const updateField = (idx, text) => {
    setFields((prev) => prev.map((f, i) => (i === idx ? { ...f, text, coords: null } : f)));
    setDidYouMean(null);
    clearTimeout(suggestTimer.current);
    if (text.trim().length >= 2) {
      suggestTimer.current = setTimeout(() => fetchSuggestions(idx, text.trim()), 250);
    } else {
      setSuggestions({ fieldIdx: -1, items: [] });
    }
  };

  const selectSuggestion = (idx, item) => {
    setFields((prev) =>
      prev.map((f, i) =>
        i === idx
          ? { ...f, text: item.secondary ? `${item.name}, ${item.secondary.split(', ')[0]}` : item.name, coords: [item.lat, item.lon] }
          : f
      )
    );
    setSuggestions({ fieldIdx: -1, items: [] });
  };

  const geoErrorMessage = (err) =>
    err && err.code === 1
      ? 'Location permission is blocked. Click the lock icon in the address bar, allow Location, then try again.'
      : 'Could not determine your location. Make sure GPS/location services are turned on.';

  const useMyLocationFor = (idx) => {
    setSuggestions({ fieldIdx: -1, items: [] });
    if (!navigator.geolocation) {
      setError('Location is not supported by this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude];
        setMyLocation(loc);
        setFields((prev) => prev.map((f, i) => (i === idx ? { ...f, text: 'Your location', coords: loc } : f)));
      },
      (err) => setError(geoErrorMessage(err)),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const applyDidYouMean = () => {
    if (!didYouMean) return;
    selectSuggestion(didYouMean.fieldIdx, didYouMean.item);
    setDidYouMean(null);
    setError('');
    // Let React commit the field update before re-searching
    setTimeout(() => handleSearch(), 0);
  };

  const closeSuggestions = () => {
    // Delay so a click on a suggestion registers before the dropdown unmounts
    setTimeout(() => setSuggestions({ fieldIdx: -1, items: [] }), 200);
  };

  /* ---------- Stops management ---------- */

  const addDestination = () => {
    if (fields.length >= 5) return;
    setFields((prev) => [...prev, { id: ++fieldIdCounter, text: '', coords: null }]);
  };

  const removeField = (idx) => {
    setFields((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSwap = () => {
    setFields((prev) => [...prev].reverse());
  };

  /* ---------- Geolocation via "Leave now" ---------- */

  const handleLeaveNow = () => {
    if (!navigator.geolocation) {
      setError('Location is not supported by this browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude];
        setMyLocation(loc);
        setLocating(false);
        if (mapRef.current) mapRef.current.flyTo(loc, 16, { duration: 1.2 });
      },
      (err) => {
        setLocating(false);
        setError(geoErrorMessage(err));
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  /* ---------- Geocoding + routing ---------- */

  const handleSearch = async (e, mode = travelMode) => {
    if (e) e.preventDefault();
    const activeIdx = [];
    fieldsRef.current.forEach((f, i) => {
      if (f.text.trim() !== '') activeIdx.push(i);
    });
    if (activeIdx.length < 2) {
      setError('Please enter a starting point and a destination.');
      return;
    }
    if (mode === 'transit') {
      setRoutes([]);
      setError('');
      return;
    }

    // Supersede any search that is still running (double clicks, StrictMode
    // double-mount, mode switches) so a stale search can't write its results
    const seq = ++searchSeq.current;
    const stale = () => seq !== searchSeq.current;

    setLoading(true);
    setError('');
    setDidYouMean(null);
    // Invalidate any in-flight autocomplete fetch so it can't reopen the dropdown
    ++suggestSeq.current;
    clearTimeout(suggestTimer.current);
    setSuggestions({ fieldIdx: -1, items: [] });

    try {
      // Resolve every stop (coords picked from suggestions are used as-is)
      const resolved = [];
      for (const i of activeIdx) {
        const f = fieldsRef.current[i];
        if (f.coords) {
          resolved.push(f.coords);
          continue;
        }
        let place;
        try {
          place = await resolvePlace(f.text.trim());
        } catch (err) {
          if (err.didYouMean && !stale()) setDidYouMean({ fieldIdx: i, item: err.didYouMean });
          throw err;
        }
        if (stale()) return;
        resolved.push([place.lat, place.lon]);
        // Show the resolved place in the input, like Google rewrites your query
        const label = place.secondary ? `${place.name}, ${place.secondary.split(', ')[0]}` : place.name;
        setFields((prev) =>
          prev.map((pf, pi) => (pi === i ? { ...pf, text: label, coords: [place.lat, place.lon] } : pf))
        );
      }

      const coordStr = resolved.map(([lat, lon]) => `${lon},${lat}`).join(';');
      // OSRM only supports alternatives for simple A→B routes
      const wantAlternatives = resolved.length === 2;
      const query = `overview=full&geometries=geojson&steps=true${wantAlternatives ? '&alternatives=true' : ''}`;

      let directionsData;
      try {
        const res = await fetch(`${OSRM_BASE[mode]}/route/v1/driving/${coordStr}?${query}`);
        directionsData = await res.json();
      } catch {
        directionsData = null;
      }
      // Fallback to the OSRM demo server for driving if FOSSGIS is down
      if ((!directionsData || directionsData.code !== 'Ok') && mode === 'drive') {
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordStr}?${query}`);
        directionsData = await res.json();
      }

      if (!directionsData || directionsData.code !== 'Ok' || !directionsData.routes?.length) {
        throw new Error('Could not find a route between these locations.');
      }
      if (stale()) return;

      const parsed = directionsData.routes.slice(0, 3).map((route) => ({
        coords: route.geometry.coordinates.map((c) => [c[1], c[0]]),
        distance: route.distance,
        duration: route.duration,
        summary: route.legs?.map((l) => l.summary).filter(Boolean).join(', ') || '',
      }));

      // Update markers and routes together so the map never shows a mismatched pair
      setStopMarkers(resolved);
      setRoutes(parsed);
      setSelectedRoute(0);
    } catch (err) {
      console.error(err);
      if (stale()) return;
      setError(err.message || 'Failed to fetch route. Please try again later.');
      setRoutes([]);
    } finally {
      if (!stale()) setLoading(false);
    }
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

  const fieldIconFor = (idx) => {
    if (idx === 0) return <span className="rail-origin" />;
    if (idx === fields.length - 1) {
      return (
        <svg width="14" height="18" viewBox="0 0 27 41" fill="none">
          <path d="M13.5 0C6.04 0 0 6.04 0 13.5 0 23.6 13.5 41 13.5 41S27 23.6 27 13.5C27 6.04 20.96 0 13.5 0z" fill="#EA4335" />
          <circle cx="13.5" cy="13.5" r="4.8" fill="#7B231A" />
        </svg>
      );
    }
    return <span className="rail-stop" />;
  };

  return (
    <div className="gmaps-layout">
      {/* Full-screen map */}
      <div className="gmaps-map">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          maxZoom={20}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          {/* Google's own tiles: full street/POI/place detail identical to Google Maps */}
          {mapType === 'road' ? (
            <TileLayer
              key="road"
              attribution='&copy; Google Maps'
              url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=en"
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              maxZoom={20}
            />
          ) : (
            <TileLayer
              key="satellite"
              attribution='&copy; Google Maps'
              url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}&hl=en"
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              maxZoom={20}
            />
          )}
          <ZoomControl position="bottomright" />
          <MapRefCapture mapRef={mapRef} />

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

          {/* Stop markers: origin dot, gray waypoints, red destination pin */}
          {stopMarkers.map((pos, i) => (
            <Marker
              key={`stop-${i}`}
              position={pos}
              icon={i === 0 ? originIcon : i === stopMarkers.length - 1 ? destinationIcon : stopIcon}
            />
          ))}

          {myLocation && <Marker position={myLocation} icon={myLocationIcon} zIndexOffset={2000} />}

          {routes.length > 0 && <MapBounds routes={routes} />}
        </MapContainer>

        {/* Google-style Map/Satellite toggle (bottom-left) */}
        <button
          type="button"
          className={`gmaps-layers ${mapType === 'satellite' ? 'is-satellite' : ''}`}
          onClick={() => setMapType(mapType === 'road' ? 'satellite' : 'road')}
          title={mapType === 'road' ? 'Switch to satellite view' : 'Switch to map view'}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z" /></svg>
          <span>{mapType === 'road' ? 'Satellite' : 'Map'}</span>
        </button>
      </div>

      {/* Floating directions panel (Google Maps style) */}
      <div className="gmaps-panel">
        <div className="gmaps-panel__modes">
          {TRAVEL_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={`gmaps-mode ${travelMode === mode.id ? 'active' : ''}`}
              title={mode.label}
              onClick={() => setTravelMode(mode.id)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">{mode.icon}</svg>
            </button>
          ))}
          <button type="button" className="gmaps-close" title="Close directions" onClick={() => window.history.back()}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
          </button>
        </div>

        <form className="gmaps-panel__inputs" onSubmit={handleSearch}>
          <div className="gmaps-inputs__fields">
            {fields.map((field, idx) => (
              <div className="gmaps-field-row" key={field.id}>
                <span className="gmaps-field-row__icon">{fieldIconFor(idx)}</span>
                <div className="gmaps-field-row__inputwrap">
                  <input
                    type="text"
                    value={field.text}
                    onChange={(e) => updateField(idx, e.target.value)}
                    onFocus={() => {
                      if (field.text.trim().length >= 2 && field.coords === null) {
                        fetchSuggestions(idx, field.text.trim());
                      } else {
                        setSuggestions({ fieldIdx: idx, items: [] });
                      }
                    }}
                    onBlur={closeSuggestions}
                    placeholder={idx === 0 ? 'Choose starting point' : 'Choose destination'}
                    autoComplete="off"
                  />
                  {suggestions.fieldIdx === idx && (
                    <div className="gmaps-suggest">
                      {idx === 0 && (
                        <button type="button" className="gmaps-suggest__item gmaps-suggest__mylocation" onMouseDown={(e) => { e.preventDefault(); useMyLocationFor(idx); }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1A73E8"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" /></svg>
                          <span className="gmaps-suggest__name">Your location</span>
                        </button>
                      )}
                      {suggestions.items.map((item, si) => (
                        <button type="button" className="gmaps-suggest__item" key={si} onMouseDown={(e) => { e.preventDefault(); selectSuggestion(idx, item); }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#5F6368"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" /></svg>
                          <span className="gmaps-suggest__text">
                            <span className="gmaps-suggest__name">{item.name}</span>
                            {item.secondary && <span className="gmaps-suggest__secondary">{item.secondary}</span>}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {fields.length > 2 && (
                  <button type="button" className="gmaps-field-row__remove" title="Remove stop" onClick={() => removeField(idx)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" className="gmaps-swap" title="Reverse starting point and destination" onClick={handleSwap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z" /></svg>
          </button>
          <button type="submit" style={{ display: 'none' }} aria-hidden="true" />
        </form>

        {fields.length < 5 && (
          <button type="button" className="gmaps-adddest" onClick={addDestination}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
            <span>Add destination</span>
          </button>
        )}

        <div className="gmaps-leavenow">
          <button type="button" className="gmaps-leavenow__btn" onClick={handleLeaveNow} title="Show my current location on the map">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>
            {locating ? 'Locating…' : 'Leave now'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z" /></svg>
          </button>
          <span className="gmaps-leavenow__options">Options</span>
        </div>

        <div className="gmaps-panel__searchbar">
          <button type="button" className="gmaps-search-btn" onClick={() => handleSearch()} disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </div>

        <div className="gmaps-panel__results">
          {error && (
            <div className="gmaps-error">
              {error}
              {didYouMean && (
                <button type="button" className="gmaps-didyoumean" onClick={applyDidYouMean}>
                  Did you mean <b>{didYouMean.item.name}{didYouMean.item.secondary ? `, ${didYouMean.item.secondary.split(', ').slice(-1)[0]}` : ''}</b>?
                </button>
              )}
            </div>
          )}

          {loading && (
            <div className="gmaps-loading">
              <div className="gmaps-spinner" />
              <span>Finding the best route…</span>
            </div>
          )}

          {!loading && travelMode === 'transit' && (
            <div className="gmaps-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#9AA0A6"><path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H6V6h5v5zm5.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6h-5V6h5v5z" /></svg>
              <p>Transit directions aren't available yet. Try Driving, Walking or Cycling.</p>
            </div>
          )}

          {!loading && !error && travelMode !== 'transit' && routes.length === 0 && (
            <div className="gmaps-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#9AA0A6"><path d="M21.71 11.29l-9-9a.996.996 0 00-1.41 0l-9 9a.996.996 0 000 1.41l9 9c.39.39 1.02.39 1.41 0l9-9a.996.996 0 000-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z" /></svg>
              <p>Enter a starting point and destination, then press Search to see directions.</p>
            </div>
          )}

          {!loading && travelMode !== 'transit' &&
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

          {!loading && travelMode === 'drive' && routes[selectedRoute] && (
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

        /* Map/Satellite toggle like Google's Layers button */
        .gmaps-layers {
          position: absolute;
          bottom: 24px;
          left: 428px;
          z-index: 999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          width: 74px;
          height: 74px;
          background: #fff;
          color: #3C4043;
          border: 2px solid #fff;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: 500;
        }
        .gmaps-layers:hover { color: #1A73E8; }
        .gmaps-layers.is-satellite {
          background: #202124;
          color: #fff;
        }
        .gmaps-layers.is-satellite:hover { color: #8AB4F8; }

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
          align-items: flex-start;
          padding: 16px 8px 4px 8px;
          gap: 2px;
        }

        .gmaps-inputs__fields {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 0;
        }

        .gmaps-field-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .gmaps-field-row__icon {
          width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .rail-origin {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 4px solid #5F6368;
          background: #fff;
          box-sizing: border-box;
          display: block;
        }

        .rail-stop {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 3px solid #9AA0A6;
          background: #fff;
          box-sizing: border-box;
          display: block;
        }

        .gmaps-field-row__inputwrap {
          position: relative;
          flex: 1;
          min-width: 0;
        }

        .gmaps-field-row__inputwrap input {
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
        .gmaps-field-row__inputwrap input:hover { background: #F8F9FA; }
        .gmaps-field-row__inputwrap input:focus {
          border-color: #1A73E8;
          box-shadow: 0 0 0 1px #1A73E8;
          background: #fff;
        }

        .gmaps-field-row__remove {
          background: none;
          border: none;
          padding: 6px;
          cursor: pointer;
          color: #9AA0A6;
          border-radius: 50%;
          display: flex;
          flex-shrink: 0;
        }
        .gmaps-field-row__remove:hover { background: #F1F3F4; color: #202124; }

        /* ---- Autocomplete dropdown ---- */
        .gmaps-suggest {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.28);
          z-index: 2000;
          overflow: hidden;
          padding: 6px 0;
        }

        .gmaps-suggest__item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 9px 14px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
        }
        .gmaps-suggest__item:hover { background: #F1F3F4; }
        .gmaps-suggest__item svg { flex-shrink: 0; }

        .gmaps-suggest__text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .gmaps-suggest__name {
          font-size: 14px;
          color: #202124;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .gmaps-suggest__mylocation .gmaps-suggest__name { color: #1A73E8; font-weight: 500; }

        .gmaps-suggest__secondary {
          font-size: 12px;
          color: #5F6368;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .gmaps-swap {
          background: none;
          border: none;
          padding: 10px;
          margin-top: 14px;
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
          padding: 10px 16px 8px 17px;
          color: #5F6368;
          font-size: 14px;
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
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

        .gmaps-didyoumean {
          display: block;
          margin-top: 10px;
          padding: 8px 14px;
          background: #fff;
          border: 1px solid #DADCE0;
          border-radius: 18px;
          color: #1A73E8;
          font-size: 14px;
          font-family: inherit;
          cursor: pointer;
          text-align: left;
        }
        .gmaps-didyoumean:hover { background: #F8F9FA; box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
        .gmaps-didyoumean b { font-weight: 600; }

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

        .gm-origin-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          border: 4px solid #414549;
          box-sizing: border-box;
          box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }

        .gm-stop-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fff;
          border: 4px solid #9AA0A6;
          box-sizing: border-box;
          box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }

        .gm-mylocation {
          position: relative;
          width: 22px;
          height: 22px;
        }
        .gm-mylocation__dot {
          position: absolute;
          inset: 3px;
          border-radius: 50%;
          background: #4285F4;
          border: 2.5px solid #fff;
          box-sizing: border-box;
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
        .gm-mylocation__pulse {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: rgba(66,133,244,0.25);
          animation: gm-pulse 2s ease-out infinite;
        }
        @keyframes gm-pulse {
          0% { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }

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
          .gmaps-layers {
            left: 12px;
            bottom: 24px;
            width: 60px;
            height: 60px;
          }
        }
      ` }} />
    </div>
  );
}
