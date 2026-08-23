'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Sparkles, Trophy, Lightbulb, Bot, Loader2, X } from 'lucide-react';
import { evaluateAtsScore, actionVerbsFr, actionVerbsEn } from '@/lib/cv/aiHelpers';
import { CVData } from '@/lib/cv/types';

export interface AiAtsResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  keywords: string[];
  summary: string;
}

interface AtsCheckerModalProps {
  cv: CVData;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
  onRunAiAnalysis: (jobDescription: string) => Promise<AiAtsResult | null>;
  aiLoading: boolean;
  aiError?: string | null;
  aiResult?: AiAtsResult | null;
}

export const AtsCheckerModal: React.FC<AtsCheckerModalProps> = ({
  cv,
  isOpen,
  onClose,
  isDarkMode = true,
  onRunAiAnalysis,
  aiLoading,
  aiError,
  aiResult
}) => {
  const [mode, setMode] = useState<'classic' | 'ai'>('classic');
  const [jobDescription, setJobDescription] = useState('');
  const isFr = cv.lang === 'fr';

  if (!isOpen) return null;

  const result = evaluateAtsScore(cv);
  const actionVerbs = isFr ? actionVerbsFr : actionVerbsEn;

  const panelClass = isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800';

  const runAnalysis = async () => {
    if (jobDescription.trim().length < 30) return;
    await onRunAiAnalysis(jobDescription.trim());
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm ${
        isDarkMode ? 'bg-slate-950/80' : 'bg-slate-900/50'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={isFr ? 'Analyse ATS' : 'ATS Analysis'}
      onClick={onClose}
    >
      <div
        className={`border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl p-6 space-y-6 animate-fade-in ${panelClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex justify-between items-center border-b pb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/10 text-sky-500 rounded-xl border border-sky-500/20">
              <Sparkles className="w-6 h-6" aria-hidden />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {isFr ? 'Analyse ATS & Score de CV' : 'ATS Analysis & CV Score'}
              </h2>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {isFr ? 'Optimisez votre CV pour passer les filtres automatiques' : 'Optimize your resume to pass automated recruitment filters'}
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

        {/* Mode switch */}
        <div className={`flex gap-2 p-1 rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
          <button
            onClick={() => setMode('classic')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mode === 'classic'
                ? 'bg-sky-600 text-white shadow'
                : isDarkMode
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" aria-hidden />
            {isFr ? 'Score classique' : 'Classic score'}
          </button>
          <button
            onClick={() => setMode('ai')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mode === 'ai'
                ? 'bg-gradient-to-r from-sky-600 to-emerald-600 text-white shadow'
                : isDarkMode
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5" aria-hidden />
            {isFr ? 'Analyse IA + Offre' : 'AI + Job match'}
          </button>
        </div>

        {/* ═══ CLASSIC MODE ═══ */}
        {mode === 'classic' && (
          <>
            {/* Score Card */}
            <div
              className={`border rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-6 ${
                isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`relative flex items-center justify-center w-20 h-20 rounded-full border-4 border-sky-500 text-2xl font-black shadow-inner ${
                    isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
                  }`}
                  role="status"
                  aria-label={`ATS ${result.score}%`}
                >
                  {result.score}%
                </div>
                <div>
                  <div className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isFr ? 'Évaluation Globale' : 'Overall Assessment'}
                  </div>
                  <div className={`text-xl font-bold capitalize mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {result.level === 'excellent' && (isFr ? 'Excellent 🚀' : 'Excellent 🚀')}
                    {result.level === 'good' && (isFr ? 'Très bon 👍' : 'Great Job 👍')}
                    {result.level === 'average' && (isFr ? 'Moyen ⚠️' : 'Average ⚠️')}
                    {result.level === 'needs_work' && (isFr ? 'À compléter 📝' : 'Needs Work 📝')}
                  </div>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {result.score >= 80
                      ? isFr
                        ? 'Votre CV comporte tous les éléments clés pour être bien indexé par les ATS.'
                        : 'Your resume meets all key criteria for high indexing.'
                      : isFr
                        ? "Complétez les sections ci-dessous pour augmenter vos chances d'entretien."
                        : 'Complete the missing sections below to improve your chances.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-amber-500 text-xs bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20 font-semibold shrink-0">
                <Trophy className="w-4 h-4 shrink-0" aria-hidden />
                <span>{isFr ? 'Format A4 compatible' : 'A4 Ready Format'}</span>
              </div>
            </div>

            {/* Checks List */}
            <div className="space-y-3">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {isFr ? 'Points de contrôle' : 'Checklist Criteria'}
              </h3>
              <div className="grid gap-2.5">
                {result.checks.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 transition ${
                      c.passed
                        ? isDarkMode
                          ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : isDarkMode
                          ? 'bg-slate-800/50 border-slate-700/80 text-slate-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {c.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" aria-hidden />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" aria-hidden />
                    )}
                    <div className="text-xs flex-1">
                      <div
                        className={`font-bold flex justify-between items-center ${
                          c.passed ? (isDarkMode ? 'text-emerald-100' : 'text-emerald-900') : isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        <span>{c.label}</span>
                        <span className="text-[10px] font-mono opacity-80">+{c.points} pts</span>
                      </div>
                      {!c.passed && <p className={`mt-1 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{c.recommendation}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action verbs */}
            <div className={`border rounded-xl p-4 space-y-2 ${isDarkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 text-xs font-bold text-sky-500 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" aria-hidden />
                <span>{isFr ? "Verbes d'action recommandés" : 'Recommended Action Verbs'}</span>
              </div>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {isFr ? 'Utilisez ces verbes puissants en début de puces pour décrire vos réussites :' : 'Start your bullet points with these strong action verbs:'}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {actionVerbs.map((verb) => (
                  <span
                    key={verb}
                    className={`border px-2.5 py-1 rounded-md text-xs font-medium ${
                      isDarkMode ? 'bg-slate-900 text-sky-300 border-slate-700' : 'bg-white text-sky-700 border-slate-200'
                    }`}
                  >
                    {verb}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ═══ AI MODE ═══ */}
        {mode === 'ai' && (
          <div className="space-y-4">
            <div
              className={`border rounded-xl p-4 space-y-3 ${
                isDarkMode ? 'bg-gradient-to-br from-slate-800/80 to-slate-900 border-slate-700' : 'bg-gradient-to-br from-sky-50 to-emerald-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-500" aria-hidden />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  {isFr ? 'Matching IA avec une offre d\'emploi' : 'AI job offer matching'}
                </h3>
              </div>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {isFr
                  ? "Collez le texte de l'offre d'emploi ci-dessous : l'IA analysera la compatibilité de votre CV avec le poste, identifiera les mots-clés manquants et vous donnera des recommandations concrètes."
                  : 'Paste the job offer text below: the AI will analyze how well your CV matches the role, find missing keywords and give concrete recommendations.'}
              </p>
              <textarea
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder={
                  isFr
                    ? "Collez ici la description du poste (missions, compétences requises, outils...)"
                    : 'Paste the job description here (missions, required skills, tools...)'
                }
                className={`w-full rounded-lg px-3 py-2 text-xs leading-relaxed ${
                  isDarkMode
                    ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500'
                }`}
              />
              <div className="flex items-center justify-between gap-3">
                <span className={`text-[10px] ${jobDescription.trim().length < 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {jobDescription.trim().length < 30
                    ? isFr
                      ? `Minimum 30 caractères (${jobDescription.trim().length}/30)`
                      : `Minimum 30 characters (${jobDescription.trim().length}/30)`
                    : isFr
                      ? 'Prêt à analyser ✓'
                      : 'Ready to analyze ✓'}
                </span>
                <button
                  onClick={runAnalysis}
                  disabled={jobDescription.trim().length < 30 || aiLoading}
                  className="bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <Sparkles className="w-4 h-4" aria-hidden />}
                  {aiLoading ? (isFr ? 'Analyse en cours...' : 'Analyzing...') : isFr ? 'Lancer l\'analyse IA' : 'Run AI analysis'}
                </button>
              </div>
            </div>

            {aiError && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-500 text-xs p-3">{aiError}</div>
            )}

            {aiLoading && (
              <div className={`rounded-xl border p-4 space-y-3 ${isDarkMode ? 'border-slate-700 bg-slate-800/40' : 'border-slate-200 bg-slate-50'}`}>
                <div className="h-3 rounded ai-shimmer w-3/4" />
                <div className="h-3 rounded ai-shimmer w-full" />
                <div className="h-3 rounded ai-shimmer w-5/6" />
              </div>
            )}

            {aiResult && !aiLoading && (
              <div className="space-y-4 animate-fade-in">
                {/* AI score */}
                <div
                  className={`border rounded-xl p-5 flex items-center gap-5 ${
                    isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-20 h-20 rounded-full border-4 text-2xl font-black shrink-0 ${
                      aiResult.score >= 75
                        ? 'border-emerald-500 text-emerald-500'
                        : aiResult.score >= 50
                          ? 'border-amber-500 text-amber-500'
                          : 'border-rose-500 text-rose-500'
                    }`}
                    role="status"
                  >
                    {aiResult.score}%
                  </div>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{aiResult.summary}</p>
                </div>

                {/* Strengths */}
                {aiResult.strengths.length > 0 && (
                  <div className={`rounded-xl border p-4 space-y-2 ${isDarkMode ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-emerald-50 border-emerald-200'}`}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" aria-hidden />
                      {isFr ? 'Points forts' : 'Strengths'}
                    </h4>
                    <ul className="space-y-1.5">
                      {aiResult.strengths.map((s, i) => (
                        <li key={i} className={`text-xs flex gap-2 ${isDarkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
                          <span className="shrink-0">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weaknesses */}
                {aiResult.weaknesses.length > 0 && (
                  <div className={`rounded-xl border p-4 space-y-2 ${isDarkMode ? 'bg-amber-950/20 border-amber-800/40' : 'bg-amber-50 border-amber-200'}`}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" aria-hidden />
                      {isFr ? 'Axes d\'amélioration' : 'Improvements'}
                    </h4>
                    <ul className="space-y-1.5">
                      {aiResult.weaknesses.map((w, i) => (
                        <li key={i} className={`text-xs flex gap-2 ${isDarkMode ? 'text-amber-100' : 'text-amber-900'}`}>
                          <span className="shrink-0">→</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Keywords */}
                {aiResult.keywords.length > 0 && (
                  <div className={`rounded-xl border p-4 space-y-2 ${isDarkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-500 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4" aria-hidden />
                      {isFr ? 'Mots-clés à ajouter au CV' : 'Keywords to add to your CV'}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {aiResult.keywords.map((k, i) => (
                        <span
                          key={i}
                          className={`border px-2.5 py-1 rounded-md text-xs font-medium ${
                            isDarkMode ? 'bg-slate-900 text-sky-300 border-slate-700' : 'bg-white text-sky-700 border-slate-200'
                          }`}
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
