import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

// Create custom DivIcons with Tailwind CSS styling
const createPulsingUserIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="display:flex; align-items:center; justify-content:center; width:36px; height:36px; position:relative;">
        <div style="position:absolute; width:28px; height:28px; border-radius:50%; background-color:#3b82f6; opacity:0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width:16px; height:16px; border-radius:50%; background-color:#2563eb; border:3px solid #ffffff; box-shadow:0 4px 10px rgba(0,0,0,0.3); position:relative; z-index:2;"></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

const createPickupIcon = () => {
  return L.divIcon({
    className: 'custom-pickup-marker',
    html: `
      <div style="display:flex; flex-direction:column; align-items:center;">
        <div style="background-color:#16a34a; color:#ffffff; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid #ffffff; box-shadow:0 4px 12px rgba(22,163,74,0.5);">
          <svg style="width:20px; height:20px; fill:currentColor;" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
        </div>
        <div style="background:#16a34a; color:#fff; font-size:10px; font-weight:700; padding:1px 6px; border-radius:4px; margin-top:2px; box-shadow:0 2px 5px rgba(0,0,0,0.2);">PICKUP</div>
      </div>
    `,
    iconSize: [44, 52],
    iconAnchor: [22, 36],
  });
};

const createDestinationIcon = () => {
  return L.divIcon({
    className: 'custom-destination-marker',
    html: `
      <div style="display:flex; flex-direction:column; align-items:center;">
        <div style="background-color:#0f172a; color:#ffffff; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid #ffffff; box-shadow:0 4px 12px rgba(15,23,42,0.5);">
          <svg style="width:18px; height:18px; fill:currentColor;" viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z"/></svg>
        </div>
        <div style="background:#0f172a; color:#fff; font-size:10px; font-weight:700; padding:1px 6px; border-radius:4px; margin-top:2px; box-shadow:0 2px 5px rgba(0,0,0,0.2);">DROP</div>
      </div>
    `,
    iconSize: [44, 52],
    iconAnchor: [22, 36],
  });
};

const createVehicleIcon = (vehicleType = 'car', heading = 0) => {
  let iconSvg = '';
  if (vehicleType === 'bike') {
    iconSvg = `<svg style="width:22px; height:22px; fill:#000;" viewBox="0 0 24 24"><path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm14-8.5c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm-8.2-7.5l2.2-3.8 2.8 2.8h4.2v-2h-3l-2-2-1.7 1.7-2.3-1.2-2.2 3.8h4z"/></svg>`;
  } else if (vehicleType === 'auto') {
    iconSvg = `<svg style="width:24px; height:24px; fill:#000;" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/></svg>`;
  } else {
    iconSvg = `<svg style="width:24px; height:24px; fill:#000;" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/></svg>`;
  }

  return L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div style="position:relative; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; width:40px; height:40px; background-color:#fbbf24; border-radius:50%; border:3px solid #ffffff; box-shadow:0 4px 14px rgba(0,0,0,0.35); display:flex; align-items:center; justify-content:center; transform: rotate(${heading}deg); transition: transform 0.4s ease-out;">
          ${iconSvg}
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
};

const LiveMap = ({
  pickupCoords,
  destinationCoords,
  routeCoordinates = [],
  routes = [],
  selectedRouteIndex = 0,
  onSelectRoute,
  captainLocation = null,
  otherCaptains = [],
  userLocation = null,
  vehicleType = 'car',
  interactive = true,
  className = 'h-full w-full'
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  // Marker & Polyline Layers refs
  const userMarkerRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const captainMarkerRef = useRef(null);
  const otherCaptainsLayerRef = useRef(null);
  const polylineLayerRef = useRef(null);
  const polylineOutlineRef = useRef(null);
  const alternativeRoutesLayerRef = useRef(null);

  const [currentCoords, setCurrentCoords] = useState(userLocation || { latitude: 12.9716, longitude: 77.5946 });

  // 1. Get browser geolocation on mount
  useEffect(() => {
    if (userLocation) {
      setCurrentCoords(userLocation);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setCurrentCoords(coords);
          if (mapInstanceRef.current && !pickupCoords && !destinationCoords && !captainLocation) {
            mapInstanceRef.current.setView([coords.latitude, coords.longitude], 15);
          }
        },
        (err) => {
          console.warn('Geolocation access denied or unavailable, using fallback coordinates.', err);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [userLocation]);

  // 2. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialLat = currentCoords?.latitude || 12.9716;
    const initialLng = currentCoords?.longitude || 77.5946;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
      dragging: interactive,
      touchZoom: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive
    });

    // Clean OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
    }).addTo(map);

    otherCaptainsLayerRef.current = L.layerGroup().addTo(map);
    alternativeRoutesLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 3. Update User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !currentCoords) return;

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker([currentCoords.latitude, currentCoords.longitude], {
        icon: createPulsingUserIcon(),
        zIndexOffset: 100
      }).addTo(map);
    } else {
      userMarkerRef.current.setLatLng([currentCoords.latitude, currentCoords.longitude]);
    }
  }, [currentCoords]);

  // 4. Update Pickup & Destination Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Pickup Marker
    if (pickupCoords && pickupCoords.latitude && pickupCoords.longitude) {
      if (!pickupMarkerRef.current) {
        pickupMarkerRef.current = L.marker([pickupCoords.latitude, pickupCoords.longitude], {
          icon: createPickupIcon(),
          zIndexOffset: 500
        }).addTo(map);
      } else {
        pickupMarkerRef.current.setLatLng([pickupCoords.latitude, pickupCoords.longitude]);
      }
    } else if (pickupMarkerRef.current) {
      map.removeLayer(pickupMarkerRef.current);
      pickupMarkerRef.current = null;
    }

    // Destination Marker
    if (destinationCoords && destinationCoords.latitude && destinationCoords.longitude) {
      if (!destinationMarkerRef.current) {
        destinationMarkerRef.current = L.marker([destinationCoords.latitude, destinationCoords.longitude], {
          icon: createDestinationIcon(),
          zIndexOffset: 500
        }).addTo(map);
      } else {
        destinationMarkerRef.current.setLatLng([destinationCoords.latitude, destinationCoords.longitude]);
      }
    } else if (destinationMarkerRef.current) {
      map.removeLayer(destinationMarkerRef.current);
      destinationMarkerRef.current = null;
    }
  }, [pickupCoords, destinationCoords]);

  // 5. Update Captain Vehicle Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (captainLocation && captainLocation.latitude && captainLocation.longitude) {
      const heading = captainLocation.heading || 0;
      const vType = captainLocation.vehicleType || vehicleType || 'car';

      if (!captainMarkerRef.current) {
        captainMarkerRef.current = L.marker([captainLocation.latitude, captainLocation.longitude], {
          icon: createVehicleIcon(vType, heading),
          zIndexOffset: 1000
        }).addTo(map);
      } else {
        captainMarkerRef.current.setLatLng([captainLocation.latitude, captainLocation.longitude]);
        captainMarkerRef.current.setIcon(createVehicleIcon(vType, heading));
      }
    } else if (captainMarkerRef.current) {
      map.removeLayer(captainMarkerRef.current);
      captainMarkerRef.current = null;
    }
  }, [captainLocation, vehicleType]);

  // 6. Update Nearby Active Captains
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !otherCaptainsLayerRef.current) return;

    otherCaptainsLayerRef.current.clearLayers();

    if (Array.isArray(otherCaptains) && otherCaptains.length > 0) {
      otherCaptains.forEach(c => {
        const lat = c.location?.coordinates ? c.location.coordinates[1] : c.latitude;
        const lng = c.location?.coordinates ? c.location.coordinates[0] : c.longitude;
        if (lat && lng) {
          const vType = c.vehicle?.vehicleType || c.vehicleType || 'car';
          const marker = L.marker([lat, lng], {
            icon: createVehicleIcon(vType, 0),
            zIndexOffset: 200
          });
          otherCaptainsLayerRef.current.addLayer(marker);
        }
      });
    }
  }, [otherCaptains]);

  // 7. Render Smart Multi-Route & Active Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing main polyline and alternative lines
    if (polylineLayerRef.current) {
      map.removeLayer(polylineLayerRef.current);
      polylineLayerRef.current = null;
    }
    if (polylineOutlineRef.current) {
      map.removeLayer(polylineOutlineRef.current);
      polylineOutlineRef.current = null;
    }
    if (alternativeRoutesLayerRef.current) {
      alternativeRoutesLayerRef.current.clearLayers();
    }

    // Determine active coordinates
    let activeCoords = routeCoordinates;
    if (routes && routes.length > 0) {
      const selected = routes[selectedRouteIndex] || routes[0];
      activeCoords = selected.coordinates || routeCoordinates;

      // Draw other unselected alternative routes in muted gray
      routes.forEach((r, idx) => {
        if (idx !== selectedRouteIndex && r.coordinates && r.coordinates.length > 0) {
          const altPolyline = L.polyline(r.coordinates, {
            color: '#94a3b8',
            weight: 5,
            opacity: 0.6,
            dashArray: '6, 8',
            lineCap: 'round',
            lineJoin: 'round'
          });

          // Clicking an alternative route activates it
          altPolyline.on('click', () => {
            if (onSelectRoute) onSelectRoute(idx);
          });

          alternativeRoutesLayerRef.current.addLayer(altPolyline);
        }
      });
    }

    if (activeCoords && activeCoords.length > 0) {
      // Background shadow line
      polylineOutlineRef.current = L.polyline(activeCoords, {
        color: '#1e3a8a',
        weight: 9,
        opacity: 0.3,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Main vibrant route line
      polylineLayerRef.current = L.polyline(activeCoords, {
        color: '#2563eb',
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Fit map bounds
      map.fitBounds(polylineLayerRef.current.getBounds(), {
        padding: [60, 60],
        maxZoom: 16,
        animate: true,
        duration: 0.8
      });
    } else {
      const bounds = [];
      if (pickupCoords?.latitude) bounds.push([pickupCoords.latitude, pickupCoords.longitude]);
      if (destinationCoords?.latitude) bounds.push([destinationCoords.latitude, destinationCoords.longitude]);
      if (captainLocation?.latitude) bounds.push([captainLocation.latitude, captainLocation.longitude]);

      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16, animate: true });
      } else if (bounds.length === 1) {
        map.setView(bounds[0], 15, { animate: true });
      }
    }
  }, [routeCoordinates, routes, selectedRouteIndex, pickupCoords, destinationCoords, captainLocation, onSelectRoute]);

  const handleRecenter = () => {
    if (mapInstanceRef.current && currentCoords) {
      mapInstanceRef.current.setView([currentCoords.latitude, currentCoords.longitude], 16, {
        animate: true,
        duration: 0.8
      });
    }
  };

  const activeRoute = routes && routes.length > 0 ? routes[selectedRouteIndex] || routes[0] : null;

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* Floating Smart Route Selector Pills (if alternatives exist) */}
      {routes && routes.length > 1 && (
        <div className="absolute top-20 left-4 z-[400] flex gap-2 overflow-x-auto max-w-[70%] pb-1 scrollbar-none pointer-events-auto">
          {routes.map((r, idx) => {
            const isSelected = idx === selectedRouteIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectRoute && onSelectRoute(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-700 scale-105'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{r.tag === 'Fastest Route' ? '⚡ Fastest' : r.tag === 'Shortest Distance' ? '📏 Shortest' : r.tag}</span>
                <span className={`opacity-80 text-[10px]`}>({r.duration} • {r.distance})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Re-center GPS button */}
      <button
        type="button"
        onClick={handleRecenter}
        className="absolute top-20 right-4 z-[400] bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 active:scale-95 transition-all flex items-center justify-center border border-gray-200"
        title="Re-center on my location"
      >
        <i className="ri-crosshair-2-line text-xl"></i>
      </button>
    </div>
  );
};

export default LiveMap;
