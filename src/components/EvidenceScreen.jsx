import React, { useState } from 'react';
import { HelpCircle, CheckCircle, Upload, Ruler, Check, ChevronRight, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';

export default function EvidenceScreen({
  auditData,
  onReAnalyze,
  loading,
  highContrast,
  t
}) {
  const needsVerification = auditData?.needs_verification || [];
  
  // Track evidence per item: { [itemKey]: { type, value, photoData } }
  const [evidenceMap, setEvidenceMap] = useState({});
  const [typedInputs, setTypedInputs] = useState({});

  const handleConfirmChoice = (itemTitle, value, type) => {
    setEvidenceMap(prev => ({
      ...prev,
      [itemTitle]: { item: itemTitle, value, type }
    }));
  };

  const handleTypedMeasurement = (itemTitle, unit = 'cm') => {
    const val = typedInputs[itemTitle];
    if (val && val.trim()) {
      handleConfirmChoice(itemTitle, `${val.trim()} ${unit}`, 'measurement');
    }
  };

  const handlePhotoUpload = (itemTitle, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setEvidenceMap(prev => ({
          ...prev,
          [itemTitle]: {
            item: itemTitle,
            value: `Photo evidence attached for ${itemTitle}`,
            type: 'photo',
            photoData: dataUrl
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const useSampleDoorwayEvidence = (itemTitle) => {
    fetch('/samples/doorway_85cm.jpg')
      .then(r => r.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setEvidenceMap(prev => ({
            ...prev,
            [itemTitle]: {
              item: itemTitle,
              value: 'Front view photo showing 85 cm clear width (with measuring tape)',
              type: 'photo',
              photoData: e.target.result
            }
          }));
        };
        reader.readAsDataURL(blob);
      });
  };

  const handleSkip = (itemTitle) => {
    const newMap = { ...evidenceMap };
    delete newMap[itemTitle];
    setEvidenceMap(newMap);
  };

  const handleSubmit = () => {
    const evidenceList = Object.values(evidenceMap);
    const extraImages = evidenceList
      .filter(e => e.photoData)
      .map(e => ({ data: e.photoData, mimeType: 'image/jpeg', role: 'evidence' }));

    onReAnalyze(evidenceList, extraImages);
  };

  const confirmedCount = Object.keys(evidenceMap).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 mb-3">
          <HelpCircle className="w-4 h-4" />
          <span>AccessProof Uncertainty Check</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          {t.evidenceTitle}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          {t.evidenceSubtitle}
        </p>
      </div>

      {/* Uncertainty Cards */}
      {needsVerification.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
            No Missing Evidence
          </h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
            All key accessibility parameters have been either clearly observed or confirmed by you.
          </p>
        </div>
      ) : (
        <div className="space-y-6 mb-8">
          {needsVerification.map((req, idx) => {
            const isConfirmed = Boolean(evidenceMap[req.item]);
            const currentEvidence = evidenceMap[req.item];

            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all ${
                  isConfirmed
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : highContrast
                    ? 'bg-black text-yellow-300 border-yellow-400'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      Unverified Parameter #{idx + 1}
                    </span>
                    <h3 className="text-lg font-bold">{req.item}</h3>
                  </div>
                  {isConfirmed && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Added
                    </span>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 mb-4">
                  <p>
                    <strong className="text-slate-800 dark:text-slate-100">{t.evidenceWhy}</strong> {req.why}
                  </p>
                  <p>
                    <strong className="text-slate-800 dark:text-slate-100">{t.evidenceRequested}</strong> {req.evidenceRequested}
                  </p>
                </div>

                {/* Evidence Input Options */}
                {isConfirmed ? (
                  <div className="p-3 rounded-xl bg-emerald-100/60 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                      ✓ {currentEvidence.value}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSkip(req.item)}
                      className="text-xs font-bold text-red-600 hover:underline ml-2"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                    {/* Option 1: Quick Confirm Buttons based on item type */}
                    <div className="flex flex-wrap gap-2">
                      {req.item.toLowerCase().includes('ramp') && (
                        <button
                          type="button"
                          onClick={() => handleConfirmChoice(req.item, 'Confirmed: There is NO ramp at this entrance', 'confirm')}
                          className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-700 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 transition-colors min-h-[44px]"
                        >
                          Confirm "No ramp exists"
                        </button>
                      )}

                      {req.item.toLowerCase().includes('door') && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleConfirmChoice(req.item, 'Door opens outwards (away from entrance)', 'confirm')}
                            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-700 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 transition-colors min-h-[44px]"
                          >
                            Door opens outward
                          </button>
                          <button
                            type="button"
                            onClick={() => useSampleDoorwayEvidence(req.item)}
                            className="px-3 py-2 rounded-xl text-xs font-bold bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-300 dark:border-teal-700 hover:bg-teal-100 transition-colors flex items-center gap-1.5 min-h-[44px]"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Attach Demo 85 cm Doorway Photo
                          </button>
                        </>
                      )}

                      {req.item.toLowerCase().includes('threshold') && (
                        <button
                          type="button"
                          onClick={() => handleConfirmChoice(req.item, 'Threshold is flat (<1 cm flush level)', 'confirm')}
                          className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-700 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 transition-colors min-h-[44px]"
                        >
                          Confirm flush threshold (&lt;1 cm)
                        </button>
                      )}
                    </div>

                    {/* Option 2: Enter typed measurement */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Ruler className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input
                          type="text"
                          placeholder="Or type measurement (e.g. 85 cm or 1:12)"
                          value={typedInputs[req.item] || ''}
                          onChange={(e) => setTypedInputs({ ...typedInputs, [req.item]: e.target.value })}
                          className={`w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border min-h-[44px] ${
                            highContrast
                              ? 'bg-black text-yellow-300 border-yellow-400'
                              : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100'
                          }`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTypedMeasurement(req.item)}
                        disabled={!typedInputs[req.item]?.trim()}
                        className="px-4 py-2.5 bg-teal-600 disabled:opacity-50 hover:bg-teal-700 text-white rounded-xl text-xs font-bold min-h-[44px]"
                      >
                        Save
                      </button>
                    </div>

                    {/* Option 3: Custom file upload for this evidence item */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <label className="cursor-pointer text-teal-600 dark:text-teal-400 hover:underline font-semibold flex items-center gap-1.5 p-1 min-h-[40px]">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload photo for {req.item}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(req.item, e)}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleSkip(req.item)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 min-h-[40px]"
                      >
                        {t.optionSkip}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Re-run Button */}
      <div className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          {confirmedCount > 0
            ? `You have provided evidence for ${confirmedCount} item(s). Re-analyzing will upgrade the assessment status to "Partially verified" or "Verified by user evidence".`
            : t.skipNotice}
        </p>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3 mx-auto min-h-[56px] ${
            highContrast
              ? 'bg-yellow-400 text-black border-2 border-yellow-400'
              : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/30'
          }`}
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>{t.reAnalyzing}</span>
            </>
          ) : (
            <>
              <span>{t.reAnalyzeBtn}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
