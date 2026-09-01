# ⚡ Raahi Backend Service

> High-throughput REST & WebSocket backend powering the Raahi ride-hailing platform. Built with Express 5, Socket.IO, Redis Geospatial Indexing, and MongoDB.

---

## 🌟 Core Backend Capabilities

1. **Redis Geospatial Matching (`services/redis.service.js`)**:
   - `GEOADD captains:available <lng> <lat> <captainId>`: Sub-millisecond driver coordinate ingestion.
   - `GEOSEARCH captains:available FROMLONLAT <lng> <lat> BYRADIUS 3 km`: Fast in-memory proximity lookups.
   - 15-second ephemeral TTL driver heartbeats (`SETEX captain:info:<id> 15`).
2. **Redlock Distributed Locking (`acquireRideLock`)**:
   - Atomic `SET lock:ride:<rideId> <captainId> NX PX 5000` guaranteeing zero double-booking when multiple drivers accept simultaneously.
3. **Socket.IO Redis Pub/Sub Adapter**:
   - Horizontal scaling across multi-pod clusters with zero socket drops.
4. **Smart Multi-Route Service (`services/map.service.js`)**:
   - OSRM Graph Engine integration with `alternatives=true` evaluating **Fastest Route** vs. **Shortest Distance** with turn maneuvers.
5. **Dynamic Surge Pricing Algorithm (`services/ride.service.js`)**:
   - Real-time supply-demand density ratio $\rho = \frac{\text{requests}}{\max(\text{captains}, 1)}$, peak rush hours ($+0.15\times$), and late-night incentives ($+₹25$).

---

## 📡 REST API Documentation

### 👤 User Endpoints (`/users`)
- `POST /users/register`: Register rider (name, email, password).
- `POST /users/login`: Authenticate rider and issue JWT token.
- `GET /users/profile`: Get current authenticated user profile (`Authorization: Bearer <token>`).
- `GET /users/logout`: Logout and invalidate token.

### 🚕 Captain Endpoints (`/captains`)
- `POST /captains/register`: Register driver with vehicle details (Car/Auto/Bike, color, number plate, capacity).
- `POST /captains/login`: Authenticate captain and issue JWT token.
- `GET /captains/profile`: Get current authenticated driver profile.
- `GET /captains/logout`: Logout captain.

### 🗺️ Map & Routing Endpoints (`/maps`)
- `GET /maps/get-coordinates?address=<address>`: Forward geocoding coordinates (`lat`, `lng`).
- `GET /maps/get-distance-time?origin=<origin>&destination=<destination>`: Distance and duration.
- `GET /maps/get-suggestion?text=<query>`: Autocomplete place suggestions.
- `GET /maps/get-route?origin=<origin>&destination=<destination>`: Multi-route alternatives with polylines and turn maneuvers.

### 🚖 Ride Endpoints (`/rides`)
- `POST /rides/create`: Create a ride request and dispatch notifications to nearby captains.
- `GET /rides/get-fare?pickup=<origin>&destination=<dest>`: Dynamic fare estimates with transparent surge breakdown.
- `POST /rides/confirm`: Captain accepts a ride request (protected by Redis distributed lock).
- `POST /rides/start-ride`: Captain verifies rider OTP and starts the ride.
- `POST /rides/end-ride`: Captain finishes the trip and triggers rider payment modal.
- `POST /rides/cancel-ride`: Rider or captain cancels active ride request.

---

## 🔌 Real-Time WebSocket Events (Socket.IO)

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `join` | Client $\rightarrow$ Server | `{ userId, userType }` | Connects user/captain and updates socket mapping. |
| `update-location-captain` | Captain $\rightarrow$ Server | `{ userId, location: { latitude, longitude, heading }, rideId }` | Ingests live GPS into Redis GEO & broadcasts to rider. |
| `new-ride` | Server $\rightarrow$ Captain | `{ ride, pickup, destination, fare }` | Incoming ride dispatch notification. |
| `ride-confirmed` | Server $\rightarrow$ Rider | `{ ride, captain }` | Notifies rider that a captain accepted the ride. |
| `ride-started` | Server $\rightarrow$ Rider | `{ ride }` | Notifies rider that OTP was verified and trip started. |
| `driver-location-update` | Server $\rightarrow$ Rider | `{ captainId, location, rideId }` | Real-time vehicle navigation stream on Leaflet map. |
| `ride-completed` | Server $\rightarrow$ Rider | `{ ride }` | Triggers ride completion, payment, and rating modal. |
| `ride-cancelled` | Server $\rightarrow$ Both | `{ rideId, reason, cancelledBy }` | Notifies party of cancellation. |

---

## 🔑 Environment Variables (`.env`)

```env
PORT=4000
NODE_ENV=development
DB_CONNECT=mongodb://localhost:27017/raahi
JWT_SECRET=raahi_secret_key_12345
REDIS_URL=redis://127.0.0.1:6379

LOCATIONIQ_API=your_locationiq_api_key
AUTOCOMPLETESUGGETION_API=your_geoapify_api_key
GOOGLE_MAPS_API=your_google_maps_api_key
```