# 🚖 Raahi — High-Scale Real-Time Ride Hailing Platform

> An enterprise-grade, distributed ride-hailing and smart routing platform built to handle **10,000+ concurrent riders and captains** with sub-millisecond Redis geospatial indexing, dynamic surge pricing, interactive Leaflet live street maps, and automated GitHub Actions CI/CD.

---

## 🌟 Key Architectural Features

- **📍 In-Memory Geospatial Indexing (Redis GEO)**:
  - Sub-millisecond driver lookup using 52-bit Geohashes (`GEOADD` & `GEOSEARCH`).
  - 15-second ephemeral driver heartbeats preventing ghost drivers.
- **🔒 Distributed Atomic Locking (`Redlock`)**:
  - `SET lock:ride:<id> <captainId> NX PX 5000` to prevent race conditions when multiple drivers accept the same ride.
- **📡 Distributed WebSocket Architecture**:
  - Horizontal scaling across multi-node clusters using `@socket.io/redis-adapter` Pub/Sub.
- **🗺️ Smart Multi-Route Navigation**:
  - Multi-alternative route calculation (**Fastest Route** vs. **Shortest Distance**) using OSRM with turn-by-turn guidance.
- **📈 Real-Time Dynamic Surge Pricing Engine**:
  - Mathematical supply-demand density calculation $\rho = \frac{\text{recent requests}}{\max(\text{active captains}, 1)}$.
  - Rush hour multipliers ($+0.15\times$) and late-night safety incentives ($+₹25$).
- **🗺️ Modern Street & Lane Navigation View**:
  - CartoDB Voyager street tiles with custom animated GPS radar markers and dynamic vehicle icons (Car, Auto, Bike).
- **💳 Complete Ride Lifecycle**:
  - Driver matching $\rightarrow$ OTP verification $\rightarrow$ Live GPS stream $\rightarrow$ Trip completion $\rightarrow$ Payment modal & 5-star driver reviews.
- **🐳 Production Docker & CI/CD**:
  - Multi-stage Docker containerization and automated GitHub Actions pipeline pushing to Docker Hub.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Vanilla Leaflet, GSAP Animations, RemixIcons |
| **Backend** | Node.js, Express 5, Socket.IO, `@socket.io/redis-adapter` |
| **In-Memory Cache & GEO** | Redis 7 (Sorted Sets, Geohash, Pub/Sub, Distributed Locks) |
| **Primary Database** | MongoDB & Mongoose (2dsphere geospatial indexing) |
| **Routing & Geocoding** | OSRM (Open Source Routing Machine), LocationIQ, Geoapify |
| **DevOps & Cloud** | Docker, Docker Compose, GitHub Actions CI/CD, NGINX |

---

## 🚀 Quick Start (Docker Compose)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 1. Clone the Repository
```bash
git clone https://github.com/Sumits-Cosmos/Raahi.git
cd Raahi
```

### 2. Start the Full Distributed Stack
```bash
docker compose up --build
```

- **Rider Web App**: `http://localhost:5173`
- **Backend API & WebSockets**: `http://localhost:4000`
- **Redis In-Memory Engine**: `localhost:6379`
- **MongoDB Database**: `localhost:27017`

---

## 💻 Local Development (Without Docker)

### 1. Start Backend
```bash
cd Backend
npm install
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Repository Structure

```
Raahi/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions CI/CD Pipeline
├── Backend/                   # Express, Socket.IO & Redis API Server
│   ├── controllers/           # Ride, Map, User, Captain Controllers
│   ├── middleware/            # Auth & Validation Middleware
│   ├── models/                # MongoDB Mongoose Schemas
│   ├── routes/                # Express REST API Endpoints
│   ├── services/              # Redis GEO, OSRM Routing, Surge Pricing
│   ├── Dockerfile             # Production Node 20 Alpine Image
│   └── server.js              # HTTP & Socket.IO Entrypoint
├── frontend/                  # React + Vite Client Application
│   ├── src/
│   │   ├── components/        # LiveMap, VehiclePanel, RideSummaryModal
│   │   ├── context/           # User, Captain, Socket Contexts
│   │   └── pages/             # Home, Riding, CaptainHome, Auth Pages
│   └── Dockerfile             # Multi-stage NGINX Alpine Image
├── docker-compose.yml         # Multi-Container Local Orchestration
└── README.md
```

---

## 📄 License
Licensed under the [ISC License](LICENSE).
