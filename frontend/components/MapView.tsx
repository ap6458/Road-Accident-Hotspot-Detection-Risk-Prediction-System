"use client";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Circle,
  Popup,
} from "react-leaflet";

type Point = {
  latitude: number;
  longitude: number;
  accident_severity: number;
};

type Hotspot = {
  lat: number;
  lon: number;
  risk: string;
};

export default function MapView({
  points = [],
  hotspots = [],
  showPoints = true,
  showHotspots = true,
}: {
  points?: Point[];
  hotspots?: Hotspot[];
  showPoints?: boolean;
  showHotspots?: boolean;
}) {

  const getColor = (severity: number) => {
    if (severity === 1) return "red";
    if (severity === 2) return "yellow";
    return "blue";
  };

  const getOpacity = (severity: number) => {
    if (severity === 1) return 0.8;
    if (severity === 2) return 0.6;
    return 0.4;
  };

  const getRadius = (severity: number) => {
    if (severity === 1) return 5;
    if (severity === 2) return 3;
    return 1;
  };

  const getHotspotColor = (risk: string) => {
    if (risk === "high") return "red";
    if (risk === "moderate") return "yellow";
    return "blue";
  };

  return (
    <div style={{ position: "relative" }}>

      {/* ===== SIDEBAR ===== */}
      <div
        style={{
          position: "absolute",
          top: "140px",
          left: "12px",
          zIndex: 1200,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <button
          style={{
            background: "white",
            color: "black",
            border: "none",
            padding: "10px 14px",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          }}
          onClick={() => alert("Open accident report form")}
        >
          🚨 Report Accident
        </button>
      </div>

      {/* ===== STATS PANEL ===== */}
      <div
        style={{
          position: "absolute",
          color: "black",
          top: "20px",
          right: "20px",
          background: "white",
          padding: "12px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          zIndex: 1000,
        }}
      >
        <div><b>Total Accidents:</b> {points.length}</div>
        <div><b>AI Hotspots:</b> {hotspots.length}</div>
      </div>

      {/* ===== MAP ===== */}
      <MapContainer
        center={[51.5, -0.1]}
        zoom={10}
        style={{ height: "90vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />

        {/* Accident Points */}
        {showPoints &&
          points.map((p, i) => (
            <CircleMarker
              key={i}
              center={[p.latitude, p.longitude]}
              radius={getRadius(p.accident_severity)}
              color={getColor(p.accident_severity)}
              fillOpacity={getOpacity(p.accident_severity)}
            >
              <Popup>
                Severity: {p.accident_severity}
              </Popup>
            </CircleMarker>
          ))}

        {/* AI Hotspots */}
        {showHotspots &&
          hotspots.map((h, i) => (
            <Circle
              key={i}
              center={[h.lat, h.lon]}
              radius={600}
              color={getHotspotColor(h.risk)}
              fillOpacity={0.25}
            >
              <Popup>
                <b>AI Predicted Hotspot</b>
                <br />
                Risk: {h.risk}
              </Popup>
            </Circle>
          ))}
      </MapContainer>

      {/* ===== LEGEND ===== */}
      <div
        style={{
          position: "absolute",
          bottom: "50px",
          right: "20px",
          background: "white",
          padding: "10px 14px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          zIndex: 1000,
          color: "black",
          fontSize: "14px",
          lineHeight: "24px",
        }}
      >
        <span><b>Accident zone areas</b></span>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "red" }} />
          Severe
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "yellow", border: "1px solid #999" }} />
          Moderate
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "blue" }} />
          Light
        </div>
      </div>

    </div>
  );
}