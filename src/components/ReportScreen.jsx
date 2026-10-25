import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Accessibility,
  Eye,
  Footprints,
  ShieldAlert,
  Volume2,
  Play,
  Pause,
  Square,
  HelpCircle,
  Sparkles,
  Info,
  ArrowRight,
  TrendingUp,
  VolumeX
} from 'lucide-react';

export default function ReportScreen({
  auditData,
  onGoToEvidence,
  onGoToFixes,
  onOpenBeforeAfter,
  highContrast,
  lang,
  t
}) {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isPausedVoice, setIsPausedVoice] = useState(false);
  const [voiceVoiceUnavailable, setVoiceUnavailable] = useState(false);

  // Status computation
  const status = auditData.assessment_status || 'Incomplete';
  const isProvisional = auditData.score_is_provisional !== false;
  const scoreRange = auditData.score_range || {
    wheelchair: [20, 45],
    walker: [30, 55],
    low_vision: [40, 65]
  };

  const scores = auditData.scores || {};
  const observed = auditData.observed || [];
  const needsVerification = auditData.needs_verification || [];
  const userConfirmed = auditData.user_confirmed || [];
  const barriers = auditData.barriers || [];
  const sensoryTags = auditData.sensory_tags || [];
  const walkthroughText = auditData.walkthrough_text || '';

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Web Speech API Walkthrough
  const handlePlayVoice = () => {
    if (!('speechSynthesis' in window)) {
      setVoiceUnavailable(true);
      return;
    }

    if (isPausedVoice) {
      window.speechSynthesis.resume();
      setIsPlayingVoice(true);
      setIsPausedVoice(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(walkthroughText);
    utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
    utterance.rate = 0.95;

    // Check if Tamil voice exists on device
    if (lang === 'ta') {
      const voices = window.speechSynthesis.getVoices();
      const taVoice = voices.find(v => v.lang.includes('ta'));
      if (!taVoice) {
        setVoiceUnavailable(true);
      } else {
        utterance.voice = taVoice;
      }
    }

    utterance.onend = () => {
      setIsPlayingVoice(false);
      setIsPausedVoice(false);
    };

    utterance.onerror = () => {
      setIsPlayingVoice(false);
      setIsPausedVoice(false);
      setVoiceUnavailable(true);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlayingVoice(true);
    setIsPausedVoice(false);
  };

  const handlePauseVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPlayingVoice(false);
      setIsPausedVoice(true);
    }
  };

  const handleStopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingVoice(false);
      setIsPausedVoice(false);
    }
  };

  // Helper for persona card status styling
  const getPersonaStyle = (scoreOrRange, label) => {
    const avg = Array.isArray(scoreOrRange)
      ? (scoreOrRange[0] + scoreOrRange[1]) / 2
      : scoreOrRange;

    const lowerLabel = (label || '').toLowerCase();
    if (avg >= 70 || lowerLabel.includes('accessible') || lowerLabel.includes('எளிதாக')) {
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500',
        badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
        text: 'text-emerald-700 dark:text-emerald-300',
        icon: CheckCircle,
        label: t.accessible
      };
    } else if (avg >= 40 || lowerLabel.includes('difficult') || lowerLabel.includes('சிரமமானது')) {
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-500',
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
        text: 'text-amber-700 dark:text-amber-300',
        icon: AlertTriangle,
        label: t.difficult
      };
    } else {
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-500',
        badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300',
        text: 'text-rose-700 dark:text-rose-300',
        icon: ShieldAlert,
        label: t.blocked
      };
    }
  };

  // Status banner content
  const renderStatusBanner = () => {
    if (status === 'Verified by user evidence') {
      return (
        <div className="p-5 rounded-2xl bg-emerald-500 text-white shadow-lg mb-8 flex items-start gap-4">
          <CheckCircle className="w-8 h-8 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black">{t.statusVerified}</h2>
              <span className="text-xs bg-emerald-900/60 text-emerald-100 px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
                Full Confidence
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">{t.statusVerifiedDesc}</p>
          </div>
        </div>
      );
    } else if (status === 'Partially verified') {
      return (
        <div className="p-5 rounded-2xl bg-cyan-600 text-white shadow-lg mb-8 flex items-start gap-4">
          <Clock className="w-8 h-8 shrink-0 mt-0.5 text-cyan-200" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black">{t.statusPartial}</h2>
              <span className="text-xs bg-cyan-900/60 text-cyan-100 px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
                Partial Evidence
              </span>
            </div>
            <p className="text-xs sm:text-sm text-cyan-100 mt-1">{t.statusPartialDesc}</p>
          </div>
        </div>
      );
    } else {
      // Incomplete
      return (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg mb-8 flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 shrink-0 mt-0.5 text-amber-200" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black">{t.statusIncomplete}</h2>
              <span className="text-xs bg-amber-900/60 text-amber-100 px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
                {t.provisionalRange}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-100 mt-1">{t.statusIncompleteDesc}</p>
            {needsVerification.length > 0 && (
              <button
                type="button"
                onClick={onGoToEvidence}
                className="mt-3 px-4 py-2 bg-white text-amber-900 font-bold rounded-xl text-xs shadow hover:bg-amber-50 transition-all flex items-center gap-1.5"
              >
                <span>Resolve {needsVerification.length} Unverified Item(s)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in">
      {/* Top Banner */}
      {renderStatusBanner()}

      {/* 3 Persona Cards: Wheelchair, Walker, Low-Vision */}
      <section aria-label="User Persona Accessibility Breakdown" className="mb-10">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Accessibility Findings by Mobility Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Wheelchair Card */}
          {(() => {
            const range = scoreRange.wheelchair || [20, 45];
            const info = scores.wheelchair || {};
            const style = getPersonaStyle(range, info.label);
            const StatusIcon = style.icon;

            return (
              <div
                className={`p-5 rounded-2xl border-2 transition-all shadow-sm ${
                  highContrast
                    ? 'bg-black text-yellow-300 border-yellow-400'
                    : style.bg
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Accessibility className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span>{t.wheelchairUser}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1 ${style.badge}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {info.label || style.label}
                  </span>
                </div>

                <div className="my-2">
                  <div className="text-2xl font-black tracking-tight">
                    {isProvisional ? `${range[0]}–${range[1]} / 100` : `${range[1]} / 100`}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {isProvisional ? t.provisionalRange : 'Verified Score'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3">
                  {info.reason || 'Step barrier and unknown doorway clearance obstruct unassisted access.'}
                </p>
              </div>
            );
          })()}

          {/* Walker & Elderly Card */}
          {(() => {
            const range = scoreRange.walker || [30, 55];
            const info = scores.walker || {};
            const style = getPersonaStyle(range, info.label);
            const StatusIcon = style.icon;

            return (
              <div
                className={`p-5 rounded-2xl border-2 transition-all shadow-sm ${
                  highContrast
                    ? 'bg-black text-yellow-300 border-yellow-400'
                    : style.bg
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Footprints className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span>{t.walkerUser}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1 ${style.badge}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {info.label || style.label}
                  </span>
                </div>

                <div className="my-2">
                  <div className="text-2xl font-black tracking-tight">
                    {isProvisional ? `${range[0]}–${range[1]} / 100` : `${range[1]} / 100`}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {isProvisional ? t.provisionalRange : 'Verified Score'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3">
                  {info.reason || 'Steps require handrail support and stable footing.'}
                </p>
              </div>
            );
          })()}

          {/* Low-Vision Card */}
          {(() => {
            const range = scoreRange.low_vision || [40, 65];
            const info = scores.low_vision || {};
            const style = getPersonaStyle(range, info.label);
            const StatusIcon = style.icon;

            return (
              <div
                className={`p-5 rounded-2xl border-2 transition-all shadow-sm ${
                  highContrast
                    ? 'bg-black text-yellow-300 border-yellow-400'
                    : style.bg
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Eye className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span>{t.lowVisionUser}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1 ${style.badge}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {info.label || style.label}
                  </span>
                </div>

                <div className="my-2">
                  <div className="text-2xl font-black tracking-tight">
                    {isProvisional ? `${range[0]}–${range[1]} / 100` : `${range[1]} / 100`}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {isProvisional ? t.provisionalRange : 'Verified Score'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3">
                  {info.reason || 'High contrast nosing and tactile alerts are needed on steps.'}
                </p>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Voice Walkthrough & "Simulate My Route" */}
      <section
        aria-label="Spoken First-Person Walkthrough"
        className={`mb-10 p-6 rounded-2xl border shadow-md transition-colors ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-emerald-500/10 dark:from-slate-800 dark:to-slate-900 border-teal-200 dark:border-teal-800'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <div>
              <h3 className="font-bold text-base sm:text-lg">{t.voiceTitle}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.voiceSubtitle}</p>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center gap-2">
            {!isPlayingVoice ? (
              <button
                type="button"
                onClick={handlePlayVoice}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow min-h-[44px]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isPausedVoice ? t.resumeVoice : t.playVoice}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePauseVoice}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow min-h-[44px]"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>{t.pauseVoice}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleStopVoice}
              disabled={!isPlayingVoice && !isPausedVoice}
              className="p-2.5 bg-slate-200 dark:bg-slate-700 disabled:opacity-40 hover:bg-slate-300 rounded-xl text-xs min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={t.stopVoice}
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Voice Unavailable Notice */}
        {voiceVoiceUnavailable && (
          <div className="p-3 mb-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2 border border-amber-300 dark:border-amber-700">
            <VolumeX className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{t.voiceUnavailable}</span>
          </div>
        )}

        {/* ALWAYS SHOW TRANSCRIPT */}
        <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          <strong className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            {t.transcriptTitle}:
          </strong>
          <p className="italic">"{walkthroughText}"</p>
        </div>
      </section>

      {/* ACCESSPROOF 3 SECTIONS: Observed | Needs Verification | User-Confirmed */}
      <section aria-label="AccessProof Categorization" className="mb-10 space-y-6">
        {/* 1. OBSERVED */}
        <div
          className={`p-6 rounded-2xl border ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-emerald-700 dark:text-emerald-400">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{t.observedTitle}</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
              {t.observedTag}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{t.observedTip}</p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 list-disc list-inside">
            {observed.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>

        {/* 2. NEEDS VERIFICATION */}
        <div
          className={`p-6 rounded-2xl border ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-amber-700 dark:text-amber-400">
              <HelpCircle className="w-5 h-5 shrink-0" />
              <span>{t.needsVerificationTitle}</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
              {needsVerification.length} Pending
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{t.needsVerificationTip}</p>

          {needsVerification.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              All items have been verified by user evidence!
            </p>
          ) : (
            <div className="space-y-3">
              {needsVerification.map((req, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm"
                >
                  <div className="font-bold text-slate-800 dark:text-slate-100">{req.item}</div>
                  <div className="text-slate-600 dark:text-slate-300 mt-0.5">
                    <strong>Evidence needed:</strong> {req.evidence_requested}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={onGoToEvidence}
                className="mt-2 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 p-1 min-h-[40px]"
              >
                <span>Upload evidence or enter measurements in Evidence Screen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* 3. USER-CONFIRMED */}
        <div
          className={`p-6 rounded-2xl border ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-cyan-700 dark:text-cyan-400">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{t.userConfirmedTitle}</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300">
              {t.confirmedByUser}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{t.userConfirmedTip}</p>

          {userConfirmed.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              {t.noUserConfirmed}
            </p>
          ) : (
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 list-disc list-inside">
              {userConfirmed.map((fact, idx) => (
                <li key={idx} className="leading-relaxed font-medium">
                  {fact}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Barrier List */}
      <section aria-label="Identified Accessibility Barriers" className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{t.barriersTitle}</h3>
          <span className="text-xs font-semibold text-slate-500">{barriers.length} Found</span>
        </div>

        <div className="space-y-4">
          {barriers.map((barrier, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all ${
                highContrast
                  ? 'bg-black text-yellow-300 border-yellow-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                    #{barrier.priority || idx + 1}
                  </span>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {barrier.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      barrier.severity === 'red'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : barrier.severity === 'yellow'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {barrier.severity === 'red' ? t.blocked : barrier.severity === 'yellow' ? t.difficult : t.accessible}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                    Confidence: {barrier.confidence || 'Medium'}
                  </span>
                </div>
              </div>

              {/* Estimated measurement */}
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-3">
                <span className="font-bold uppercase tracking-wider text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 mr-1.5 text-slate-700 dark:text-slate-200">
                  {t.estimated}
                </span>
                <span>{barrier.estimated_measurement || 'Physical step barrier obstructing wheeled approach.'}</span>
              </div>

              {/* Fix recommendation preview */}
              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs sm:text-sm text-teal-900 dark:text-teal-200 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <strong>Recommended Fix:</strong> {barrier.fix}
                </div>
                {barrier.cost_range_inr && (
                  <span className="font-bold text-teal-800 dark:text-teal-300">
                    ₹{barrier.cost_range_inr[0].toLocaleString()} – ₹{barrier.cost_range_inr[1].toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sensory Tags */}
      {sensoryTags.length > 0 && (
        <section aria-label="Estimated Sensory Environment" className="mb-10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Sensory Tags (Estimates):
          </h4>
          <div className="flex flex-wrap gap-2">
            {sensoryTags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700"
              >
                👁️ {tag} (Estimated)
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Action Navigation: Next Step & Fixes Screen Button */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
            Actionable Next Step
          </span>
          <p className="text-sm sm:text-base font-semibold mt-1">
            {auditData.next_step || 'View practical low-cost fixes and generate owner request letter.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onGoToFixes}
            className="px-6 py-3 bg-white text-teal-900 hover:bg-teal-50 font-bold rounded-xl text-sm shadow transition-all flex items-center gap-2 min-h-[48px]"
          >
            <span>View Fixes & Costs (₹)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenBeforeAfter}
            className="px-4 py-3 bg-teal-800/80 hover:bg-teal-800 text-white font-bold rounded-xl text-sm transition-all flex items-center gap-1.5 min-h-[48px]"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Before / After Check</span>
          </button>
        </div>
      </div>

      {/* Mandatory Disclaimer Footer */}
      <footer className="text-center text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-800">
        <p className="font-semibold">{t.disclaimer}</p>
        <p className="mt-1 italic">{t.closingMotto}</p>
      </footer>
    </div>
  );
}
