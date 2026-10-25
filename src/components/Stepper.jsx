import React from 'react';
import { Camera, HelpCircle, FileText, Wrench, MessageSquare, MapPin } from 'lucide-react';

export default function Stepper({ activeStep, setActiveStep, hasAudit, hasEvidenceNeeded, highContrast, t }) {
  const steps = [
    { id: 'scan', label: t.stepScan, icon: Camera, enabled: true },
    { id: 'evidence', label: t.stepEvidence, icon: HelpCircle, enabled: hasAudit && hasEvidenceNeeded },
    { id: 'report', label: t.stepReport, icon: FileText, enabled: hasAudit },
    { id: 'fix', label: t.stepFix, icon: Wrench, enabled: hasAudit },
    { id: 'letter', label: t.stepLetter, icon: MessageSquare, enabled: hasAudit },
    { id: 'map', label: t.stepMap, icon: MapPin, enabled: true }
  ];

  return (
    <nav
      aria-label="Audit Progress Workflow"
      className={`w-full overflow-x-auto py-2.5 px-4 border-b ${
        highContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between min-w-[620px] gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;
          const isEnabled = step.enabled;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isEnabled}
              onClick={() => isEnabled && setActiveStep(step.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] ${
                isActive
                  ? highContrast
                    ? 'bg-yellow-400 text-black border-2 border-yellow-400'
                    : 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : isEnabled
                  ? highContrast
                    ? 'text-yellow-300 hover:bg-yellow-400/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'opacity-40 cursor-not-allowed text-slate-400'
              }`}
              aria-current={isActive ? 'step' : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{step.label}</span>
              {step.id === 'evidence' && hasEvidenceNeeded && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Evidence requested" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
