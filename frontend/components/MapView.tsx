"use client";

import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";

type Point = {
  latitude: number;
  longitude: number;
};

export default function MapView({ points = [] }: { points?: Point[] }) {
  return (
    <MapContainer
      center={[51.5, 0.12]}
      zoom={10}
      style={{ height: "90vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {points.map((p, i) => (
        <CircleMarker
          key={i}
          center={[p.latitude, p.longitude]}
          radius={4}
          color="red"
        />
      ))}
    </MapContainer>
  );
}