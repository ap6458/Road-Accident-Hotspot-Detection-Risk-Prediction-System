'use client';

import { useState } from 'react';

interface NavbarProps {
  showAccidents: boolean;
  showHotspots: boolean;
  onToggleAccidents: () => void;
  onToggleHotspots: () => void;
  totalAccidents: number;
  totalHotspots: number;
}

export default function Navbar({
  showAccidents,
  showHotspots,
  onToggleAccidents,
  onToggleHotspots,
  totalAccidents,
  totalHotspots,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: '56px',
      background: 'rgba(10, 12, 16, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: '16px',
    }}>
      {/* Logo / Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <div style={{
          width: '30px', height: '30px',
          background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px',
          boxShadow: '0 2px 8px rgba(239,68,68,0.35)',
        }}>
          🚨
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f0f2f5', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            NHAI Road Intelligence
          </div>
          <div style={{ fontSize: '10px', color: '#4d5562', fontWeight: 400, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            AI Hotspot Dashboard
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />

      {/* Layer Toggles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ToggleChip
          label="Accident Spots"
          color="#ef4444"
          active={showAccidents}
          onClick={onToggleAccidents}
        />
        <ToggleChip
          label="AI Hotspots"
          color="#f59e0b"
          active={showHotspots}
          onClick={onToggleHotspots}
        />
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <StatPill label="Accidents" value={totalAccidents.toLocaleString()} color="#ef4444" />
        <StatPill label="Hotspots" value={totalHotspots.toLocaleString()} color="#f59e0b" />
      </div>
    </header>
  );
}

function ToggleChip({
  label, color, active, onClick,
}: {
  label: string; color: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '5px 11px',
        background: active ? `${color}18` : 'transparent',
        border: `1px solid ${active ? color + '40' : 'rgba(255,255,255,0.09)'}`,
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 500,
        color: active ? color : '#8b92a0',
        fontFamily: 'inherit',
        transition: 'all 0.18s ease',
        letterSpacing: '0.01em',
      }}
    >
      <span style={{
        width: '7px', height: '7px', borderRadius: '50%',
        background: active ? color : '#4d5562',
        boxShadow: active ? `0 0 6px ${color}` : 'none',
        transition: 'all 0.18s ease',
        flexShrink: 0,
      }} />
      {label}
    </button>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '5px 12px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '20px',
    }}>
      <span style={{ fontSize: '10px', color: '#4d5562', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>
      <span style={{
        fontSize: '13px', fontWeight: 600, color,
        fontFamily: "'DM Mono', monospace",
      }}>
        {value}
      </span>
    </div>
  );
}
