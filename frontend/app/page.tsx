"use client";

import dynamic from "next/dynamic";

// Load map only in browser
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
});

export default function Home() {
  return <MapView />;
}