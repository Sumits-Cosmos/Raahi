# 📱 Raahi Frontend Web Application

> Modern, responsive, and real-time React 19 + Vite web client for the Raahi ride-hailing platform. Features interactive Leaflet maps, dynamic street navigation, GSAP micro-animations, multi-route selection, and transparent surge pricing breakdown.

---

## 🌟 Key Frontend Features

1. **Interactive Street & Lane Navigation View (`components/LiveMap.jsx`)**:
   - Modern CartoDB Voyager street tiles highlighting road lanes, highways, and street names.
   - Animated blue pulsing radar marker for rider GPS location.
   - Dynamic rotating SVG vehicle markers (`Car`, `Auto`, `Bike`) responding to real-time driver telemetry.
   - Dual-stroke route polyline with auto-fit bounds and GPS re-centering control.
   - Floating **Map Style Switcher** (🛣️ Street View / 🧭 Detailed Roads / 🗺️ Standard).
2. **Smart Multi-Route Selection**:
   - Floating route badges on map (`⚡ Fastest` vs `📏 Shortest`) allowing riders to toggle between alternative routes with a single tap.
3. **Transparent Surge Pricing Drawer (`components/VehiclePanel.jsx`)**:
   - Dynamic surge indicator (`⚡ 1.25x Surge`) displayed in vehicle drawer.
   - Interactive **Fare Breakdown Modal** itemizing Base Fare, Distance Rate (`₹/km`), Time Rate (`₹/min`), and Surge factors.
4. **Complete Ride Booking Lifecycle**:
   - Looking for Captain $\rightarrow$ OTP Display $\rightarrow$ Driver Matched $\rightarrow$ Live GPS tracking $\rightarrow$ Payment Receipt & 5-Star Driver Review.
5. **GSAP Micro-Animations**:
   - Smooth sliding drawers and floating bottom sheets.

---

## 🏗️ Project Architecture & Components

```
frontend/src/
├── components/
│   ├── LiveMap.jsx             # Leaflet street navigation & multi-route rendering
│   ├── VehiclePanel.jsx        # Vehicle selection & transparent surge breakdown
│   ├── ConfirmedRide.jsx       # Ride confirmation card
│   ├── LookingForDriver.jsx    # Searching radar & OTP display
│   ├── WaitingForDriver.jsx    # Matched driver card & OTP
│   ├── RideSummaryModal.jsx    # Payment settlement & 5-star rating modal
│   └── CaptainsDetails.jsx     # Driver earnings & metrics
├── context/
│   ├── UserContext.jsx         # Rider state & profile management
│   ├── CaptainContext.jsx      # Captain state & metrics
│   └── SocketContext.jsx       # Real-time WebSocket connection
└── pages/
    ├── Home.jsx                # Rider booking & trip search dashboard
    ├── Riding.jsx              # Rider live navigation & trip tracking
    ├── CaptainHome.jsx         # Driver dispatch & incoming ride dashboard
    ├── CaptainRiding.jsx       # Driver navigation & trip completion
    └── UserLogin.jsx / CaptainLogin.jsx
```

---

## 🔑 Environment Variables (`.env`)

```env
VITE_BASE_URL=http://localhost:4000
```

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run Vite development server
npm run dev

# 3. Production build
npm run build
```

---

## 🐳 Docker Deployment

The frontend includes a multi-stage Docker build with **NGINX Alpine** to serve the optimized production SPA on port `80` (mapped to `5173` via Docker Compose):

```bash
docker build -t raahi-frontend ./frontend
```