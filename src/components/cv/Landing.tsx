'use client';

import React, { useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Sparkles,
  Bot,
  Trophy,
  Mail,
  CloudDownload,
  Palette,
  Download,
  ArrowRight,
  CheckCircle2,
  PencilLine,
  Wand2,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

const THEME_KEY = 'cv_builder_app_theme';
const THEME_EVENT = 'cv-theme-change';

function subscribeTheme(cb: () => void) {
  window.addEventListener(THEME_EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(THEME_EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}

function getThemeSnapshot(): boolean {
  try {
    return (localStorage.getItem(THEME_KEY) ?? 'dark') !== 'light';
  } catch {
    return true;
  }
}

function getThemeServerSnapshot(): boolean {
  return true;
}

const FEATURES = [
  {
    icon: Bot,
    title: 'Copilote IA',
    desc: "Discutez avec une IA experte RH qui connaît votre CV et vous aide à rédiger chaque section en un clic.",
    gradient: 'from-sky-500 to-cyan-500',
    badge: 'Chat'
  },
  {
    icon: Trophy,
    title: 'Analyse ATS + Offre',
    desc: "Collez une offre d'emploi : l'IA compare votre CV au poste, score de matching et mots-clés manquants.",
    gradient: 'from-amber-500 to-orange-500',
    badge: 'Smart'
  },
  {
    icon: Mail,
    title: 'Lettre de motivation',
    desc: 'Génère une lettre personnalisée en 4 tons (pro, enthousiaste, concis, audacieux) à partir de votre CV.',
    gradient: 'from-rose-500 to-pink-500',
    badge: 'Auto'
  },
  {
    icon: CloudDownload,
    title: 'Sauvegarde cloud',
    desc: 'Enregistrez plusieurs versions de CV en ligne et rechargez-les à tout moment, sur n\'importe quel appareil.',
    gradient: 'from-emerald-500 to-teal-500',
    badge: 'Sync'
  },
  {
    icon: Palette,
    title: '4 templates premium',
    desc: 'Moderne (sidebar), Minimaliste, Exécutif (timeline) et Créatif (dégradé). 10 palettes, 4 polices.',
    gradient: 'from-violet-500 to-fuchsia-500',
    badge: 'Design'
  },
  {
    icon: Download,
    title: 'Export PDF & PNG',
    desc: "Téléchargez en PDF prêt à imprimer ou en image HD 300 DPI. Import/export JSON pour vos sauvegardes.",
    gradient: 'from-blue-500 to-indigo-500',
    badge: 'HD'
  }
] as const;

const STEPS = [
  {
    icon: PencilLine,
    step: '01',
    title: 'Remplissez vos infos',
    desc: 'Renseignez votre identité, contacts, expériences, compétences et formation dans un éditeur à 7 onglets.'
  },
  {
    icon: Palette,
    step: '02',
    title: 'Personnalisez le style',
    desc: 'Choisissez un template, une palette de couleurs, une police et une densité. La preview se met à jour en direct.'
  },
  {
    icon: Wand2,
    step: '03',
    title: 'Optimisez avec l\'IA',
    desc: "Laissez le Copilote IA générer votre résumé, vos puces d'expérience et analyser votre score ATS face à l'offre visée."
  },
  {
    icon: Download,
    step: '04',
    title: 'Exportez & postulez',
    desc: 'Téléchargez un PDF impeccable, générez votre lettre de motivation et postulez avec confiance.'
  }
] as const;

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const isDarkMode = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);

  const toggleTheme = () => {
    try {
      const next = !isDarkMode;
      localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  const bg = isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900';
  const cardBg = isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200';
  const mutedText = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const headingText = isDarkMode ? 'text-white' : 'text-slate-900';
  const subtleBg = isDarkMode ? 'bg-slate-900/50' : 'bg-white/60';

  // Render the rich theme-aware content (useSyncExternalStore handles hydration)
  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300 overflow-x-hidden`} style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}>
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden>
        <div className="absolute -top-40 -left-32 w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-sky-600/30 to-cyan-500/20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/3 -right-32 w-[36rem] h-[36rem] rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />
        <div className="absolute -bottom-40 left-1/3 w-[36rem] h-[36rem] rounded-full bg-gradient-to-br from-rose-500/15 to-fuchsia-500/15 blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      {/* ─── Top nav ────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl border-b">
        <div className={`flex items-center justify-between px-5 md:px-8 py-3 border-b ${isDarkMode ? 'bg-slate-950/70 border-slate-800/60' : 'bg-white/70 border-slate-200'}`}>
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-sky-600 to-emerald-500 text-white p-2 rounded-xl shadow-lg shadow-sky-500/20">
              <FileText className="w-5 h-5" aria-hidden />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight">CV Builder</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-widest">Pro</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'}`}
              aria-label={isDarkMode ? 'Mode clair' : 'Mode sombre'}
              title={isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" aria-hidden /> : <Moon className="w-4 h-4" aria-hidden />}
            </button>
            <button
              onClick={onStart}
              className="bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-sky-600/20"
            >
              Ouvrir l'app
              <ArrowRight className="w-3.5 h-3.5" aria-hidden />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ──────────────────────────────────────────── */}
      <section className="relative px-5 md:px-8 pt-16 md:pt-24 pb-20 md:pb-32 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-sky-500/15 to-emerald-500/15 text-sky-400 text-xs font-bold px-3.5 py-1.5 rounded-full border border-sky-500/30 uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" aria-hidden />
            Propulsé par l'IA
          </span>

          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-5 ${headingText}`}>
            Créez un CV <span className="bg-gradient-to-r from-sky-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">professionnel</span>
            <br className="hidden md:block" /> en quelques minutes
          </h1>

          <p className={`text-base md:text-lg max-w-2xl mx-auto mb-8 ${mutedText}`}>
            Un éditeur de CV moderne avec copilote IA intégré, analyse ATS contre les offres d'emploi, 4 templates premium et export PDF haute qualité. Tout ce qu'il faut pour décrocher l'entretien.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <div className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full border ${cardBg}`}>
              <Bot className="w-3.5 h-3.5 text-sky-400" aria-hidden /> Copilote IA
            </div>
            <div className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full border ${cardBg}`}>
              <Trophy className="w-3.5 h-3.5 text-amber-400" aria-hidden /> Score ATS
            </div>
            <div className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full border ${cardBg}`}>
              <Palette className="w-3.5 h-3.5 text-violet-400" aria-hidden /> 4 templates
            </div>
            <div className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full border ${cardBg}`}>
              <Download className="w-3.5 h-3.5 text-emerald-400" aria-hidden /> Export PDF/PNG
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className={`flex flex-col items-center gap-1 ${mutedText}`}
          >
            <span className="text-[10px] uppercase tracking-widest font-semibold">Découvrir</span>
            <ChevronDown className="w-4 h-4 animate-bounce" aria-hidden />
          </motion.div>
        </motion.div>

        {/* Mockup preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative mt-16 md:mt-20 mx-auto max-w-4xl"
        >
          <div className={`relative rounded-2xl border ${cardBg} p-2 shadow-2xl shadow-sky-950/30`}>
            <div className={`rounded-xl overflow-hidden border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              {/* fake window chrome */}
              <div className={`flex items-center gap-1.5 px-3 py-2 border-b ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                <span className={`ml-2 text-[10px] font-mono ${mutedText}`}>cv-builder-pro · aperçu en direct</span>
              </div>
              {/* fake editor + preview */}
              <div className={`grid grid-cols-12 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
                {/* editor column */}
                <div className={`col-span-5 p-3 space-y-2 hidden sm:block ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                  <div className="flex gap-1">
                    <div className="h-5 w-12 rounded bg-sky-500/40" />
                    <div className="h-5 w-10 rounded bg-slate-700/40" />
                    <div className="h-5 w-10 rounded bg-slate-700/40" />
                    <div className="h-5 w-10 rounded bg-slate-700/40" />
                  </div>
                  {[0.9, 0.7, 0.8, 0.6, 0.85].map((w, i) => (
                    <div key={i} className={`h-7 rounded ${isDarkMode ? 'bg-slate-800/60' : 'bg-slate-100'}`} style={{ width: `${w * 100}%` }} />
                  ))}
                  <div className="mt-3 flex items-center gap-1.5 p-1.5 rounded-lg bg-gradient-to-r from-sky-500/20 to-emerald-500/20 border border-sky-500/30">
                    <Bot className="w-3 h-3 text-sky-400" aria-hidden />
                    <div className="h-2 flex-1 rounded bg-sky-400/40" />
                  </div>
                </div>
                {/* preview column */}
                <div className={`col-span-12 sm:col-span-7 p-3 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-200/50'}`}>
                  <div className={`rounded-lg overflow-hidden border ${isDarkMode ? 'border-slate-800 bg-white' : 'border-slate-200 bg-white'}`}>
                    <div className="grid grid-cols-12 min-h-[180px]">
                      <div className="col-span-4 bg-slate-900 p-2.5 text-white">
                        <div className="w-10 h-10 rounded-full bg-white/20 mb-2" />
                        <div className="h-2 w-14 bg-white/40 rounded mb-1" />
                        <div className="h-2 w-12 bg-white/30 rounded mb-3" />
                        <div className="h-1.5 w-16 bg-white/20 rounded mb-1" />
                        <div className="h-1.5 w-14 bg-white/20 rounded mb-1" />
                        <div className="h-1.5 w-16 bg-white/20 rounded" />
                      </div>
                      <div className="col-span-8 p-2.5 space-y-1.5">
                        <div className="h-2.5 w-24 bg-slate-900/70 rounded mb-2" />
                        <div className="h-1.5 w-32 bg-slate-400/50 rounded" />
                        <div className="h-1.5 w-28 bg-slate-400/40 rounded mb-2" />
                        <div className="h-1.5 w-full bg-slate-200 rounded" />
                        <div className="h-1.5 w-5/6 bg-slate-200 rounded" />
                        <div className="h-1.5 w-3/4 bg-slate-200 rounded mb-2" />
                        <div className="h-2 w-20 bg-slate-300 rounded mb-1" />
                        <div className="h-1.5 w-full bg-slate-100 rounded" />
                        <div className="h-1.5 w-5/6 bg-slate-100 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* floating AI badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="absolute -top-3 -right-2 md:-right-4 bg-gradient-to-br from-sky-500 to-emerald-500 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5"
          >
            <Bot className="w-3 h-3" aria-hidden /> IA
          </motion.div>
        </motion.div>
      </section>

      {/* ─── FEATURES ──────────────────────────────────────── */}
      <section className="px-5 md:px-8 py-16 md:py-24 max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>
            Fonctionnalités
          </span>
          <h2 className={`text-3xl md:text-5xl font-black tracking-tight mt-2 ${headingText}`}>
            Tout ce qu'il vous faut pour un CV gagnant
          </h2>
          <p className={`text-sm md:text-base mt-3 max-w-2xl mx-auto ${mutedText}`}>
            Une suite complète d'outils alimentés par l'IA pour rédiger, optimiser et exporter votre CV.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                className={`relative rounded-2xl border ${cardBg} p-5 md:p-6 hover:border-sky-500/40 transition-all group hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`bg-gradient-to-br ${feat.gradient} text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" aria-hidden />
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                    {feat.badge}
                  </span>
                </div>
                <h3 className={`font-bold text-base mb-1.5 ${headingText}`}>{feat.title}</h3>
                <p className={`text-xs leading-relaxed ${mutedText}`}>{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── HOW TO USE ────────────────────────────────────── */}
      <section className={`px-5 md:px-8 py-16 md:py-24 ${subtleBg} border-y ${isDarkMode ? 'border-slate-800/60' : 'border-slate-200'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              Mode d'emploi
            </span>
            <h2 className={`text-3xl md:text-5xl font-black tracking-tight mt-2 ${headingText}`}>
              4 étapes vers un CV parfait
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 relative">
            {/* connecting line on lg */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-sky-500/40 via-emerald-500/40 to-violet-500/40" aria-hidden />

            {STEPS.map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className="relative text-center"
                >
                  <div className={`relative inline-flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-2xl border ${cardBg}`}>
                    <Icon className={`w-7 h-7 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`} aria-hidden />
                    <span className="absolute -top-2 -right-2 bg-gradient-to-br from-sky-500 to-emerald-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                      {s.step}
                    </span>
                  </div>
                  <h3 className={`font-bold text-base mb-1.5 ${headingText}`}>{s.title}</h3>
                  <p className={`text-xs leading-relaxed ${mutedText} max-w-[15rem] mx-auto`}>{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── WHY ──────────────────────────────────────────── */}
      <section className="px-5 md:px-8 py-16 md:py-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <span className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}>
              Pourquoi CV Builder Pro
            </span>
            <h2 className={`text-3xl md:text-4xl font-black tracking-tight mt-2 mb-4 ${headingText}`}>
              Conçu pour passer les filtres automatiques
            </h2>
            <p className={`text-sm md:text-base leading-relaxed mb-6 ${mutedText}`}>
              75% des CV ne sont jamais lus par un humain : ils sont filtrés par des ATS (Applicant Tracking Systems). CV Builder Pro vous aide à battre ces algorithmes avec un score en temps réel et une IA qui sait exactement quels mots-clés ajouter.
            </p>
            <ul className="space-y-3">
              {[
                "Score ATS calculé en direct pendant que vous écrivez",
                "Analyse IA comparant votre CV à l'offre d'emploi visée",
                "Vérbes d'action et résultats chiffrés suggérés par l'IA",
                "Export PDF vectoriel prêt à imprimer en A4",
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden />
                  <span className={`text-xs md:text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ATS visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`relative rounded-3xl border ${cardBg} p-6 md:p-8 shadow-2xl`}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-2.5 rounded-xl">
                <Trophy className="w-5 h-5" aria-hidden />
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wider font-bold ${mutedText}`}>Score ATS</p>
                <p className="text-2xl font-black text-emerald-500">100% Excellent</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Nom et contact', ok: true },
                { label: 'Titre de poste clair', ok: true },
                { label: 'Résumé professionnel (20+ mots)', ok: true },
                { label: 'Compétences clés (6+)', ok: true },
                { label: 'Expériences détaillées', ok: true },
                { label: 'Formation renseignée', ok: true },
              ].map((c, i) => (
                <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${isDarkMode ? 'bg-emerald-950/30 border border-emerald-800/40' : 'bg-emerald-50 border border-emerald-200'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden />
                  <span className={`text-[11px] font-medium ${isDarkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>{c.label}</span>
                  <span className="ml-auto text-[9px] font-mono text-emerald-500">+15 pts</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────── */}
      <section className="px-5 md:px-8 py-20 md:py-32 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`relative rounded-3xl border ${cardBg} p-8 md:p-12 text-center overflow-hidden shadow-2xl`}
        >
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-emerald-500/10 to-transparent pointer-events-none" aria-hidden />

          <div className="relative">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-sky-500/15 to-emerald-500/15 text-sky-400 text-xs font-bold px-3 py-1.5 rounded-full border border-sky-500/30 uppercase tracking-widest mb-5">
              <Sparkles className="w-3.5 h-3.5" aria-hidden /> Prêt à commencer ?
            </div>
            <h2 className={`text-3xl md:text-5xl font-black tracking-tight mb-3 ${headingText}`}>
              Lancez votre CV en 30 secondes
            </h2>
            <p className={`text-sm md:text-base max-w-xl mx-auto mb-8 ${mutedText}`}>
              Gratuit, sans inscription. Vos données restent privées (navigateur + sauvegarde cloud optionnelle). Un éditeur, l'IA, et vous.
            </p>

            <button
              onClick={onStart}
              className="group relative inline-flex items-center gap-2.5 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white text-base md:text-lg font-bold px-8 md:px-10 py-4 rounded-2xl transition-all shadow-2xl shadow-sky-600/30 hover:shadow-sky-600/40 hover:scale-105 active:scale-95"
            >
              <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" aria-hidden />
              Commencer
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden />
            </button>

            <p className={`text-[10px] mt-5 ${mutedText}`}>
              Vous pourrez revenir à cette page via le bouton <span className="font-bold">Accueil</span> en haut à gauche de l'app.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────── */}
      <footer className={`px-5 md:px-8 py-8 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-sky-600 to-emerald-500 text-white p-1.5 rounded-lg">
              <FileText className="w-3.5 h-3.5" aria-hidden />
            </div>
            <span className={`text-xs font-bold ${headingText}`}>CV Builder Pro</span>
            <span className={`text-[10px] ${mutedText}`}>· Propulsé par Z.ai</span>
          </div>
          <p className={`text-[10px] ${mutedText}`}>
            Conçu avec ❤️ pour les chercheurs d'emploi · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};
