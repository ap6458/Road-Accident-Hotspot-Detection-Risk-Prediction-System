# 🚨 NHAI AI Road Accident Hotspot Detection & Risk Prediction System

[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python&logoColor=white)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![DBSCAN](https://img.shields.io/badge/ML-DBSCAN%20Clustering-orange)](https://scikit-learn.org)

> An AI-powered road accident visualization and hotspot prediction system that helps identify accident-prone zones and forecast future risk areas using machine learning — built for proactive road safety monitoring.

---

## 📸 Demo

> **Dashboard Preview**
> 
> <!-- Add your screenshot/GIF here after capturing it -->
> <!-- ![Dashboard Demo](./docs/demo.gif) -->
> <!-- ![Map Screenshot](./docs/screenshot.png) -->
> 
> _Screenshot: Interactive accident hotspot map with severity-based markers and AI-predicted risk zones_

---

## 📌 Project Overview

Road accidents are a major challenge for traffic authorities across India. Traditional approaches react to accidents after they occur — this dashboard takes a **predictive approach**.

The system:
- Visualizes historical accident data on an interactive map
- Color-codes accidents by severity for instant pattern recognition
- Uses **DBSCAN clustering** to identify dense accident zones
- Predicts **future high-risk areas** so authorities can act before accidents happen
- Provides a clean reporting interface for new incident logging

> Originally prototyped in 12 hours at a hackathon; subsequently extended with improved ML pipeline, responsive UI, and a structured REST API.

---

## ✨ Key Features

### 🗺️ Interactive Map
- OpenStreetMap integration via **React Leaflet**
- Real-world geographic coordinate plotting
- Smooth zoom, pan, and layer toggle controls

### 🎨 Severity-Based Accident Markers
| Marker | Severity |
|--------|----------|
| 🔴 Red | Severe / Fatal |
| 🟡 Yellow | Moderate |
| 🔵 Blue | Light / Minor |

### 🤖 AI Hotspot Prediction
- **DBSCAN** (Density-Based Spatial Clustering of Applications with Noise)
- Automatically detects dense accident corridors from historical data
- Displays predicted future risk zones as radius circles on the map
- No manual threshold tuning required — epsilon and min-samples auto-configured

### 📊 Live Dashboard Statistics
- Total accident count
- Number of AI-detected hotspots
- Layer toggles for accident spots vs. predicted hotspots
- Clean collapsible legend panel

### 🚨 Accident Reporting Interface
- Sidebar "Report Accident" button
- Popup form with location input and severity selection
- Submissions persist to backend for continuous model improvement

---

## 📈 Results

- Processed **historical accident records** across multiple urban corridors
- DBSCAN successfully identified **distinct high-risk clusters** from coordinate data
- Dashboard renders map tiles and data layers in **under 2 seconds**
- Severity-based filtering enables rapid zone prioritization for authorities

---

## 🧠 How It Works

```
Raw CSV Dataset (lat, lng, severity)
        │
        ▼
  pandas preprocessing
  (clean nulls, normalize coords)
        │
        ▼
  DBSCAN Clustering (scikit-learn)
  ┌─────────────────────────────┐
  │  epsilon = neighborhood rad │
  │  min_samples = density floor│
  └─────────────────────────────┘
        │
        ▼
  Cluster centers extracted
  → future hotspot coordinates
        │
        ▼
  FastAPI REST endpoint
  GET /accidents  →  accident points
  GET /hotspots   →  predicted zones
        │
        ▼
  Next.js Frontend
  React Leaflet renders map layers
  Dashboard shows live statistics
```

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React, TypeScript |
| **Map** | React Leaflet, OpenStreetMap Tiles |
| **Backend** | FastAPI, Uvicorn |
| **ML / Data** | scikit-learn (DBSCAN), Pandas |
| **Algorithm** | Density-Based Spatial Clustering (DBSCAN) |

---

## 📂 Project Structure

```
nhai-hotspot/
│
├── frontend/
│   ├── app/
│   │   └── page.tsx          # Main dashboard page
│   ├── components/
│   │   ├── MapView.tsx        # React Leaflet map component
│   │   └── Navbar.tsx         # Top navigation bar
│   └── package.json
│
├── backend/
│   ├── main.py                # FastAPI app & routes
│   ├── ml_hotspots.py         # DBSCAN clustering logic
│   └── dataset/
│       └── accidents.csv      # Historical accident data
│
├── README.md
└── LICENSE
```

---

## 📄 Dataset Format

The backend expects `backend/dataset/accidents.csv` with the following schema:

| Column | Type | Description |
|--------|------|-------------|
| `latitude` | float | Accident latitude coordinate |
| `longitude` | float | Accident longitude coordinate |
| `severity` | string | `severe`, `moderate`, or `light` |
| `date` _(optional)_ | string | Date of accident (YYYY-MM-DD) |

**Sample rows:**

| latitude | longitude | severity | date |
|----------|-----------|----------|------|
| 28.6139 | 77.2090 | severe | 2023-04-12 |
| 19.0760 | 72.8777 | moderate | 2023-05-03 |
| 12.9716 | 77.5946 | light | 2023-06-18 |

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ap6458/Road-Accident-Hotspot-Detection-Risk-Prediction-System.git
cd Road-Accident-Hotspot-Detection-Risk-Prediction-System
```

### 2️⃣ Run the Backend

```bash
cd backend
pip install fastapi uvicorn pandas scikit-learn python-multipart
uvicorn main:app --reload
```

Backend will start at: `http://localhost:8000`

Available endpoints:
- `GET /accidents` — returns all accident data points
- `GET /hotspots` — returns AI-predicted hotspot cluster centers

### 3️⃣ Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will start at: `http://localhost:3000`

### 4️⃣ Open in Browser

Navigate to `http://localhost:3000` to view the dashboard.

---

## 🔮 Future Improvements

- [ ] Real-time accident feed integration via WebSocket
- [ ] Time-series heatmap (accidents filtered by hour / day / season)
- [ ] SMS / push alert system for traffic authorities (Twilio integration)
- [ ] Mobile-responsive PWA version for field officers
- [ ] Automated model retraining as new reports are submitted
- [ ] Export hotspot reports as PDF for government submission

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## 👤 Author

**ap6458**

- GitHub: [@ap6458](https://github.com/ap6458)


---

⭐ **Star this repo** if you found it useful — it helps others discover the project!
