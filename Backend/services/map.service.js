const axios = require('axios');
const captainModel = require('../models/captain.model');

// ---------------- Get Coordinates ----------------
const getAddressCoordinate = async (address) => {
  try {
    // Try LocationIQ first
    const apiKey = process.env.LOCATIONIQ_API;
    const locIQUrl = `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodeURIComponent(address)}&format=json`;
    const locIQRes = await axios.get(locIQUrl);
    if (locIQRes.data?.length > 0) {
      const loc = locIQRes.data[0];
      return { latitude: +loc.lat, longitude: +loc.lon };
    }
  } catch (e) {
    console.warn("LocationIQ failed, falling back to Nominatim:", e.message);
  }

  // Fallback to Nominatim
  const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const res = await axios.get(nominatimUrl, {
    headers: { "User-Agent": "RaahiRideApp/1.0 (contact@raahi.in)" }
  });

  if (!res.data?.length) throw new Error("No results found");
  const loc = res.data[0];
  return { latitude: +loc.lat, longitude: +loc.lon };
};


// ---------------- Get Distance & Time ----------------
const getDistanceAndTime = async (origin, destination) => {
   try {
    // Step 1: Get coordinates for both places
    const originCoords = await getAddressCoordinate(origin);

    // Avoid rate limiting by waiting 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));

    const destinationCoords = await getAddressCoordinate(destination);

    // Step 2: Use OSRM (Open Source Routing Machine)
    const url = `https://router.project-osrm.org/route/v1/driving/${originCoords.longitude},${originCoords.latitude};${destinationCoords.longitude},${destinationCoords.latitude}?overview=false`;

    const response = await axios.get(url);

    if (response.data.code === "Ok" && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      return {
        distance: (route.distance / 1000).toFixed(2) + " km",
        duration: (route.duration / 60).toFixed(2) + " mins"
      };
    } else {
      throw new Error("No valid route found");
    }
  } catch (err) {
    console.error("Error in getDistanceAndTime:", err.message);
    throw new Error(`Error fetching distance and time: ${err.message}`);
  }
};

const autocompleteSuggestion = async (text, apiKey = process.env.AUTOCOMPLETESUGGETION_API) => {
  if (!text || !text.trim()) return [];

  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&limit=5&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url, {
      headers: { "User-Agent": "RaahiApp/1.0 (raahi-support@example.com)" }
    });

    if (!response.data || !Array.isArray(response.data.features)) return [];

    return response.data.features.map(feature => {
      const props = feature.properties || {};
      const coords = feature.geometry && Array.isArray(feature.geometry.coordinates)
        ? { longitude: feature.geometry.coordinates[0], latitude: feature.geometry.coordinates[1] }
        : { latitude: props.lat, longitude: props.lon };

      return {
        formatted: props.formatted || props.name || '',
        latitude: coords.latitude != null ? parseFloat(coords.latitude) : null,
        longitude: coords.longitude != null ? parseFloat(coords.longitude) : null,
        raw: feature
      };
    });
  } catch (err) {
    console.error("Error in autocompleteSuggestion:", err.message);
    throw new Error(`Error fetching autocomplete suggestions: ${err.message}`);
  }
};


// ---------------- Get Smart Multi-Route with Alternatives & Steps ----------------
const getRoute = async (origin, destination) => {
  try {
    let originCoords, destinationCoords;

    // Check if origin is string address or object coordinates
    if (typeof origin === 'string') {
      originCoords = await getAddressCoordinate(origin);
    } else if (origin && origin.latitude && origin.longitude) {
      originCoords = origin;
    } else {
      throw new Error('Invalid origin location');
    }

    if (typeof destination === 'string') {
      destinationCoords = await getAddressCoordinate(destination);
    } else if (destination && destination.latitude && destination.longitude) {
      destinationCoords = destination;
    } else {
      throw new Error('Invalid destination location');
    }

    // Call OSRM with full geometries, multiple alternatives, and turn steps
    const url = `https://router.project-osrm.org/route/v1/driving/${originCoords.longitude},${originCoords.latitude};${destinationCoords.longitude},${destinationCoords.latitude}?overview=full&geometries=geojson&alternatives=true&steps=true`;

    const response = await axios.get(url);

    if (response.data.code === "Ok" && response.data.routes?.length > 0) {
      const rawRoutes = response.data.routes;

      // Find minimum duration and distance to tag fastest & shortest
      const minDuration = Math.min(...rawRoutes.map(r => r.duration));
      const minDistance = Math.min(...rawRoutes.map(r => r.distance));

      const processedRoutes = rawRoutes.map((route, idx) => {
        const polyline = (route.geometry?.coordinates || []).map(coord => [coord[1], coord[0]]);
        const distanceKm = (route.distance / 1000).toFixed(2);
        const durationMin = Math.round(route.duration / 60);

        const steps = (route.legs?.[0]?.steps || []).map(step => ({
          instruction: step.maneuver?.type === 'depart' ? 'Head towards destination' : `${step.maneuver?.modifier || ''} ${step.maneuver?.type || ''} onto ${step.name || 'road'}`.trim(),
          distance: (step.distance / 1000).toFixed(2) + ' km',
          duration: Math.round(step.duration / 60) + ' min',
          name: step.name || 'Main Road'
        }));

        const isFastest = route.duration === minDuration;
        const isShortest = route.distance === minDistance;

        let tag = 'Normal';
        if (isFastest && isShortest) tag = 'Fastest & Shortest';
        else if (isFastest) tag = 'Fastest Route';
        else if (isShortest) tag = 'Shortest Distance';

        const summary = route.legs?.[0]?.summary ? `via ${route.legs[0].summary}` : `Route ${idx + 1}`;

        return {
          id: idx,
          name: summary,
          tag,
          isFastest,
          isShortest,
          distance: `${distanceKm} km`,
          distanceKm: parseFloat(distanceKm),
          duration: `${durationMin} mins`,
          durationMin,
          distanceMeters: route.distance,
          durationSeconds: route.duration,
          coordinates: polyline,
          steps: steps.slice(0, 8) // First 8 prominent turns
        };
      });

      // Primary is the fastest route
      const primaryRoute = processedRoutes.find(r => r.isFastest) || processedRoutes[0];

      return {
        routes: processedRoutes,
        primaryRoute,
        distance: primaryRoute.distance,
        duration: primaryRoute.duration,
        distanceMeters: primaryRoute.distanceMeters,
        durationSeconds: primaryRoute.durationSeconds,
        coordinates: primaryRoute.coordinates,
        steps: primaryRoute.steps,
        pickupCoords: {
          latitude: originCoords.latitude,
          longitude: originCoords.longitude
        },
        destinationCoords: {
          latitude: destinationCoords.latitude,
          longitude: destinationCoords.longitude
        }
      };
    } else {
      throw new Error("No valid route found between locations");
    }
  } catch (err) {
    console.error("Error in getRoute:", err.message);
    throw new Error(`Error fetching route: ${err.message}`);
  }
};

const getCaptainsInRadius =  async (latitude, longitude, radius) => { 
  const captains = await captainModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], radius / 6371]
      }
  }
});
  return captains;
}

module.exports = {getDistanceAndTime, getAddressCoordinate, autocompleteSuggestion, getCaptainsInRadius, getRoute};