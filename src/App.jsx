import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImpactCounter from './components/ImpactCounter';
import Stepper from './components/Stepper';
import ScanScreen from './components/ScanScreen';
import EvidenceScreen from './components/EvidenceScreen';
import ReportScreen from './components/ReportScreen';
import FixCards from './components/FixCards';
import OwnerLetter from './components/OwnerLetter';
import CommunityMap from './components/CommunityMap';
import SlopeReader from './components/SlopeReader';
import BeforeAfterModal from './components/BeforeAfterModal';
import PlacardModal from './components/PlacardModal';
import { translations } from './translations';
import { RotateCcw, QrCode, AlertCircle, X } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('opendoor_lang') || 'en');
  const [textScale, setTextScale] = useState('normal'); // 'normal' | 'large' | 'xlarge'
  const [highContrast, setHighContrast] = useState(false);
  const [activeStep, setActiveStep] = useState('scan'); // 'scan' | 'evidence' | 'report' | 'fix' | 'letter' | 'map'
  const [referenceObject, setReferenceObject] = useState('coin');

  // Impact Counter stored in localStorage
  const [impact, setImpact] = useState(() => {
    const saved = localStorage.getItem('opendoor_impact_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { audited: 0, barriersFound: 0, barriersFixed: 0 };
  });

  // Current photo & audit results
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // User confirmed evidence accumulated
  const [accumulatedEvidence, setAccumulatedEvidence] = useState([]);
  const [extraPhotos, setExtraPhotos] = useState([]);

  // Modals
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [showPlacard, setShowPlacard] = useState(false);

  // Sync language with localStorage
  useEffect(() => {
    localStorage.setItem('opendoor_lang', lang);
  }, [lang]);

  // Sync impact with localStorage
  useEffect(() => {
    localStorage.setItem('opendoor_impact_v2', JSON.stringify(impact));
  }, [impact]);

  // Apply Accessible Font Scaling to root document (scales all rem units)
  useEffect(() => {
    if (textScale === 'normal') {
      document.documentElement.style.fontSize = '16px';
    } else if (textScale === 'large') {
      document.documentElement.style.fontSize = '19px';
    } else if (textScale === 'xlarge') {
      document.documentElement.style.fontSize = '22px';
    }
  }, [textScale]);

  // Sync high contrast mode on html element
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  const t = translations[lang] || translations.en;

  // Initial Scan: Call real AI API
  const handleInitialScan = async (dataUrl) => {
    setCurrentPhoto(dataUrl);
    setLoading(true);
    setError(null);
    setAccumulatedEvidence([]);
    setExtraPhotos([]);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: [{ data: dataUrl, mimeType: 'image/jpeg', role: 'primary' }],
          referenceObject,
          language: lang,
          userEvidence: []
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server error (${response.status})`);
      }

      const data = await response.json();
      setAuditData(data);

      // Increment impact counter
      setImpact(prev => ({
        ...prev,
        audited: prev.audited + 1,
        barriersFound: prev.barriersFound + (data.barriers?.length || 1)
      }));

      // Navigate to report
      setActiveStep('report');
    } catch (err) {
      console.error('Scan error:', err);
      setError(err.message || 'Failed to complete AI entrance audit.');
    } finally {
      setLoading(false);
    }
  };

  // Re-run Analysis with Evidence (AccessProof Verification)
  const handleReAnalyze = async (newEvidenceList, newImages) => {
    setLoading(true);
    setError(null);

    const mergedEvidence = [...accumulatedEvidence, ...newEvidenceList];
    const mergedImages = [...extraPhotos, ...newImages];
    setAccumulatedEvidence(mergedEvidence);
    setExtraPhotos(mergedImages);

    try {
      const imagesPayload = [
        { data: currentPhoto, mimeType: 'image/jpeg', role: 'primary' },
        ...mergedImages
      ];

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: imagesPayload,
          referenceObject,
          language: lang,
          userEvidence: mergedEvidence
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server error (${response.status})`);
      }

      const data = await response.json();
      setAuditData(data);
      setActiveStep('report');
    } catch (err) {
      console.error('Re-analyze error:', err);
      setError(err.message || 'Failed to re-verify audit.');
    } finally {
      setLoading(false);
    }
  };

  // Slope measurement applied from phone inclinometer
  const handleApplySlope = (slopeData) => {
    handleReAnalyze([slopeData], []);
  };

  // Barrier resolved in before/after
  const handleResolveFix = () => {
    setImpact(prev => ({
      ...prev,
      barriersFixed: prev.barriersFixed + 1
    }));
  };

  const handleResetAudit = () => {
    setCurrentPhoto(null);
    setAuditData(null);
    setAccumulatedEvidence([]);
    setExtraPhotos([]);
    setError(null);
    setActiveStep('scan');
  };

  const hasAudit = Boolean(auditData);
  const hasEvidenceNeeded = Boolean(auditData?.needs_verification?.length > 0);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors font-scale-${textScale} ${
        highContrast ? 'high-contrast-mode' : ''
      }`}
    >
      {/* Header with Bilingual & Accessibility Tools */}
      <Header
        lang={lang}
        setLang={setLang}
        textScale={textScale}
        setTextScale={setTextScale}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        t={t}
      />

      {/* Community Impact Counter */}
      <ImpactCounter
        impact={impact}
        highContrast={highContrast}
        t={t}
      />

      {/* Workflow Stepper */}
      <Stepper
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        hasAudit={hasAudit}
        hasEvidenceNeeded={hasEvidenceNeeded}
        highContrast={highContrast}
        t={t}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full pb-16">
        {/* Global dismissible error banner on any screen */}
        {error && (
          <div className="max-w-4xl mx-auto px-4 pt-4">
            <div
              role="alert"
              aria-live="assertive"
              className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border-2 border-red-500 text-red-900 dark:text-red-200 flex items-start gap-3 shadow-md"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm font-semibold">
                {error}
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 transition-colors"
                aria-label="Dismiss error banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Secondary Quick Action Bar when audit is active */}
        {hasAudit && (
          <div className="max-w-4xl mx-auto px-4 pt-4 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleResetAudit}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 min-h-[40px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetAll}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPlacard(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700 flex items-center gap-1.5 min-h-[40px]"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Print Placard with QR</span>
            </button>
          </div>
        )}

        {/* Step 1: Scan */}
        {activeStep === 'scan' && (
          <ScanScreen
            onImageSelected={handleInitialScan}
            loading={loading}
            error={error}
            referenceObject={referenceObject}
            setReferenceObject={setReferenceObject}
            highContrast={highContrast}
            lang={lang}
            t={t}
          />
        )}

        {/* Step 2: Evidence Check (AccessProof Core Rule) */}
        {activeStep === 'evidence' && hasAudit && (
          <EvidenceScreen
            auditData={auditData}
            onReAnalyze={handleReAnalyze}
            loading={loading}
            highContrast={highContrast}
            t={t}
          />
        )}

        {/* Step 3: Audit Report */}
        {activeStep === 'report' && hasAudit && (
          <>
            <ReportScreen
              auditData={auditData}
              onGoToEvidence={() => setActiveStep('evidence')}
              onGoToFixes={() => setActiveStep('fix')}
              onOpenBeforeAfter={() => setShowBeforeAfter(true)}
              highContrast={highContrast}
              lang={lang}
              t={t}
            />

            {/* Embedded Inclinometer Tool */}
            <div className="max-w-4xl mx-auto px-4 mt-6">
              <SlopeReader
                onApplySlope={handleApplySlope}
                highContrast={highContrast}
                t={t}
              />
            </div>
          </>
        )}

        {/* Step 4: Practical Low-Cost Fixes */}
        {activeStep === 'fix' && hasAudit && (
          <FixCards
            auditData={auditData}
            onGoToLetter={() => setActiveStep('letter')}
            highContrast={highContrast}
            t={t}
          />
        )}

        {/* Step 5: Owner Request Letter & WhatsApp */}
        {activeStep === 'letter' && hasAudit && (
          <OwnerLetter
            auditData={auditData}
            highContrast={highContrast}
            lang={lang}
            t={t}
          />
        )}

        {/* Step 6: Community Map */}
        {activeStep === 'map' && (
          <CommunityMap
            currentAudit={auditData}
            highContrast={highContrast}
            t={t}
          />
        )}
      </main>

      {/* Before / After Transformation Modal */}
      <BeforeAfterModal
        isOpen={showBeforeAfter}
        onClose={() => setShowBeforeAfter(false)}
        beforePhoto={currentPhoto}
        auditData={auditData}
        onResolveFix={handleResolveFix}
        highContrast={highContrast}
        t={t}
      />

      {/* Printable Placard Modal */}
      <PlacardModal
        isOpen={showPlacard}
        onClose={() => setShowPlacard(false)}
        auditData={auditData}
        highContrast={highContrast}
        t={t}
      />
    </div>
  );
}
