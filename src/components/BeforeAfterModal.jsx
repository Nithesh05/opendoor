import React, { useState } from 'react';
import { X, TrendingUp, CheckCircle, RefreshCw, Upload, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BeforeAfterModal({
  isOpen,
  onClose,
  beforePhoto,
  auditData,
  onResolveFix,
  highContrast,
  t
}) {
  if (!isOpen) return null;

  const [afterPhoto, setAfterPhoto] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [improvedResult, setImprovedResult] = useState(null);
  const [modalError, setModalError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setModalError(null);
      setImprovedResult(null);
      const reader = new FileReader();
      reader.onload = (event) => setAfterPhoto(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const useSampleAfterRamp = () => {
    setModalError(null);
    setImprovedResult(null);
    fetch('/samples/clinic_after_ramp.jpg')
      .then(r => r.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = (e) => setAfterPhoto(e.target.result);
        reader.readAsDataURL(blob);
      });
  };

  const runBeforeAfterAnalysis = async () => {
    if (!afterPhoto) return;
    setAnalyzing(true);
    setModalError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: [{ data: afterPhoto, mimeType: 'image/jpeg', role: 'postfix' }],
          isBeforeAfter: true,
          beforeData: auditData
        })
      });

      if (!res.ok) {
        let errorMsg = 'The AI service is temporarily unavailable. Please try again.';
        try {
          const errData = await res.json();
          if (errData?.error) errorMsg = errData.error;
        } catch (_) {}
        setModalError(errorMsg);
        return;
      }

      const data = await res.json();
      setImprovedResult(data);

      const oldUpper = Array.isArray(auditData?.score_range?.wheelchair)
        ? (auditData.score_range.wheelchair[1] ?? auditData.score_range.wheelchair[0])
        : (typeof auditData?.score_range?.wheelchair === 'number' ? auditData.score_range.wheelchair : 25);

      const newScoreVal = Array.isArray(data?.score_range?.wheelchair)
        ? (data.score_range.wheelchair[1] ?? data.score_range.wheelchair[0])
        : (typeof data?.score_range?.wheelchair === 'number' ? data.score_range.wheelchair : 0);

      const isStatusVerified = data?.assessment_status === 'Partially verified' || data?.assessment_status === 'Verified by user evidence';

      if (newScoreVal > oldUpper && isStatusVerified) {
        // Trigger celebratory confetti if improved!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        if (onResolveFix) onResolveFix();
      }
    } catch (err) {
      console.error('Before/After error:', err);
      setModalError('Connection error. Please try again in a moment.');
    } finally {
      setAnalyzing(false);
    }
  };

  const oldScore = Array.isArray(auditData?.score_range?.wheelchair)
    ? (auditData.score_range.wheelchair[1] ?? auditData.score_range.wheelchair[0])
    : (typeof auditData?.score_range?.wheelchair === 'number' ? auditData.score_range.wheelchair : 25);
  const oldLabel = auditData?.scores?.wheelchair?.label || 'Blocked';

  const newScore = improvedResult?.score_range?.wheelchair
    ? (Array.isArray(improvedResult.score_range.wheelchair)
        ? (improvedResult.score_range.wheelchair[1] ?? improvedResult.score_range.wheelchair[0])
        : improvedResult.score_range.wheelchair)
    : 0;
  const newLabel = improvedResult?.scores?.wheelchair?.label || 'Accessible';

  const isImproved = Boolean(
    improvedResult &&
    newScore > oldScore &&
    (improvedResult.assessment_status === 'Partially verified' || improvedResult.assessment_status === 'Verified by user evidence')
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="before-after-title"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
    >
      <div
        className={`max-w-3xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 ${
          highContrast
            ? 'bg-black text-yellow-300 border-2 border-yellow-400'
            : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-2">
          <TrendingUp className="w-6 h-6 text-emerald-500" />
          <h2 id="before-after-title" className="text-xl sm:text-2xl font-black">
            {t.beforeAfterTitle}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6">
          {t.beforeAfterSubtitle}
        </p>

        {/* Friendly Inline Error */}
        {modalError && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 mb-6 text-xs sm:text-sm font-semibold"
          >
            {modalError}
          </div>
        )}

        {/* Side by side comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Before Card */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Before Fix
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                Score: {oldScore} ({oldLabel})
              </span>
            </div>
            {beforePhoto ? (
              <img
                src={beforePhoto}
                alt="Entrance before accessibility modification"
                className="w-full h-48 object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-48 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-400">
                Initial Photo
              </div>
            )}
          </div>

          {/* After Card */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                After Fix
              </span>
              {improvedResult ? (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Score: {newScore} ({newLabel})
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-400">Awaiting Photo</span>
              )}
            </div>

            {afterPhoto ? (
              <img
                src={afterPhoto}
                alt="Entrance after accessibility modification"
                className="w-full h-48 object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-48 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center gap-2 p-4 text-center">
                <Upload className="w-6 h-6 text-teal-600" />
                <label className="cursor-pointer text-xs font-bold text-teal-600 hover:underline">
                  <span>Upload After Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={useSampleAfterRamp}
                  className="text-xs px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800"
                >
                  Or Try Demo Ramp Photo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Improvement Celebration Banner */}
        {improvedResult && isImproved && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl mb-6 flex items-start gap-4 animate-in slide-in-from-bottom">
            <CheckCircle className="w-8 h-8 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-black">{t.improvedBanner}</h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-900/60 uppercase">
                  {improvedResult.assessment_status}
                </span>
              </div>
              <p className="text-sm mt-1">
                {t.scoreProgression} <strong>{oldScore} ({oldLabel}) → {newScore} ({newLabel})</strong>
              </p>
              <p className="text-xs text-emerald-100 mt-1">
                {t.resolvedNotice}
              </p>
            </div>
          </div>
        )}

        {/* Neutral Message if not improved */}
        {improvedResult && !isImproved && (
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 mb-6 flex items-start gap-3">
            <p className="text-xs sm:text-sm font-medium">
              No clear improvement detected. Try a clearer photo.
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 min-h-[44px]"
          >
            {t.close}
          </button>

          {!improvedResult && afterPhoto && (
            <button
              type="button"
              onClick={runBeforeAfterAnalysis}
              disabled={analyzing}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-2 min-h-[44px]"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.evaluatingFix}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Verify Improvement</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
