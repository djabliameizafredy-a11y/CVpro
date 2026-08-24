'use client';

import React, { useState } from 'react';
import { X, Mail, Loader2, Sparkles, Copy, Download, RefreshCw } from 'lucide-react';
import { CVData } from '@/lib/cv/types';

interface CoverLetterModalProps {
  cv: CVData;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

type Tone = 'professional' | 'enthusiastic' | 'concise' | 'bold';

const TONES: { id: Tone; fr: string; en: string; hintFr: string; hintEn: string }[] = [
  { id: 'professional', fr: 'Professionnel', en: 'Professional', hintFr: 'Ton classique et formel', hintEn: 'Classic formal tone' },
  { id: 'enthusiastic', fr: 'Enthousiaste', en: 'Enthusiastic', hintFr: 'Ton chaleureux et motivé', hintEn: 'Warm and motivated' },
  { id: 'concise', fr: 'Concis', en: 'Concise', hintFr: 'Court et percutant', hintEn: 'Short and punchy' },
  { id: 'bold', fr: 'Audacieux', en: 'Bold', hintFr: 'Ton direct et confiant', hintEn: 'Direct and confident' }
];

export const CoverLetterModal: React.FC<CoverLetterModalProps> = ({ cv, isOpen, onClose, isDarkMode = true }) => {
  const isFr = cv.lang === 'fr';
  const [tone, setTone] = useState<Tone>('professional');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [letter, setLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const panelClass = isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800';
  const inputClass = isDarkMode
    ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500'
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500';

  const generate = async () => {
    setIsLoading(true);
    setError(null);
    setLetter('');
    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cv,
          lang: cv.lang,
          tone,
          companyName: companyName.trim(),
          jobDescription: jobDescription.trim()
        })
      });
      const data = await res.json();
      if (!res.ok || !data.letter) {
        throw new Error(data.error || 'Generation failed');
      }
      setLetter(data.letter);
    } catch (err) {
      setError(err instanceof Error ? err.message : isFr ? 'Erreur lors de la génération' : 'Generation error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyLetter = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  const downloadLetter = () => {
    const blob = new Blob([letter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lettre_Motivation_${cv.personal.lastName || 'Candidat'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm ${
        isDarkMode ? 'bg-slate-950/80' : 'bg-slate-900/50'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={isFr ? 'Lettre de motivation' : 'Cover letter'}
      onClick={onClose}
    >
      <div
        className={`border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl p-6 space-y-5 animate-fade-in ${panelClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex justify-between items-center border-b pb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20">
              <Mail className="w-6 h-6" aria-hidden />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {isFr ? 'Lettre de motivation' : 'Cover letter'}
              </h2>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {isFr ? 'Générée à partir du contenu réel de votre CV' : 'Generated from your actual CV content'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
            aria-label={isFr ? 'Fermer' : 'Close'}
          >
            <X className="w-5 h-5" aria-hidden />
          </button>
        </div>

        {/* Tone selector */}
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {isFr ? 'Ton de la lettre' : 'Letter tone'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TONES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition text-center ${
                  tone === t.id
                    ? 'bg-rose-600 border-rose-400 text-white shadow-lg'
                    : isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                <span className="block">{isFr ? t.fr : t.en}</span>
                <span className={`block text-[9px] font-normal mt-0.5 ${tone === t.id ? 'text-white/75' : isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {isFr ? t.hintFr : t.hintEn}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Company name */}
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} htmlFor="company-name">
            {isFr ? "Nom de l'entreprise (optionnel)" : 'Company name (optional)'}
          </label>
          <input
            id="company-name"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder={isFr ? 'ex: TechPro Solutions' : 'e.g. TechPro Solutions'}
            className={`w-full rounded-lg px-3 py-2 text-xs border ${inputClass}`}
          />
        </div>

        {/* Job description */}
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} htmlFor="job-desc">
            {isFr ? "Offre d'emploi visée (optionnel, pour personnaliser)" : 'Target job offer (optional, to personalize)'}
          </label>
          <textarea
            id="job-desc"
            rows={3}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder={isFr ? "Collez le texte de l'offre pour une lettre sur-mesure..." : 'Paste the job posting for a tailored letter...'}
            className={`w-full rounded-lg px-3 py-2 text-xs leading-relaxed border ${inputClass}`}
          />
        </div>

        {/* Generate button */}
        <button
          onClick={generate}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white text-sm font-bold px-4 py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-rose-600/20"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden /> : <Sparkles className="w-5 h-5" aria-hidden />}
          {isLoading
            ? isFr
              ? 'Rédaction en cours...'
              : 'Writing...'
            : letter
              ? isFr
                ? 'Régénérer la lettre'
                : 'Regenerate letter'
              : isFr
                ? 'Générer ma lettre de motivation'
                : 'Generate my cover letter'}
        </button>

        {error && <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-500 text-xs p-3">{error}</div>}

        {/* Result */}
        {isLoading && (
          <div className={`rounded-xl border p-5 space-y-3 ${isDarkMode ? 'border-slate-700 bg-slate-800/40' : 'border-slate-200 bg-slate-50'}`}>
            <div className="h-3 rounded ai-shimmer w-1/2" />
            <div className="h-3 rounded ai-shimmer w-full" />
            <div className="h-3 rounded ai-shimmer w-11/12" />
            <div className="h-3 rounded ai-shimmer w-4/5" />
            <div className="h-3 rounded ai-shimmer w-2/3" />
          </div>
        )}

        {letter && !isLoading && (
          <div className="space-y-3 animate-fade-in">
            <div
              className={`border rounded-xl p-5 text-xs leading-relaxed whitespace-pre-wrap font-serif-lora ${
                isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
              }`}
            >
              {letter}
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyLetter}
                className={`flex-1 text-xs font-bold px-4 py-2.5 rounded-lg border transition flex items-center justify-center gap-2 ${
                  copied
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : isDarkMode
                      ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                }`}
              >
                <Copy className="w-4 h-4" aria-hidden />
                {copied ? (isFr ? 'Copié ✓' : 'Copied ✓') : isFr ? 'Copier' : 'Copy'}
              </button>
              <button
                onClick={downloadLetter}
                className={`flex-1 text-xs font-bold px-4 py-2.5 rounded-lg border transition flex items-center justify-center gap-2 ${
                  isDarkMode
                    ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                }`}
              >
                <Download className="w-4 h-4" aria-hidden />
                {isFr ? 'Télécharger (.txt)' : 'Download (.txt)'}
              </button>
              <button
                onClick={generate}
                className={`text-xs font-bold px-4 py-2.5 rounded-lg border transition flex items-center justify-center gap-2 ${
                  isDarkMode
                    ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                }`}
                title={isFr ? 'Régénérer' : 'Regenerate'}
              >
                <RefreshCw className="w-4 h-4" aria-hidden />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
