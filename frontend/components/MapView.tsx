'use client';

import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Accident {
  latitude: number;
  longitude: number;
  severity: 'severe' | 'moderate' | 'light';
}

interface Hotspot {
  latitude: number;
  longitude: number;
  count?: number;
}

interface MapViewProps {
  showAccidents: boolean;
  showHotspots: boolean;
}

const SEVERITY_CONFIG = {
  severe:   { color: '#ef4444', fillColor: '#ef4444', radius: 6, weight: 1.5 },
  moderate: { color: '#f59e0b', fillColor: '#f59e0b', radius: 5, weight: 1 },
  light:    { color: '#3b82f6', fillColor: '#3b82f6', radius: 4, weight: 1 },
};

function MapController() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

export default function MapView({ showAccidents, showHotspots }: MapViewProps) {
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Accident | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [accRes, hotRes] = await Promise.all([
          fetch('http://localhost:8000/accidents'),
          fetch('http://localhost:8000/hotspots'),
        ]);
        if (!accRes.ok || !hotRes.ok) throw new Error('Failed to fetch data');
        const [accData, hotData] = await Promise.all([accRes.json(), hotRes.json()]);
        setAccidents(accData);
        setHotspots(hotData);
      } catch (e) {
        setError('Could not connect to backend. Make sure FastAPI is running on port 8000.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const severityCounts = accidents.reduce(
    (acc, a) => { acc[a.severity] = (acc[a.severity] || 0) + 1; return acc; },
    {} as Record<string, number>
  );

  if (loading) {
    return (
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
          Loading accident data...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        position: 'fixed', inset: 0, top: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0c10',
      }}>
        <div style={{
          background: '#161920', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '14px', padding: '28px 32px', maxWidth: '380px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>⚠️</div>
          <div style={{ color: '#f0f2f5', fontSize: '14px', fontWeight: 500, marginBottom: '8px', fontFamily: 'DM Sans, sans-serif' }}>
            Backend Unavailable
          </div>
          <div style={{ color: '#8b92a0', fontSize: '12px', lineHeight: 1.6, fontFamily: 'DM Sans, sans-serif' }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, top: '56px' }}>
      {/* Map */}
      <MapContainer
        center={[51.505, -0.09]}
        zoom={11}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <MapController />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={19}
        />

        {/* Hotspot rings */}
        {showHotspots && hotspots.map((hs, i) => (
          <Circle
            key={`hs-${i}`}
            center={[hs.latitude, hs.longitude]}
            radius={800}
            pathOptions={{
              color: '#f59e0b',
              fillColor: '#f59e0b',
              fillOpacity: 0.06,
              weight: 1.5,
              dashArray: '4 4',
            }}
          />
        ))}

        {/* Accident dots */}
        {showAccidents && accidents.map((acc, i) => {
          const cfg = SEVERITY_CONFIG[acc.severity] || SEVERITY_CONFIG.light;
          return (
            <CircleMarker
              key={`acc-${i}`}
              center={[acc.latitude, acc.longitude]}
              radius={cfg.radius}
              pathOptions={{
                color: cfg.color,
                fillColor: cfg.fillColor,
                fillOpacity: 0.85,
                weight: cfg.weight,
              }}
              eventHandlers={{
                click: () => setSelected(acc),
              }}
            />
          );
        })}
      </MapContainer>

      {/* Sidebar panel */}
      <aside style={{
        position: 'absolute', top: '16px', right: '16px',
        width: '220px',
        display: 'flex', flexDirection: 'column', gap: '10px',
        zIndex: 900,
        animation: 'fadeIn 0.4s ease',
      }}>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>

        {/* Stats Card */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>Overview</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <StatRow label="Total Accidents" value={accidents.length.toLocaleString()} color="#f0f2f5" />
            <StatRow label="AI Hotspots" value={hotspots.length.toLocaleString()} color="#f59e0b" />
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <StatRow label="Severe" value={severityCounts.severe?.toLocaleString() ?? '0'} color="#ef4444" dot />
              <StatRow label="Moderate" value={severityCounts.moderate?.toLocaleString() ?? '0'} color="#f59e0b" dot />
              <StatRow label="Light" value={severityCounts.light?.toLocaleString() ?? '0'} color="#3b82f6" dot />
            </div>
          </div>
        </div>

        {/* Legend Card */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>Legend</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <LegendItem color="#ef4444" label="Severe / Fatal" shape="circle" />
            <LegendItem color="#f59e0b" label="Moderate" shape="circle" />
            <LegendItem color="#3b82f6" label="Light / Minor" shape="circle" />
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
              <LegendItem color="#f59e0b" label="AI Predicted Zone" shape="ring" />
            </div>
          </div>
        </div>

        {/* Report button */}
        <ReportButton />
      </aside>

      {/* Selected accident popup */}
      {selected && (
        <div style={{
          position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          background: '#161920', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px', padding: '14px 18px',
          zIndex: 900, display: 'flex', alignItems: 'center', gap: '14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          animation: 'fadeIn 0.2s ease',
          minWidth: '260px',
        }}>
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
            background: SEVERITY_CONFIG[selected.severity]?.color ?? '#3b82f6',
            boxShadow: `0 0 8px ${SEVERITY_CONFIG[selected.severity]?.color ?? '#3b82f6'}`,
          }} />
          <div>
            <div style={{ fontSize: '12px', color: '#f0f2f5', fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
              {selected.severity.charAt(0).toUpperCase() + selected.severity.slice(1)} Accident
            </div>
            <div style={{ fontSize: '11px', color: '#4d5562', fontFamily: "'DM Mono', monospace", marginTop: '2px' }}>
              {selected.latitude.toFixed(5)}, {selected.longitude.toFixed(5)}
            </div>
          </div>
          <button
            onClick={() => setSelected(null)}
            style={{
              marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer',
              color: '#4d5562', fontSize: '16px', lineHeight: 1, padding: '2px',
              fontFamily: 'inherit',
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function StatRow({ label, value, color, dot }: { label: string; value: string; color: string; dot?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {dot && (
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />
        )}
        <span style={{ fontSize: '12px', color: '#8b92a0', fontFamily: 'DM Sans, sans-serif' }}>{label}</span>
      </div>
      <span style={{ fontSize: '13px', fontWeight: 600, color, fontFamily: "'DM Mono', monospace" }}>{value}</span>
    </div>
  );
}

function LegendItem({ color, label, shape }: { color: string; label: string; shape: 'circle' | 'ring' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {shape === 'circle' ? (
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0,
          boxShadow: `0 0 5px ${color}60`,
        }} />
      ) : (
        <span style={{
          width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0,
          border: `1.5px dashed ${color}`, background: `${color}12`,
        }} />
      )}
      <span style={{ fontSize: '12px', color: '#8b92a0', fontFamily: 'DM Sans, sans-serif' }}>{label}</span>
    </div>
  );
}

function ReportButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ location: '', severity: 'moderate' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.location.trim()) return;
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setOpen(false); setForm({ location: '', severity: 'moderate' }); }, 2000);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '10px 16px', width: '100%',
          background: 'rgba(249,115,22,0.1)',
          border: '1px solid rgba(249,115,22,0.3)',
          borderRadius: '10px', cursor: 'pointer',
          color: '#f97316', fontSize: '12px', fontWeight: 600,
          fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.02em',
          transition: 'all 0.18s ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(249,115,22,0.18)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(249,115,22,0.1)'; }}
      >
        <span>🚨</span> Report Accident
      </button>

      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div style={{
            background: '#161920', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px', padding: '28px', width: '340px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
            animation: 'fadeIn 0.2s ease',
          }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
                <div style={{ color: '#f0f2f5', fontSize: '14px', fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
                  Report submitted!
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <div style={{ color: '#f0f2f5', fontSize: '15px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
                      Report Accident
                    </div>
                    <div style={{ color: '#4d5562', fontSize: '12px', marginTop: '2px', fontFamily: 'DM Sans, sans-serif' }}>
                      Help improve AI predictions
                    </div>
                  </div>
                  <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#4d5562', fontSize: '20px', cursor: 'pointer', fontFamily: 'inherit' }}>×</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#8b92a0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'DM Sans, sans-serif', display: 'block', marginBottom: '6px' }}>
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. A4 near Hammersmith..."
                      value={form.location}
                      onChange={e => setForm({ ...form, location: e.target.value })}
                      style={{
                        width: '100%', padding: '9px 12px',
                        background: '#0a0c10', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px', color: '#f0f2f5', fontSize: '13px',
                        fontFamily: 'DM Sans, sans-serif', outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: '#8b92a0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'DM Sans, sans-serif', display: 'block', marginBottom: '6px' }}>
                      Severity
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {(['severe', 'moderate', 'light'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => setForm({ ...form, severity: s })}
                          style={{
                            flex: 1, padding: '7px 4px', borderRadius: '7px', cursor: 'pointer',
                            fontSize: '11px', fontWeight: 500, fontFamily: 'DM Sans, sans-serif',
                            border: `1px solid ${form.severity === s ? SEVERITY_CONFIG[s].color + '50' : 'rgba(255,255,255,0.07)'}`,
                            background: form.severity === s ? `${SEVERITY_CONFIG[s].color}18` : 'transparent',
                            color: form.severity === s ? SEVERITY_CONFIG[s].color : '#8b92a0',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    style={{
                      padding: '10px', borderRadius: '8px', cursor: 'pointer',
                      background: 'linear-gradient(135deg, #ef4444, #f97316)',
                      border: 'none', color: '#fff', fontSize: '13px', fontWeight: 600,
                      fontFamily: 'DM Sans, sans-serif', marginTop: '4px',
                      boxShadow: '0 4px 14px rgba(239,68,68,0.3)',
                      transition: 'opacity 0.15s ease',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
                  >
                    Submit Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(22, 25, 32, 0.92)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '14px 16px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
};

const cardHeaderStyle: React.CSSProperties = {
  fontSize: '10px', fontWeight: 600,
  color: '#4d5562', textTransform: 'uppercase',
  letterSpacing: '0.08em', marginBottom: '12px',
  fontFamily: 'DM Sans, sans-serif',
};
