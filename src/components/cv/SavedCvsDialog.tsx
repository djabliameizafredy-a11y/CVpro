'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, CloudDownload, Trash2, Loader2, FileText, Clock, RefreshCw } from 'lucide-react';
import { CVData, SavedCvMeta } from '@/lib/cv/types';

interface SavedCvsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
  lang: 'fr' | 'en';
  onLoad: (cv: CVData, name: string) => void;
}

export const SavedCvsDialog: React.FC<SavedCvsDialogProps> = ({ isOpen, onClose, isDarkMode = true, lang, onLoad }) => {
  const isFr = lang === 'fr';
  const [savedCvs, setSavedCvs] = useState<SavedCvMeta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const panelClass = isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-800';

  const loadList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/cv', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setSavedCvs(data.cvs || []);
    } catch {
      setError(isFr ? 'Impossible de charger la liste des CV.' : 'Could not load the CV list.');
    } finally {
      setIsLoading(false);
    }
  }, [isFr]);

  useEffect(() => {
    if (isOpen) {
      loadList();
    }
  }, [isOpen, loadList]);

  if (!isOpen) return null;

  const handleLoad = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cv/${id}`);
      const data = await res.json();
      if (!res.ok || !data.cv) throw new Error('Failed');
      onLoad(data.cv, data.name);
      onClose();
    } catch {
      setError(isFr ? 'Impossible de charger ce CV.' : 'Could not load this CV.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/cv/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      setSavedCvs((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError(isFr ? 'Suppression impossible.' : 'Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(isFr ? 'fr-FR' : 'en-US', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm ${
        isDarkMode ? 'bg-zinc-950/80' : 'bg-zinc-900/50'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={isFr ? 'Mes CV sauvegardés' : 'My saved CVs'}
      onClick={onClose}
    >
      <div
        className={`border rounded-2xl max-w-xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-fade-in ${panelClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex justify-between items-center px-5 py-4 border-b shrink-0 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20">
              <CloudDownload className="w-5 h-5" aria-hidden />
            </div>
            <div>
              <h2 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                {isFr ? 'Mes CV sauvegardés' : 'My saved CVs'}
              </h2>
              <p className={`text-[11px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {savedCvs.length} {isFr ? (savedCvs.length > 1 ? 'versions en ligne' : 'version en ligne') : savedCvs.length > 1 ? 'online versions' : 'online version'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={loadList}
              disabled={isLoading}
              className={`p-2 rounded-lg transition disabled:opacity-50 ${
                isDarkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
              aria-label={isFr ? 'Rafraîchir' : 'Refresh'}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition ${
                isDarkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
              aria-label={isFr ? 'Fermer' : 'Close'}
            >
              <X className="w-5 h-5" aria-hidden />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2.5 max-h-[60vh]">
          {error && <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-500 text-xs p-3">{error}</div>}

          {isLoading && savedCvs.length === 0 && (
            <div className="space-y-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-16 rounded-xl animate-pulse ${isDarkMode ? 'bg-zinc-800/60' : 'bg-zinc-100'}`} />
              ))}
            </div>
          )}

          {!isLoading && savedCvs.length === 0 && !error && (
            <div className={`text-center py-10 space-y-2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
              <FileText className="w-10 h-10 mx-auto opacity-50" aria-hidden />
              <p className="text-xs">
                {isFr
                  ? "Aucun CV sauvegardé en ligne. Cliquez sur l'icône 💾 dans la barre du haut pour enregistrer votre CV actuel."
                  : 'No CVs saved online yet. Click the 💾 icon in the top bar to save your current CV.'}
              </p>
            </div>
          )}

          {savedCvs.map((saved) => (
            <div
              key={saved.id}
              className={`border rounded-xl p-3.5 flex items-center gap-3 transition ${
                isDarkMode ? 'bg-zinc-800/60 border-zinc-700/70 hover:border-zinc-500' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-400'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/20 border border-emerald-500/30 shrink-0">
                <FileText className="w-4 h-4 text-emerald-500" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{saved.name}</h3>
                <p className={`text-[10px] flex items-center gap-1 mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  <Clock className="w-3 h-3" aria-hidden />
                  {formatDate(saved.updatedAt)} • {saved.lang.toUpperCase()}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleLoad(saved.id)}
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden /> : <CloudDownload className="w-3.5 h-3.5" aria-hidden />}
                  {isFr ? 'Charger' : 'Load'}
                </button>
                <button
                  onClick={() => handleDelete(saved.id)}
                  disabled={deletingId === saved.id}
                  className={`p-2 rounded-lg transition disabled:opacity-50 ${
                    isDarkMode ? 'text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10' : 'text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10'
                  }`}
                  aria-label={isFr ? 'Supprimer' : 'Delete'}
                >
                  {deletingId === saved.id ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <Trash2 className="w-4 h-4" aria-hidden />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
