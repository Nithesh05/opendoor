import React from 'react';
import { X, Printer, QrCode, DoorOpen, CheckCircle, ShieldCheck } from 'lucide-react';

export default function PlacardModal({
  isOpen,
  onClose,
  auditData,
  highContrast,
  t
}) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const status = auditData?.assessment_status || 'Verified by user evidence';
  const score = auditData?.scores?.wheelchair?.label === 'Accessible' ? 85 : 75;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
    >
      <div
        className={`max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 ${
          highContrast
            ? 'bg-black text-yellow-300 border-2 border-yellow-400'
            : 'bg-white text-slate-900'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl hover:bg-slate-100 text-slate-500"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Area */}
        <div id="printable-placard" className="p-6 rounded-2xl border-2 border-slate-900 bg-white text-slate-900 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
              <DoorOpen className="w-5 h-5" />
            </div>
            <span className="font-black text-xl tracking-tight">OPEN DOOR</span>
          </div>

          <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-4">
            Accessibility Audit Pass
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4 inline-block">
            {/* Clean SVG QR code placeholder */}
            <div className="w-36 h-36 bg-slate-900 rounded-lg p-2 mx-auto flex items-center justify-center">
              <QrCode className="w-28 h-28 text-white" />
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">
              SCAN TO VIEW ENTRANCE AUDIT
            </div>
          </div>

          <div className="text-sm font-bold text-slate-800 mb-1">
            Status: {status}
          </div>
          <div className="text-xs text-slate-600 mb-4">
            Audited via Open Door AccessProof with honest verification.
          </div>

          <div className="text-[10px] text-slate-400 border-t pt-3 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI estimate verified by user evidence. Verify on site.</span>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-between gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 min-h-[44px]"
          >
            {t.close}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow flex items-center gap-2 min-h-[44px]"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printPlacard}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
