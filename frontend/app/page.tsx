"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
});
export default function Home() {
  const [points, setPoints] = useState([]);
  const [hotspots, setHotspots] = useState([]);

  const [showPoints, setShowPoints] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/accident-spots")
      .then((res) => res.json())
      .then((data) => setPoints(data));

    fetch("http://127.0.0.1:8000/future-hotspots")
      .then((res) => res.json())
      .then((data) => setHotspots(data));
  }, []);

  return (
    <div>
      <Navbar />

      {/* CONTROL PANEL */}
      <div
        style={{
          padding: "10px",
          color : "black",
          background: "#f5f5f5",
          display: "flex",
          gap: "20px",
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={showPoints}
            onChange={() => setShowPoints(!showPoints)}
          />
          Accident Spots
        </label>

        <label>
          <input
            type="checkbox"
            checked={showHotspots}
            onChange={() => setShowHotspots(!showHotspots)}
          />
          AI Hotspots
        </label>
      </div>

      <MapView
        points={points}
        hotspots={hotspots}
        showPoints={showPoints}
        showHotspots={showHotspots}
      />
    </div>
  );
}