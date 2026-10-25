import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2, AlertTriangle, Smartphone, ArrowRight, X } from 'lucide-react';

export default function SlopeReader({
  onApplySlope,
  highContrast,
  t
}) {
  const [angle, setAngle] = useState(4.8); // degrees (default 1:12 slope ~ 4.76 deg)
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [applied, setApplied] = useState(false);

  const requestOrientation = async () => {
    setIsMeasuring(true);
    setApplied(false);

    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
        } else {
          setIsSupported(false);
        }
      } catch (e) {
        console.warn('iOS orientation error:', e);
      }
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      setIsSupported(false);
    }
  };

  const handleOrientation = (event) => {
    // beta: front-to-back tilt in degrees (-180 to 180)
    if (event.beta !== null && event.beta !== undefined) {
      const positiveAngle = Math.abs(event.beta);
      if (positiveAngle <= 45) {
        setAngle(parseFloat(positiveAngle.toFixed(1)));
      }
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Compute slope ratio: tan(angle in rad) = rise / run
  const rad = (angle * Math.PI) / 180;
  const slopeRatioNum = Math.tan(rad) > 0 ? (1 / Math.tan(rad)).toFixed(1) : '99.0';
  const ratioString = `1:${slopeRatioNum}`;

  // ADA standard: max 1:12 (~4.76°). If ratio >= 12, it's gentle and compliant!
  const isCompliant = parseFloat(slopeRatioNum) >= 12;

  const handleSaveToAudit = () => {
    setApplied(true);
    if (onApplySlope) {
      onApplySlope({
        item: "Ramp Slope",
        value: `Measured Ramp Slope: ${ratioString} (${angle}°) — ${isCompliant ? 'Complies with 1:12 CPWD/ADA standard' : 'Too steep (exceeds 1:12 standard)'}`,
        type: "measurement"
      });
    }
  };

  return (
    <div
      className={`p-6 sm:p-8 rounded-3xl border shadow-lg mb-8 transition-colors ${
        highContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
      }`}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <Smartphone className="w-6 h-6 text-teal-600 dark:text-teal-400" />
        <h3 className="text-xl font-bold">{t.slopeTitle}</h3>
      </div>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6">
        {t.slopeSubtitle}
      </p>

      {/* Visual Inclinometer / Bubble Level Gauge */}
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 mb-6 relative">
        {/* Bubble level indicator bar */}
        <div className="w-full max-w-xs h-6 bg-slate-200 dark:bg-slate-800 rounded-full relative overflow-hidden border border-slate-300 dark:border-slate-600 mb-4 flex items-center justify-center">
          {/* Target 1:12 zone marker */}
          <div className="absolute w-8 h-full bg-emerald-500/20 border-x border-emerald-500" />
          {/* Moving bubble */}
          <div
            className={`w-7 h-5 rounded-full shadow-md transition-all duration-150 ${
              isCompliant ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{
              transform: `translateX(${Math.min(Math.max((angle - 4.76) * 12, -120), 120)}px)`
            }}
          />
        </div>

        {/* Big ratio readout */}
        <div className="text-center">
          <div className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {ratioString}
          </div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
            {t.slopeAngle} {angle}°
          </div>
        </div>

        {/* Compliance verdict */}
        <div
          className={`mt-4 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border ${
            isCompliant
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
              : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700'
          }`}
        >
          {isCompliant ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
          <span>{isCompliant ? t.rampCompliant : t.rampTooSteep}</span>
        </div>

        {/* Desktop / Manual Slider fallback */}
        <div className="w-full max-w-xs mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-400 mb-1 text-center">
            Adjust angle slider (Simulate sensor):
          </label>
          <input
            type="range"
            min="1.0"
            max="15.0"
            step="0.1"
            value={angle}
            onChange={(e) => setAngle(parseFloat(e.target.value))}
            className="w-full accent-teal-600"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={requestOrientation}
          className="px-5 py-2.5 rounded-xl text-xs font-bold border border-teal-500 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 min-h-[44px]"
        >
          {isMeasuring ? 'Calibrating...' : t.measureSlopeBtn}
        </button>

        <button
          type="button"
          onClick={handleSaveToAudit}
          disabled={applied}
          className="px-6 py-2.5 bg-teal-600 disabled:bg-emerald-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow flex items-center gap-1.5 min-h-[44px]"
        >
          {applied ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.slopeSaved}</span>
            </>
          ) : (
            <>
              <span>{t.applySlopeToAudit}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <div className="text-xs text-slate-400 mt-4 text-center">
        {t.adaStandard}
      </div>
    </div>
  );
}
