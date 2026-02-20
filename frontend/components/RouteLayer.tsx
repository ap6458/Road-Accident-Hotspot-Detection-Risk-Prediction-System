"use client";

import { Polyline, Popup } from "react-leaflet";

type RouteType = {
  polyline: number[][];
  color: string;
};

export default function RouteLayer({ routes = [] }: { routes: RouteType[] }) {
  return (
    <>
      {routes.map((r, i) => (
        <Polyline
          key={i}
          positions={r.polyline as any}
          pathOptions={{
            color: r.color,
            weight: 6,
          }}
        >
          <Popup>Risk Level: {r.color.toUpperCase()}</Popup>
        </Polyline>
      ))}
    </>
  );
}