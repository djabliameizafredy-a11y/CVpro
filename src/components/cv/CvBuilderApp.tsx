'use client';

import React, { useState, useEffect } from 'react';
import { Eye, PencilLine, Loader2 } from 'lucide-react';
import { CVData } from '@/lib/cv/types';
import { sampleCVFr, sampleCVEn, emptyCVState } from '@/lib/cv/sampleCV';
import { evaluateAtsScore } from '@/lib/cv/aiHelpers';
import { exportToPdf, exportToImage } from '@/lib/cv/exportHelpers';
import { Header } from '@/components/cv/Header';
import { EditorPanel, AiTarget } from '@/components/cv/EditorPanel';
import { GuidedAssistant } from '@/components/cv/GuidedAssistant';
import { CVPreview } from '@/components/cv/CVPreview';
import { AtsCheckerModal, AiAtsResult } from '@/components/cv/AtsCheckerModal';
import { AiAssistantModal } from '@/components/cv/AiAssistantModal';
import { CoverLetterModal } from '@/components/cv/CoverLetterModal';
import { SavedCvsDialog } from '@/components/cv/SavedCvsDialog';
import { ScaledPaper } from '@/components/cv/ScaledPaper';
import { useToast } from '@/hooks/use-toast';

const LOCAL_STORAGE_KEY = 'cv_builder_pro_data_v1';
const THEME_STORAGE_KEY = 'cv_builder_app_theme';

interface CvBuilderAppProps {
  onBackHome?: () => void;
}

export const CvBuilderApp: React.FC<CvBuilderAppProps> = ({ onBackHome }) => {
  const { toast } = useToast();

  const [cv, setCv] = useState<CVData>(sampleCVFr);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false);
  const [isSavedCvsOpen, setIsSavedCvsOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [aiLoadingKey, setAiLoadingKey] = useState<string | null>(null);

  // AI ATS state
  const [atsAiLoading, setAtsAiLoading] = useState(false);
  const [atsAiError, setAtsAiError] = useState<string | null>(null);
  const [atsAiResult, setAtsAiResult] = useState<AiAtsResult | null>(null);

  // Mobile view switch (editor / preview)
  const [leftTab, setLeftTab] = useState<'guide' | 'form'>('guide');
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  // ─── Hydrate from localStorage on mount (client-only) ───────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.personal) setCv(parsed as CVData);
      }
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) setIsDarkMode(savedTheme === 'dark');
    } catch {
      // fallback to default sample
    }
  }, []);

  // Auto save CV to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cv));
    } catch {
      // storage full (photo too big) — ignore
    }
  }, [cv]);

  // Auto save theme preference
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const isFr = cv.lang === 'fr';
  const atsResult = evaluateAtsScore(cv);

  // ─── Handlers ────────────────────────────────────────────────
  const handleToggleAppTheme = () => setIsDarkMode((prev) => !prev);

  const handleLoadSample = () => {
    if (confirm(isFr ? "Charger les données d'exemple pré-remplies ?" : 'Load sample pre-filled data?')) {
      setCv(isFr ? { ...sampleCVFr } : { ...sampleCVEn });
      toast({
        title: isFr ? 'Exemple chargé' : 'Sample loaded',
        description: isFr ? 'Les données de démonstration ont été appliquées.' : 'Demo data has been applied.'
      });
    }
  };

  const handleClear = () => {
    if (confirm(isFr ? 'Réinitialiser tous les champs du CV ?' : 'Clear all CV fields?')) {
      setCv({ ...emptyCVState, lang: cv.lang });
      toast({
        title: isFr ? 'CV réinitialisé' : 'CV cleared',
        description: isFr ? 'Tous les champs ont été vidés.' : 'All fields have been cleared.'
      });
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cv, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CV_${cv.personal.lastName || 'MonCV'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (importedData: CVData) => {
    setCv(importedData);
    toast({
      title: isFr ? 'CV importé' : 'CV imported',
      description: isFr ? 'Votre fichier JSON a été restauré avec succès.' : 'Your JSON file was restored successfully.'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      const fileName = `CV_${cv.personal.firstName || 'Nom'}_${cv.personal.lastName || 'Prenom'}`;
      await exportToPdf('cv-preview-container', fileName);
      toast({ title: isFr ? 'PDF généré' : 'PDF generated', description: isFr ? 'Téléchargement lancé.' : 'Download started.' });
    } catch {
      toast({
        title: isFr ? 'Erreur PDF' : 'PDF error',
        description: isFr ? "Erreur lors de l'exportation en PDF." : 'Error exporting PDF.',
        variant: 'destructive'
      });
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportImage = async () => {
    setIsExportingImage(true);
    try {
      const fileName = `CV_${cv.personal.firstName || 'Nom'}_${cv.personal.lastName || 'Prenom'}`;
      await exportToImage('cv-preview-container', fileName, 'png');
      toast({ title: isFr ? 'Image HD générée' : 'HD image generated', description: isFr ? 'Téléchargement lancé.' : 'Download started.' });
    } catch {
      toast({
        title: isFr ? 'Erreur Image' : 'Image error',
        description: isFr ? "Erreur lors de l'exportation en PNG." : 'Error exporting PNG.',
        variant: 'destructive'
      });
    } finally {
      setIsExportingImage(false);
    }
  };

  const handleToggleLang = () => {
    const newLang = cv.lang === 'fr' ? 'en' : 'fr';
    setCv({ ...cv, lang: newLang });
  };

  // ─── Cloud save ──────────────────────────────────────────────
  const handleSaveToCloud = async () => {
    const defaultName = `CV ${cv.personal.firstName} ${cv.personal.lastName}`.trim() || (isFr ? 'Mon CV' : 'My CV');
    const name = prompt(isFr ? 'Nom de cette version du CV :' : 'Name this CV version:', defaultName);
    if (!name) return;

    setIsSavingCloud(true);
    try {
      const res = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, lang: cv.lang, data: cv })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      toast({
        title: isFr ? 'Sauvegardé en ligne' : 'Saved online',
        description: isFr ? `"${name}" est disponible dans "Mes CV".` : `"${name}" is now available in "My CVs".`
      });
    } catch {
      toast({
        title: isFr ? 'Erreur de sauvegarde' : 'Save error',
        description: isFr ? 'Impossible de sauvegarder en ligne.' : 'Could not save online.',
        variant: 'destructive'
      });
    } finally {
      setIsSavingCloud(false);
    }
  };

  // ─── AI generation (editor inline buttons) ───────────────────
  const handleAiGenerate = async (target: AiTarget) => {
    const key =
      target.kind === 'project' ? `project:${target.projectId}` : target.kind === 'bullets' ? `bullets:${target.projectId}` : target.kind;
    setAiLoadingKey(key);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, cv, lang: cv.lang })
      });
      const data = await res.json();
      if (!res.ok || !data.result) throw new Error(data.error || 'Failed');

      const result = data.result as string | string[];

      if (target.kind === 'summary') {
        setCv((prev) => ({ ...prev, personal: { ...prev.personal, summary: String(result) } }));
      } else if (target.kind === 'qualities') {
        setCv((prev) => ({ ...prev, personal: { ...prev.personal, qualities: String(result) } }));
      } else if (target.kind === 'skills') {
        // result is a comma-separated keyword list — merge into a new category
        const tags = String(result);
        setCv((prev) => ({
          ...prev,
          skills: [
            ...prev.skills,
            {
              id: Date.now().toString(),
              category: isFr ? 'Compétences suggérées' : 'Suggested skills',
              tags
            }
          ]
        }));
      } else if (target.kind === 'project' || target.kind === 'bullets') {
        setCv((prev) => ({
          ...prev,
          projects: prev.projects.map((p) => {
            if (p.id !== target.projectId) return p;
            if (target.kind === 'project') {
              return { ...p, desc: String(result) };
            }
            return { ...p, bullets: Array.isArray(result) ? result : [String(result)] };
          })
        }));
      }

      toast({ title: isFr ? 'Contenu généré' : 'Content generated' });
    } catch {
      toast({
        title: isFr ? 'Erreur de génération' : 'Generation error',
        description: isFr ? "Le contenu n'a pas pu être généré. Réessayez." : 'The content could not be generated. Try again.',
        variant: 'destructive'
      });
    } finally {
      setAiLoadingKey(null);
    }
  };

  // ─── AI ATS analysis ─────────────────────────────────────────
  const handleRunAiAts = async (jobDescription: string): Promise<AiAtsResult | null> => {
    setAtsAiLoading(true);
    setAtsAiError(null);
    setAtsAiResult(null);
    try {
      const res = await fetch('/api/ai/ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cv, jobDescription, lang: cv.lang })
      });
      const data = await res.json();
      if (!res.ok || !data.result) throw new Error(data.error || 'Failed');
      setAtsAiResult(data.result as AiAtsResult);
      return data.result as AiAtsResult;
    } catch {
      const msg = isFr ? "L'analyse a échoué. Réessayez." : 'Analysis failed. Try again.';
      setAtsAiError(msg);
      return null;
    } finally {
      setAtsAiLoading(false);
    }
  };

  // ─── Load saved CV from cloud ────────────────────────────────
  const handleLoadSavedCv = (loaded: CVData, name: string) => {
    setCv(loaded);
    toast({
      title: isFr ? 'CV chargé' : 'CV loaded',
      description: isFr ? `"${name}" a été chargé dans l'éditeur.` : `"${name}" has been loaded into the editor.`
    });
  };

  const appShellBg = isDarkMode ? 'bg-zinc-950' : 'bg-zinc-100';

  return (
    <div
      className={`app-shell h-dvh flex flex-col overflow-hidden transition-colors duration-200 ${appShellBg}`}
      style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
    >
      <Header
        cv={cv}
        isDarkMode={isDarkMode}
        onToggleAppTheme={handleToggleAppTheme}
        onLoadSample={handleLoadSample}
        onClear={handleClear}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onPrint={handlePrint}
        onExportPdf={handleExportPdf}
        onExportImage={handleExportImage}
        onToggleLang={handleToggleLang}
        onOpenAtsModal={() => setIsAtsModalOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenCoverLetter={() => setIsCoverLetterOpen(true)}
        onOpenSavedCvs={() => setIsSavedCvsOpen(true)}
        onSaveToCloud={handleSaveToCloud}
        isSavingCloud={isSavingCloud}
        atsScore={atsResult.score}
        isExportingPdf={isExportingPdf}
        isExportingImage={isExportingImage}
        onBackHome={onBackHome}
      />

      {/* Mobile view switcher */}
      <div
        className={`no-print lg:hidden flex items-center gap-2 p-2 border-b ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
        }`}
        role="tablist"
        aria-label={isFr ? 'Vue' : 'View'}
      >
        <button
          onClick={() => setMobileView('editor')}
          role="tab"
          aria-selected={mobileView === 'editor'}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition ${
            mobileView === 'editor'
              ? 'bg-emerald-600 text-white shadow-md'
              : isDarkMode
                ? 'text-zinc-400 hover:bg-zinc-800'
                : 'text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          <PencilLine className="w-4 h-4" aria-hidden />
          {isFr ? 'Éditer' : 'Edit'}
        </button>
        <button
          onClick={() => setMobileView('preview')}
          role="tab"
          aria-selected={mobileView === 'preview'}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition ${
            mobileView === 'preview'
              ? 'bg-emerald-600 text-white shadow-md'
              : isDarkMode
                ? 'text-zinc-400 hover:bg-zinc-800'
                : 'text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          <Eye className="w-4 h-4" aria-hidden />
          {isFr ? 'Aperçu' : 'Preview'}
        </button>
      </div>

      {/* Main workspace */}
      <main className="flex-1 flex min-h-0 overflow-hidden">
        {/* Editor panel */}
        <div
          className={`${
            mobileView === 'editor' ? 'flex' : 'hidden'
          } lg:flex flex-col w-full lg:w-[430px] xl:w-[470px] shrink-0 h-full min-h-0`}
        >
          <div className={`flex shrink-0 border-b ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            {([['guide', 'Assistant guidé'], ['form', 'Formulaire']] as const).map(([k, l]) => (
              <button key={k} onClick={() => setLeftTab(k)} className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition ${leftTab === k ? 'border-emerald-600 text-emerald-500' : `border-transparent ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}`}>{l}</button>
            ))}
          </div>
          {leftTab === 'guide'
            ? <GuidedAssistant cv={cv} onChange={(u) => setCv(u)} isDarkMode={isDarkMode} onClear={() => { if (confirm('Effacer toutes les données du CV ?')) setCv({ ...emptyCVState, lang: cv.lang }); }} />
            : <EditorPanel cv={cv} onChange={setCv} isDarkMode={isDarkMode} onAiGenerate={handleAiGenerate} aiLoadingKey={aiLoadingKey} />}
        </div>

        {/* CV Preview area */}
        <div
          className={`cv-preview-scroll ${
            mobileView === 'preview' ? 'flex' : 'hidden'
          } lg:flex flex-1 justify-center overflow-y-auto custom-scrollbar p-4 md:p-6 lg:p-8 ${
            isDarkMode ? 'bg-zinc-950' : 'bg-zinc-200/70'
          }`}
          role="region"
          aria-label={isFr ? 'Aperçu du CV' : 'CV preview'}
        >
          <div className="w-full max-w-[860px]">
            {/* Export overlay hint */}
            {(isExportingPdf || isExportingImage) && (
              <div
                className={`no-print mb-4 rounded-xl border px-4 py-3 flex items-center gap-3 text-xs font-semibold ${
                  isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}
                role="status"
              >
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                {isExportingPdf
                  ? isFr
                    ? 'Génération du PDF haute qualité en cours...'
                    : 'Generating high-quality PDF...'
                  : isFr
                    ? "Génération de l'image HD en cours..."
                    : 'Generating HD image...'}
              </div>
            )}
            <ScaledPaper>
              <CVPreview cv={cv} />
            </ScaledPaper>
          </div>
        </div>
      </main>

      {/* ─── Modals ─────────────────────────────────────────── */}
      <AtsCheckerModal
        cv={cv}
        isOpen={isAtsModalOpen}
        onClose={() => {
          setIsAtsModalOpen(false);
          setAtsAiError(null);
        }}
        isDarkMode={isDarkMode}
        onRunAiAnalysis={handleRunAiAts}
        aiLoading={atsAiLoading}
        aiError={atsAiError}
        aiResult={atsAiResult}
      />

      <AiAssistantModal cv={cv} isOpen={isAiAssistantOpen} onClose={() => setIsAiAssistantOpen(false)} isDarkMode={isDarkMode} />

      <CoverLetterModal cv={cv} isOpen={isCoverLetterOpen} onClose={() => setIsCoverLetterOpen(false)} isDarkMode={isDarkMode} />

      <SavedCvsDialog
        isOpen={isSavedCvsOpen}
        onClose={() => setIsSavedCvsOpen(false)}
        isDarkMode={isDarkMode}
        lang={cv.lang}
        onLoad={handleLoadSavedCv}
      />
    </div>
  );
};
