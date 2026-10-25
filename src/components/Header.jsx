import React, { useState } from 'react';
import { DoorOpen, Globe, Type, Eye, ShieldCheck, X, Sparkles } from 'lucide-react';

export default function Header({
  lang,
  setLang,
  textScale,
  setTextScale,
  highContrast,
  setHighContrast,
  t
}) {
  const [showPrivacy, setShowPrivacy] = useState(false);

  const cycleTextScale = () => {
    if (textScale === 'normal') setTextScale('large');
    else if (textScale === 'large') setTextScale('xlarge');
    else setTextScale('normal');
  };

  const textScaleLabel = textScale === 'normal' ? 'A' : textScale === 'large' ? 'A+' : 'A++';

  return (
    <>
      <header
        role="banner"
        className={`w-full border-b transition-colors ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-900 dark:text-white border-slate-200 dark:border-slate-800'
        } sticky top-0 z-40`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shadow-md ${
                highContrast
                  ? 'bg-yellow-400 text-black border-2 border-yellow-400'
                  : 'bg-gradient-to-tr from-teal-600 to-cyan-500 text-white'
              }`}
            >
              <DoorOpen className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight">
                  {t.appName}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    highContrast
                      ? 'bg-yellow-300 text-black'
                      : 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300'
                  }`}
                >
                  ACCESSPROOF
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Controls: Language, Text Size, High Contrast, Privacy */}
          <div className="flex items-center gap-2" role="toolbar" aria-label="Accessibility & Preferences">
            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all min-h-[44px] ${
                highContrast
                  ? 'bg-black text-yellow-300 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100'
              }`}
              aria-label={`Switch language to ${t.languageToggle}`}
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
              <span>{t.languageToggle}</span>
            </button>

            {/* Text Scale Toggle */}
            <button
              type="button"
              onClick={cycleTextScale}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold transition-all min-h-[44px] ${
                highContrast
                  ? 'bg-black text-yellow-300 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100'
              }`}
              title={`${t.textScale}: ${textScaleLabel}`}
              aria-label={`${t.textScale}: currently ${textScaleLabel}. Tap to change font size.`}
            >
              <Type className="w-4 h-4" aria-hidden="true" />
              <span className="w-6 text-center">{textScaleLabel}</span>
            </button>

            {/* High Contrast Toggle */}
            <button
              type="button"
              onClick={() => setHighContrast(!highContrast)}
              className={`p-2.5 rounded-lg text-sm font-semibold transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
                highContrast
                  ? 'bg-yellow-400 text-black border-2 border-yellow-400'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100'
              }`}
              title={highContrast ? t.normalContrast : t.contrastToggle}
              aria-label={highContrast ? t.normalContrast : t.contrastToggle}
              aria-pressed={highContrast}
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Privacy Modal Button */}
            <button
              type="button"
              onClick={() => setShowPrivacy(true)}
              className={`p-2.5 rounded-lg text-sm font-semibold transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
                highContrast
                  ? 'bg-black text-yellow-300 border-2 border-yellow-400'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
              title={t.privacyBtn}
              aria-label={t.privacyBtn}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Privacy & Responsible AI Modal */}
      {showPrivacy && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-modal-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            className={`max-w-md w-full rounded-2xl p-6 shadow-2xl ${
              highContrast
                ? 'bg-black text-yellow-300 border-2 border-yellow-400'
                : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                <h2 id="privacy-modal-title" className="text-lg font-bold">
                  {t.privacyTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacy(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label={t.close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 mb-5">
              {t.privacyBody}
            </p>
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3 text-xs text-emerald-800 dark:text-emerald-300 mb-5 flex items-start gap-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Theme 3: Beyond the Screen — Designed for responsible, honest, zero-hallucination accessibility.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowPrivacy(false)}
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors min-h-[48px]"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
