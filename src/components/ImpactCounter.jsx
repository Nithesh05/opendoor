import React from 'react';
import { Building2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ImpactCounter({ impact, highContrast, t }) {
  return (
    <section
      aria-label="Community Accessibility Impact"
      className={`w-full py-3.5 border-b transition-colors ${
        highContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : 'bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-cyan-500/10 dark:from-teal-950/40 dark:via-emerald-950/40 dark:to-cyan-950/40 border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-3 gap-2 sm:gap-4 text-center">
        {/* Places Audited */}
        <div className="flex flex-col items-center justify-center p-2 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            <span>{t.audited}</span>
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-teal-700 dark:text-teal-300 mt-0.5">
            {impact.audited}
          </span>
        </div>

        {/* Barriers Found */}
        <div className="flex flex-col items-center justify-center p-2 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
            <AlertTriangle className="w-4 h-4 text-amber-500" aria-hidden="true" />
            <span>{t.barriersFound}</span>
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-amber-600 dark:text-amber-400 mt-0.5">
            {impact.barriersFound}
          </span>
        </div>

        {/* Barriers Fixed */}
        <div className="flex flex-col items-center justify-center p-2 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-hidden="true" />
            <span>{t.barriersFixed}</span>
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 mt-0.5">
            {impact.barriersFixed}
          </span>
        </div>
      </div>
    </section>
  );
}
