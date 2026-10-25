import React, { useState } from 'react';
import { MessageSquare, Copy, Check, Edit3, Send, ShieldCheck, Sparkles } from 'lucide-react';

export default function OwnerLetter({
  auditData,
  highContrast,
  lang,
  t
}) {
  const initialLetter = auditData?.owner_letter || `Dear Building Owner / Manager,

I recently visited your premises and noticed that with a few affordable modifications, your entrance could become welcoming and accessible for wheelchair users, elderly people with walkers, and customers with low vision.

Currently, the following entrance barriers were identified:
${(auditData?.barriers || []).map(b => `- ${b.title}: Can be resolved with ${b.fix} (Est: ₹${b.cost_range_inr?.[0]}–₹${b.cost_range_inr?.[1] || ''})`).join('\n')}

Estimated Total Cost: ₹${auditData?.total_cost_range_inr?.[0] || '3,000'} – ₹${auditData?.total_cost_range_inr?.[1] || '6,000'}.
Local carpenters or welders can easily complete this work in 1–2 days.

Making your entrance barrier-free will expand your clientele and ensure no customer is turned away. We would love to celebrate your improved entrance on our community accessibility map!

Sincerely,
A Community Member via Open Door AccessProof`;

  const [letterText, setLetterText] = useState(initialLetter);
  const [isEditing, setIsEditing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(letterText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700 mb-3">
          <MessageSquare className="w-4 h-4" />
          <span>Advocacy & Action</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          {t.letterTitle}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          {t.letterSubtitle}
        </p>
      </div>

      {/* Letter Box */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-lg mb-6 transition-all ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {lang === 'ta' ? 'தமிழ் கடிதம்' : 'English Request Letter'}
          </span>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1.5 p-1 min-h-[40px]"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? t.saveLetter : t.editLetter}</span>
          </button>
        </div>

        {isEditing ? (
          <textarea
            value={letterText}
            onChange={(e) => setLetterText(e.target.value)}
            rows={14}
            className={`w-full p-4 rounded-2xl border text-xs sm:text-sm font-mono leading-relaxed resize-y ${
              highContrast
                ? 'bg-black text-yellow-300 border-yellow-400'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100'
            }`}
          />
        ) : (
          <div className="whitespace-pre-wrap text-xs sm:text-sm font-sans leading-relaxed text-slate-800 dark:text-slate-200">
            {letterText}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        <button
          type="button"
          onClick={handleCopy}
          className={`px-6 py-3.5 rounded-2xl font-bold text-sm shadow transition-all flex items-center gap-2 min-h-[48px] ${
            isCopied
              ? 'bg-emerald-600 text-white'
              : highContrast
              ? 'bg-yellow-400 text-black border-2 border-yellow-400'
              : 'bg-slate-800 hover:bg-slate-900 text-white'
          }`}
        >
          {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{isCopied ? t.copied : t.copyLetter}</span>
        </button>

        <button
          type="button"
          onClick={handleWhatsApp}
          className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm shadow-lg flex items-center gap-2 min-h-[48px]"
        >
          <Send className="w-4 h-4" />
          <span>{t.shareWhatsApp}</span>
        </button>
      </div>

      {/* Privacy Notice Reminder */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>{t.whatsAppNotice}</span>
      </div>
    </div>
  );
}
