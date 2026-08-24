'use client';

import React, { useState, useRef } from 'react';
import {
  FileText,
  Wand2,
  Trash2,
  Printer,
  Globe,
  Sparkles,
  Image as ImageIcon,
  FileType,
  ChevronDown,
  Loader2,
  Sun,
  Moon,
  Bot,
  Mail,
  CloudDownload,
  CloudUpload,
  Save,
  Home
} from 'lucide-react';
import { CVData } from '@/lib/cv/types';

interface HeaderProps {
  cv: CVData;
  isDarkMode?: boolean;
  onToggleAppTheme?: () => void;
  onLoadSample: () => void;
  onClear: () => void;
  onExportJson?: () => void;
  onImportJson?: (data: CVData) => void;
  onPrint: () => void;
  onExportPdf: () => void;
  onExportImage: () => void;
  onToggleLang: () => void;
  onOpenAtsModal: () => void;
  onOpenAiAssistant: () => void;
  onOpenCoverLetter: () => void;
  onOpenSavedCvs: () => void;
  onSaveToCloud: () => void;
  isSavingCloud?: boolean;
  atsScore: number;
  isExportingPdf?: boolean;
  isExportingImage?: boolean;
  onBackHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cv,
  isDarkMode = true,
  onToggleAppTheme,
  onLoadSample,
  onClear,
  onExportJson,
  onImportJson,
  onPrint,
  onExportPdf,
  onExportImage,
  onToggleLang,
  onOpenAtsModal,
  onOpenAiAssistant,
  onOpenCoverLetter,
  onOpenSavedCvs,
  onSaveToCloud,
  isSavingCloud = false,
  atsScore,
  isExportingPdf = false,
  isExportingImage = false,
  onBackHome
}) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isFr = cv.lang === 'fr';

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (score >= 60) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  };

  const btnBgClass = isDarkMode
    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300';

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImportJson) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed && parsed.personal) onImportJson(parsed as CVData);
      } catch {
        // invalid JSON ignored
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header
      className={`no-print px-4 md:px-6 py-3 flex flex-wrap justify-between items-center gap-3 sticky top-0 z-50 border-b transition-colors duration-200 shadow-md ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}
      role="banner"
    >
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        {onBackHome && (
          <button
            onClick={onBackHome}
            className={`${btnBgClass} text-xs font-semibold px-2 py-1.5 rounded-lg border transition flex items-center gap-1 shrink-0`}
            title={isFr ? "Retour à l'accueil" : 'Back to home'}
            aria-label={isFr ? "Retour à l'accueil" : 'Back to home'}
          >
            <Home className="w-3.5 h-3.5" aria-hidden />
          </button>
        )}
        <div className="bg-gradient-to-tr from-sky-600 to-emerald-500 text-white p-2.5 rounded-xl shadow-lg shadow-sky-500/20 flex items-center justify-center">
          <FileText className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`font-extrabold text-lg tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              CV Builder
            </h1>
            <span className="bg-emerald-500/20 text-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-widest">
              Pro
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 bg-gradient-to-r from-sky-500/15 to-emerald-500/15 text-sky-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-500/30 uppercase tracking-widest">
              <Sparkles className="w-3 h-3" aria-hidden /> IA
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {isFr ? 'Créateur de CV IA — Copilote, ATS & Export PDF' : 'AI CV Builder — Copilot, ATS & PDF Export'}
          </p>
        </div>
      </div>

      {/* Middle: ATS Score Indicator */}
      <button
        onClick={onOpenAtsModal}
        className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition hover:scale-105 ${getScoreBadgeColor(atsScore)}`}
        title={isFr ? "Cliquez pour voir l'analyse ATS" : 'Click to view ATS score analysis'}
      >
        <Sparkles className="w-3.5 h-3.5" aria-hidden />
        <span>ATS {atsScore}%</span>
      </button>

      {/* Right Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* AI Assistant */}
        <button
          onClick={onOpenAiAssistant}
          className="bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-lg border border-sky-400/40 transition flex items-center gap-1.5 shadow-lg shadow-sky-600/20 active:scale-95"
          title={isFr ? 'Copilote IA : générez et améliorez vos contenus' : 'AI Copilot: generate and improve content'}
        >
          <Bot className="w-4 h-4" aria-hidden />
          <span className="hidden md:inline">{isFr ? 'Copilote IA' : 'AI Copilot'}</span>
        </button>

        {/* Cover Letter */}
        <button
          onClick={onOpenCoverLetter}
          className={`${btnBgClass} text-xs font-semibold px-2.5 py-2 rounded-lg border transition flex items-center gap-1.5`}
          title={isFr ? 'Générer une lettre de motivation avec l\'IA' : 'Generate an AI cover letter'}
        >
          <Mail className="w-3.5 h-3.5 text-rose-400" aria-hidden />
          <span className="hidden lg:inline">{isFr ? 'Lettre' : 'Letter'}</span>
        </button>

        {/* Cloud: Save + Load */}
        <div className="flex items-center rounded-lg overflow-hidden border border-slate-600/50">
          <button
            onClick={onSaveToCloud}
            disabled={isSavingCloud}
            className={`${btnBgClass} border-0 rounded-none text-xs font-semibold px-2.5 py-2 transition flex items-center gap-1.5 disabled:opacity-50`}
            title={isFr ? 'Sauvegarder ce CV dans le cloud' : 'Save this CV to the cloud'}
          >
            {isSavingCloud ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" aria-hidden />
            ) : (
              <Save className="w-3.5 h-3.5 text-emerald-500" aria-hidden />
            )}
          </button>
          <button
            onClick={onOpenSavedCvs}
            className={`${btnBgClass} border-0 rounded-l-none text-xs font-semibold px-2.5 py-2 transition flex items-center gap-1.5`}
            title={isFr ? 'Mes CV sauvegardés' : 'My saved CVs'}
          >
            <CloudDownload className="w-3.5 h-3.5 text-sky-400" aria-hidden />
          </button>
        </div>

        {/* App Theme Toggle (Light / Dark Mode) */}
        {onToggleAppTheme && (
          <button
            onClick={onToggleAppTheme}
            className={`${btnBgClass} text-xs font-semibold px-2.5 py-2 rounded-lg border transition flex items-center gap-1.5`}
            title={isDarkMode ? (isFr ? 'Passer en Mode Clair' : 'Switch to Light Mode') : isDarkMode ? 'Passer en Mode Sombre' : 'Switch to Dark Mode'}
            aria-label={isFr ? 'Basculer le thème' : 'Toggle theme'}
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden /> : <Moon className="w-3.5 h-3.5 text-slate-600" aria-hidden />}
            <span className="hidden sm:inline font-medium">{isDarkMode ? (isFr ? 'Clair' : 'Light') : isFr ? 'Sombre' : 'Dark'}</span>
          </button>
        )}

        {/* Language Toggle */}
        <button
          onClick={onToggleLang}
          className={`${btnBgClass} text-xs font-semibold px-2.5 py-2 rounded-lg border transition flex items-center gap-1.5`}
          title={isFr ? 'Changer la langue (FR/EN)' : 'Switch language (FR/EN)'}
        >
          <Globe className="w-3.5 h-3.5 text-sky-500" aria-hidden />
          <span>{cv.lang.toUpperCase()}</span>
        </button>

        {/* Sample Data */}
        <button
          onClick={onLoadSample}
          className={`${btnBgClass} text-xs font-semibold px-3 py-2 rounded-lg border transition flex items-center gap-1.5`}
          title={isFr ? "Charger les données d'exemple" : 'Load sample data'}
        >
          <Wand2 className="w-3.5 h-3.5 text-amber-500" aria-hidden />
          <span className="hidden md:inline">{isFr ? 'Exemple' : 'Sample'}</span>
        </button>

        {/* Clear */}
        <button
          onClick={onClear}
          className={`${btnBgClass} text-xs font-semibold px-3 py-2 rounded-lg border transition flex items-center gap-1.5`}
          title={isFr ? 'Réinitialiser le formulaire' : 'Clear all fields'}
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-500" aria-hidden />
          <span className="hidden lg:inline">{isFr ? 'Vider' : 'Clear'}</span>
        </button>

        {/* Export Dropdown Group */}
        <div className="relative">
          <div className="inline-flex rounded-lg shadow-lg shadow-sky-600/20">
            <button
              onClick={onExportPdf}
              disabled={isExportingPdf || isExportingImage}
              className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3.5 py-2 rounded-l-lg transition flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isExportingPdf ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <FileType className="w-4 h-4" aria-hidden />}
              <span>{isFr ? 'Télécharger PDF' : 'Download PDF'}</span>
            </button>

            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="bg-sky-700 hover:bg-sky-600 text-white px-2 py-2 rounded-r-lg border-l border-sky-500/50 transition flex items-center justify-center"
              title={isFr ? "Plus d'options d'export" : 'More export options'}
              aria-label={isFr ? 'Options export' : 'Export options'}
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} aria-hidden />
            </button>
          </div>

          {/* Export Dropdown Menu */}
          {isExportMenuOpen && (
            <div
              className={`absolute right-0 mt-2 w-56 rounded-xl shadow-2xl z-50 py-1 overflow-hidden border ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}
              onMouseLeave={() => setIsExportMenuOpen(false)}
              role="menu"
            >
              <button
                onClick={() => {
                  setIsExportMenuOpen(false);
                  onExportPdf();
                }}
                disabled={isExportingPdf}
                className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2.5 transition disabled:opacity-50 ${
                  isDarkMode ? 'hover:bg-slate-700 hover:text-white text-slate-200' : 'hover:bg-slate-100 hover:text-slate-900 text-slate-700'
                }`}
              >
                {isExportingPdf ? <Loader2 className="w-4 h-4 animate-spin text-sky-500" aria-hidden /> : <FileType className="w-4 h-4 text-sky-500" aria-hidden />}
                <div>
                  <div className="font-semibold">{isFr ? 'Document PDF (.pdf)' : 'PDF Document (.pdf)'}</div>
                  <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isFr ? 'Format vectoriel prêt à imprimer' : 'Print-ready vector format'}
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsExportMenuOpen(false);
                  onExportImage();
                }}
                disabled={isExportingImage}
                className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2.5 transition border-t disabled:opacity-50 ${
                  isDarkMode
                    ? 'border-slate-700/50 hover:bg-slate-700 hover:text-white text-slate-200'
                    : 'border-slate-200 hover:bg-slate-100 hover:text-slate-900 text-slate-700'
                }`}
              >
                {isExportingImage ? <Loader2 className="w-4 h-4 animate-spin text-emerald-500" aria-hidden /> : <ImageIcon className="w-4 h-4 text-emerald-500" aria-hidden />}
                <div>
                  <div className="font-semibold">{isFr ? 'Image HD (.png)' : 'HD Image (.png)'}</div>
                  <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isFr ? 'Haute définition 300 DPI' : 'High resolution 300 DPI'}
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsExportMenuOpen(false);
                  onPrint();
                }}
                className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2.5 transition border-t ${
                  isDarkMode
                    ? 'border-slate-700/50 hover:bg-slate-700 hover:text-white text-slate-200'
                    : 'border-slate-200 hover:bg-slate-100 hover:text-slate-900 text-slate-700'
                }`}
              >
                <Printer className="w-4 h-4 text-amber-500" aria-hidden />
                <div>
                  <div className="font-semibold">{isFr ? 'Imprimer / Aperçu' : 'Print / Native Preview'}</div>
                  <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isFr ? "Dialogue d'impression système" : 'System print dialog'}
                  </div>
                </div>
              </button>

              {onExportJson && (
                <button
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    onExportJson?.();
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2.5 transition border-t ${
                    isDarkMode
                      ? 'border-slate-700/50 hover:bg-slate-700 hover:text-white text-slate-200'
                      : 'border-slate-200 hover:bg-slate-100 hover:text-slate-900 text-slate-700'
                  }`}
                >
                  <CloudUpload className="w-4 h-4 text-violet-500" aria-hidden />
                  <div>
                    <div className="font-semibold">{isFr ? 'Export JSON (.json)' : 'Export JSON (.json)'}</div>
                    <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {isFr ? 'Sauvegarde locale portable' : 'Portable local backup'}
                    </div>
                  </div>
                </button>
              )}

              {onImportJson && (
                <button
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    handleImportClick();
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2.5 transition border-t ${
                    isDarkMode
                      ? 'border-slate-700/50 hover:bg-slate-700 hover:text-white text-slate-200'
                      : 'border-slate-200 hover:bg-slate-100 hover:text-slate-900 text-slate-700'
                  }`}
                >
                  <CloudDownload className="w-4 h-4 text-teal-500" aria-hidden />
                  <div>
                    <div className="font-semibold">{isFr ? 'Importer JSON' : 'Import JSON'}</div>
                    <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {isFr ? 'Restaurer une sauvegarde' : 'Restore a backup'}
                    </div>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input for JSON import */}
      <input ref={fileInputRef} type="file" accept="application/json" onChange={handleFileChange} className="hidden" aria-hidden />
    </header>
  );
};
