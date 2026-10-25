import React from 'react';
import { Wrench, UserCheck, IndianRupee, ArrowRight, MessageSquare, CheckCircle2, Hammer } from 'lucide-react';

export default function FixCards({
  auditData,
  onGoToLetter,
  highContrast,
  t
}) {
  const barriers = auditData?.barriers || [];
  const totalCost = auditData?.total_cost_range_inr || [3000, 6000];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700 mb-3">
          <Wrench className="w-4 h-4" />
          <span>Practical Barrier Removal</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          {t.fixesTitle}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          {t.fixesSubtitle}
        </p>
      </div>

      {/* Total Project Cost Banner */}
      <div
        className={`p-6 rounded-2xl mb-8 flex flex-wrap items-center justify-between gap-4 border shadow-md transition-colors ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 dark:from-slate-800 dark:to-slate-900 border-emerald-300 dark:border-emerald-800'
        }`}
      >
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {t.totalProjectEstimate}
          </span>
          <div className="text-3xl font-black text-emerald-800 dark:text-emerald-300 mt-1 flex items-center">
            <span>₹{totalCost[0]?.toLocaleString()} – ₹{totalCost[1]?.toLocaleString()}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Based on standard materials and local Indian craftsman day rates.
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToLetter}
          className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm shadow-lg flex items-center gap-2 min-h-[48px]"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Generate Owner Letter</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Cards for each barrier */}
      <div className="space-y-6 mb-10">
        {barriers.map((barrier, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border transition-all ${
              highContrast
                ? 'bg-black text-yellow-300 border-yellow-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-xs font-black uppercase">
                  {t.priority} #{barrier.priority || idx + 1}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {barrier.title}
                </h3>
              </div>

              {/* Price badge */}
              {barrier.cost_range_inr && (
                <div className="flex items-center gap-1 font-black text-base text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <IndianRupee className="w-4 h-4" />
                  <span>₹{barrier.cost_range_inr[0].toLocaleString()} – ₹{barrier.cost_range_inr[1].toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Cheapest Fix Solution */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 mb-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Cheapest Practical Fix:
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {barrier.fix}
              </p>
            </div>

            {/* Craftsman & Execution Details */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Hammer className="w-4 h-4 text-amber-500" />
                <span>
                  <strong>{t.whoCanDoIt}</strong> {barrier.who_can_do_it || 'Local carpenter or welder'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 font-semibold">
                  Affects: {(barrier.affects || ['wheelchair', 'walker']).join(', ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
