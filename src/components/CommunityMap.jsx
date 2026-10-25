import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Plus, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function CommunityMap({
  currentAudit,
  highContrast,
  t
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Pre-seeded community places (Chennai)
  const [places, setPlaces] = useState([
    {
      id: 1,
      name: "Sai Community Clinic, Anna Nagar",
      lat: 13.0850,
      lng: 80.2100,
      status: "Verified by user evidence",
      score: 85,
      date: "2026-10-20",
      barriers: "Modular ramp installed with 1:14 slope and 85 cm clear entrance."
    },
    {
      id: 2,
      name: "Apollo Pharmacy, T. Nagar",
      lat: 13.0418,
      lng: 80.2341,
      status: "Incomplete",
      scoreRange: "25–50",
      date: "2026-10-22",
      barriers: "Two concrete steps (approx 16 cm each); ramp slope not yet verified."
    },
    {
      id: 3,
      name: "Higginbothams Bookshop, Mount Road",
      lat: 13.0674,
      lng: 80.2600,
      status: "Verified by user evidence",
      score: 92,
      date: "2026-10-18",
      barriers: "Step-free automatic sliding glass entrance with tactile warning pavers."
    },
    {
      id: 4,
      name: "Murugan Idli Shop, Besant Nagar",
      lat: 12.9982,
      lng: 80.2668,
      status: "Partially verified",
      scoreRange: "40–65",
      date: "2026-10-24",
      barriers: "Entrance threshold 4 cm high; portable aluminum wedge ramp recommended."
    }
  ]);

  const [newPlaceName, setNewPlaceName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([13.05, 80.23], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Custom marker icon helper
    const createMarkerIcon = (color) => {
      return L.divIcon({
        className: 'custom-pin',
        html: `<div style="background-color: ${color}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.35);"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });
    };

    // Render markers
    places.forEach(p => {
      const isGreen = p.status.includes('Verified') && (p.score >= 70 || p.score === undefined);
      const isAmber = p.status.includes('Partially') || (p.score >= 40 && p.score < 70);
      const color = isGreen ? '#10b981' : isAmber ? '#f59e0b' : '#ef4444';

      const marker = L.marker([p.lat, p.lng], { icon: createMarkerIcon(color) }).addTo(map);

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 180px;">
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold; color: #0f172a;">${p.name}</h4>
          <div style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: bold; background: ${color}20; color: ${color}; margin-bottom: 6px;">
            ${p.status}
          </div>
          <p style="margin: 0 0 6px 0; font-size: 12px; color: #475569;">${p.barriers}</p>
          <div style="font-size: 10px; color: #94a3b8;">${t.lastChecked}: ${p.date}</div>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

  }, [places]);

  const handleAddCurrentAudit = () => {
    if (!newPlaceName.trim()) return;

    // Chennai random nearby point
    const newLat = 13.04 + (Math.random() - 0.5) * 0.08;
    const newLng = 80.22 + (Math.random() - 0.5) * 0.08;

    const newPlace = {
      id: Date.now(),
      name: newPlaceName.trim(),
      lat: newLat,
      lng: newLng,
      status: currentAudit?.assessment_status || "Verified by user evidence",
      score: currentAudit?.score_range?.wheelchair?.[1] || 75,
      date: new Date().toISOString().split('T')[0],
      barriers: currentAudit?.barriers?.[0]?.fix || "Entrance audited with Open Door AccessProof."
    };

    setPlaces(prev => [newPlace, ...prev]);
    setNewPlaceName('');
    setShowAddForm(false);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([newLat, newLng], 14);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700 mb-3">
          <MapPin className="w-4 h-4" />
          <span>Open Accessibility Map</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          {t.mapTitle}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          {t.mapSubtitle}
        </p>
      </div>

      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Status Legend */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span>Accessible / Verified</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span>Partially Verified</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span>Blocked / Incomplete</span>
          </span>
        </div>

        {/* Add Current Audit Button */}
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addCurrentPlace}</span>
        </button>
      </div>

      {/* Add Place Dialog Form */}
      {showAddForm && (
        <div className="p-4 mb-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex flex-wrap items-center gap-3 animate-in fade-in">
          <input
            type="text"
            placeholder={t.placeNamePrompt}
            value={newPlaceName}
            onChange={(e) => setNewPlaceName(e.target.value)}
            className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold min-h-[44px]"
          />
          <button
            type="button"
            onClick={handleAddCurrentAudit}
            disabled={!newPlaceName.trim()}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs min-h-[44px]"
          >
            Pin Place
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Leaflet Map Box */}
      <div className="rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-xl relative z-0">
        <div ref={mapContainerRef} className="w-full h-[460px]" />
      </div>

      <p className="text-center text-xs text-slate-400 mt-4">
        Map data powered by OpenStreetMap contributors. No tracking or proprietary maps API required.
      </p>
    </div>
  );
}
