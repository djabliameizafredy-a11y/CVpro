'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2, Sparkles, FileText, Wand2, Code, Languages, Mail } from 'lucide-react';
import { CVData } from '@/lib/cv/types';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AiAssistantModalProps {
  cv: CVData;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
  onApplySummary?: (summary: string) => void;
}

const QUICK_ACTIONS_FR = [
  { id: 'summary', label: 'Rédiger mon profil professionnel', icon: FileText },
  { id: 'skills', label: 'Suggérer des compétences clés', icon: Code },
  { id: 'improve', label: 'Améliorer mes expériences', icon: Wand2 },
  { id: 'ats', label: 'Conseils anti-ATS', icon: Sparkles },
  { id: 'translate', label: 'Traduire mon CV en anglais', icon: Languages },
  { id: 'letter', label: 'Aide lettre de motivation', icon: Mail }
] as const;

const QUICK_ACTIONS_EN = [
  { id: 'summary', label: 'Write my professional summary', icon: FileText },
  { id: 'skills', label: 'Suggest key skills', icon: Code },
  { id: 'improve', label: 'Improve my experience', icon: Wand2 },
  { id: 'ats', label: 'Anti-ATS tips', icon: Sparkles },
  { id: 'translate', label: 'Translate my CV to French', icon: Languages },
  { id: 'letter', label: 'Cover letter help', icon: Mail }
] as const;

const QUICK_PROMPTS: Record<string, { fr: string; en: string }> = {
  summary: {
    fr: 'Rédige-moi un profil professionnel percutant (3-4 phrases) basé sur mon CV actuel, optimisé pour les ATS.',
    en: 'Write a compelling professional summary (3-4 sentences) based on my current CV, optimized for ATS.'
  },
  skills: {
    fr: "Analyse mon CV et suggère les 8 compétences / mots-clés techniques les plus recherchés pour mon profil que je devrais ajouter.",
    en: 'Analyze my CV and suggest the 8 most in-demand technical skills/keywords for my profile that I should add.'
  },
  improve: {
    fr: "Propose-moi des formulations améliorées avec verbes d'action et résultats chiffrés pour mes expériences professionnelles les plus importantes.",
    en: 'Suggest improved phrasing with action verbs and quantified results for my most important work experiences.'
  },
  ats: {
    fr: "Donne-moi 5 conseils concrets pour améliorer mon score ATS et passer les filtres automatiques des recruteurs.",
    en: 'Give me 5 concrete tips to improve my ATS score and pass recruiter screening filters.'
  },
  translate: {
    fr: 'Traduis les sections principales de mon CV (profil, expériences, compétences) en anglais professionnel.',
    en: 'Translate the main sections of my CV (summary, experience, skills) into professional French.'
  },
  letter: {
    fr: 'Aide-moi à structurer une lettre de motivation percutante basée sur mon profil. Donne-moi un plan détaillé avec des exemples pour chaque partie.',
    en: 'Help me structure a compelling cover letter based on my profile. Give me a detailed outline with examples for each part.'
  }
};

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ cv, isOpen, onClose, isDarkMode = true }) => {
  const isFr = cv.lang === 'fr';
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: isFr
        ? "Bonjour 👋 Je suis votre copilote CV. Je connais déjà le contenu de votre CV. Posez-moi une question ou choisissez une action rapide ci-dessous !"
        : "Hello 👋 I'm your CV copilot. I already know the content of your resume. Ask me anything or pick a quick action below!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickActions = isFr ? QUICK_ACTIONS_FR : QUICK_ACTIONS_EN;
  const panelClass = isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800';
  const userBubble = 'bg-sky-600 text-white rounded-2xl rounded-br-sm';
  const aiBubble = isDarkMode ? 'bg-slate-800 text-slate-100 border border-slate-700 rounded-2xl rounded-bl-sm' : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl rounded-bl-sm';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.slice(-12), cv, lang: cv.lang })
      });
      const data = await res.json();
      const reply: string =
        data.reply ||
        (isFr ? "Désolé, je n'ai pas pu générer de réponse. Réessayez." : 'Sorry, I could not generate a reply. Please try again.');
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: isFr
            ? '⚠️ Erreur de connexion au service IA. Vérifiez votre connexion et réessayez.'
            : '⚠️ AI service connection error. Check your connection and try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm ${
        isDarkMode ? 'bg-slate-950/80' : 'bg-slate-900/50'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={isFr ? 'Copilote IA' : 'AI Copilot'}
      onClick={onClose}
    >
      <div
        className={`border rounded-2xl max-w-2xl w-full h-[80vh] max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-fade-in ${panelClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex justify-between items-center px-5 py-4 border-b shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-sky-500 to-emerald-500 text-white rounded-xl shadow-lg shadow-sky-500/20">
              <Bot className="w-5 h-5" aria-hidden />
            </div>
            <div>
              <h2 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {isFr ? 'Copilote IA de CV' : 'CV AI Copilot'}
              </h2>
              <p className={`text-[11px] flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" aria-hidden />
                {isFr ? 'Connecté au contenu de votre CV' : 'Connected to your CV content'}
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

        {/* Quick actions */}
        <div className={`px-4 py-3 border-b shrink-0 ${isDarkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => sendMessage(QUICK_PROMPTS[action.id][isFr ? 'fr' : 'en'])}
                  disabled={isLoading}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold whitespace-nowrap transition disabled:opacity-50 ${
                    isDarkMode
                      ? 'bg-slate-900 text-slate-300 border-slate-700 hover:border-sky-500 hover:text-sky-400'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-sky-500 hover:text-sky-600'
                  }`}
                >
                  <Icon className="w-3 h-3 shrink-0" aria-hidden />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shrink-0 mr-2 self-end">
                  <Bot className="w-4 h-4 text-white" aria-hidden />
                </div>
              )}
              <div className={`px-4 py-2.5 max-w-[80%] text-xs leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? userBubble : aiBubble}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shrink-0 mr-2 self-end">
                <Bot className="w-4 h-4 text-white" aria-hidden />
              </div>
              <div className={`px-4 py-3 flex items-center gap-1.5 ${aiBubble}`}>
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className={`p-3 border-t shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder={isFr ? 'Posez votre question sur votre CV...' : 'Ask anything about your CV...'}
              className={`flex-1 rounded-xl px-4 py-2.5 text-xs ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500'
              } border`}
              aria-label={isFr ? 'Message' : 'Message'}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white p-2.5 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              aria-label={isFr ? 'Envoyer' : 'Send'}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <Send className="w-4 h-4" aria-hidden />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
