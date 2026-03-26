'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div style={{
      position: 'fixed', inset: 0, top: '56px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0c10', flexDirection: 'column', gap: '16px',
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        border: '2px solid rgba(249,115,22,0.2)',
        borderTopColor: '#f97316',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ color: '#4d5562', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
        Initialising map...
      </span>
    </div>
  ),
});

export default function Home() {
  const [showAccidents, setShowAccidents] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [counts, setCounts] = useState({ accidents: 0, hotspots: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [accRes, hotRes] = await Promise.all([
          fetch('http://localhost:8000/accidents'),
          fetch('http://localhost:8000/hotspots'),
        ]);
        const [acc, hot] = await Promise.all([accRes.json(), hotRes.json()]);
        setCounts({ accidents: Array.isArray(acc) ? acc.length : 0, hotspots: Array.isArray(hot) ? hot.length : 0 });
      } catch {}
    };
    fetchCounts();
  }, []);

  return (
    <>
      <Navbar
        showAccidents={showAccidents}
        showHotspots={showHotspots}
        onToggleAccidents={() => setShowAccidents(v => !v)}
        onToggleHotspots={() => setShowHotspots(v => !v)}
        totalAccidents={counts.accidents}
        totalHotspots={counts.hotspots}
      />
      <MapView showAccidents={showAccidents} showHotspots={showHotspots} />
    </>
  );
}
