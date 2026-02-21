# 🚨 NHAI AI Road Accident Hotspot Dashboard

**Built within 12 hours for AI-powered road safety intelligence.**

An AI-powered road accident visualization and hotspot prediction system that helps identify accident-prone zones and visualize future risk areas using machine learning.

This project was developed as a hackathon solution for proactive road safety monitoring.

---

# 📌 Project Overview

Road accidents are a major challenge for traffic authorities.  
This dashboard provides:

- Interactive accident visualization on map
- Severity-based accident highlighting
- AI-predicted future hotspots
- Live dashboard statistics
- Accident reporting interface

The goal is to assist authorities in identifying dangerous zones before accidents occur.

---

# 🎯 Key Features

## 🗺️ Interactive Map
- OpenStreetMap + React Leaflet integration
- Real-world geographic visualization

## 🎨 Severity-Based Accident Spots
- 🔴 Red → Severe / Fatal
- 🟡 Yellow → Moderate
- 🔵 Blue → Light

## 🤖 AI Future Hotspot Prediction
- Machine learning clustering using DBSCAN
- Detects dense accident zones
- Displays future risk areas as map circles

## 📊 Smart Dashboard UI
- Total accident count
- AI hotspot count
- Layer toggles (spots / hotspots)
- Clean legend panel

## 🚨 Accident Reporting System
- Sidebar “Report Accident” button
- Popup form for:
  - Accident location
  - Severity selection

---

# 🧠 AI / ML Logic

Future hotspots are predicted using:

- Historical accident coordinates
- Density-based clustering (DBSCAN)

### Process:
1. Load accident dataset
2. Clean latitude & longitude data
3. Apply DBSCAN clustering
4. Extract cluster centers
5. Send hotspots to frontend

This allows identification of potential future accident-prone zones.

---

# 🧱 Tech Stack

## Frontend
- Next.js (App Router)
- React
- TypeScript
- React Leaflet
- OpenStreetMap Tiles

## Backend
- FastAPI
- Pandas
- Scikit-learn

## AI / ML
- DBSCAN clustering algorithm

---

# 📂 Project Structure
nhai-hotspot/
│
├── frontend/
│ ├── app/
│ │ └── page.tsx
│ ├── components/
│ │ ├── MapView.tsx
│ │ └── Navbar.tsx
│ └── package.json
│
├── backend/
│ ├── main.py
│ ├── ml_hotspots.py
│ └── dataset/
│ └── accidents.csv
│
└── README.md

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/ap6458/Road-Accident-Hotspot-Detection-Risk-Prediction-System.git
cd nhai-hotspot
pip install fastapi uvicorn pandas scikit-learn python-multipart
```
