'use client';

import React, { useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Sparkle,
  MessagesSquare,
  Target,
  Mail,
  CloudUpload,
  Palette,
  Download,
  ArrowRight,
  Check,
  PencilLine,
  Sun,
  Moon,
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
    icon: MessagesSquare,
    title: 'Assistant rédactionnel',
    desc: 'Un assistant qui connaît votre parcours et vous aide à formuler chaque section — profil, expériences, compétences.',
  },
  {
    icon: Target,
    title: 'Adéquation à l\'offre',
    desc: 'Collez une offre d\'emploi : obtenez un score de compatibilité, les points forts et les mots-clés manquants.',
  },
  {
    icon: Mail,
    title: 'Lettre de motivation',
    desc: 'Quatre tonnalités disponibles (professionnel, enthousiaste, concis, audacieux), générées à partir de votre CV.',
  },
  {
    icon: CloudUpload,
    title: 'Sauvegarde en ligne',
    desc: 'Enregistrez plusieurs versions de votre CV et retrouvez-les depuis n\'importe quel appareil.',
  },
  {
    icon: Palette,
    title: 'Quatre mises en page',
    desc: 'Moderne, Minimaliste, Exécutif et Créatif. Dix palettes, quatre polices, densité réglable.',
  },
  {
    icon: Download,
    title: 'Export PDF & PNG',
    desc: 'Téléchargement PDF vectoriel prêt à imprimer, image haute résolution, import/export JSON pour vos sauvegardes.',
  },
] as const;

const STEPS = [
  {
    icon: PencilLine,
    step: '01',
    title: 'Renseignez vos informations',
    desc: 'Identité, contacts, expériences, compétences et formation dans un éditeur à sept onglets.',
  },
  {
    icon: Palette,
    step: '02',
    title: 'Choisissez la mise en page',
    desc: 'Template, palette, police et densité. L\'aperçu se met à jour en direct à chaque modification.',
  },
  {
    icon: Sparkle,
    step: '03',
    title: 'Optimisez le contenu',
    desc: 'L\'assistant rédige votre profil, reformule vos expériences et mesure votre score d\'adéquation.',
  },
  {
    icon: Download,
    step: '04',
    title: 'Exportez et postulez',
    desc: 'PDF impeccable, lettre de motivation personnalisée. Vous êtes prêt à postuler.',
  },
] as const;

const ATS_POINTS = [
  'Identité et coordonnées complètes',
  'Titre de poste cohérent avec l\'offre',
  'Profil professionnel d\'au moins 20 mots',
  'Six compétences clés ou plus',
  'Expériences détaillées avec résultats',
  'Formation et certifications renseignées',
];

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

  const rootBg = isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900';
  const cardBg = isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200';
  const cardHover = isDarkMode ? 'hover:border-zinc-700' : 'hover:border-zinc-300';
  const mutedText = isDarkMode ? 'text-zinc-400' : 'text-zinc-500';
  const headingText = isDarkMode ? 'text-zinc-50' : 'text-zinc-900';
  const subtleBg = isDarkMode ? 'bg-zinc-900/40' : 'bg-zinc-50';
  const navBg = isDarkMode ? 'bg-zinc-950/80 border-zinc-800/80' : 'bg-white/80 border-zinc-200';
  const accentText = isDarkMode ? 'text-emerald-400' : 'text-emerald-600';
  const accentBg = 'bg-emerald-600 hover:bg-emerald-500 text-white';
  const ghostBtn = isDarkMode
    ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-800'
    : 'bg-white hover:bg-zinc-50 text-zinc-900 border-zinc-300';
  const dividerLine = isDarkMode ? 'border-zinc-800' : 'border-zinc-200';

  return (
    <div
      className={`min-h-screen flex flex-col ${rootBg} transition-colors duration-300 overflow-x-hidden font-sans-inter antialiased`}
      style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
    >
      {/* Subtle decorative grid pattern */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      {/* Single soft accent glow */}
      <div
        className="pointer-events-none fixed -top-32 left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] rounded-full blur-3xl -z-10 opacity-[0.18]"
        style={{ background: 'radial-gradient(closest-side, oklch(0.7 0.15 165), transparent)' }}
        aria-hidden
      />

      {/* ─────────────────────────  NAV  ────────────────────────── */}
      <nav className={`sticky top-0 z-40 backdrop-blur-xl border-b ${navBg}`} role="navigation">
        <div className="mx-auto max-w-6xl px-5 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <FileText className="w-4 h-4" aria-hidden />
            </div>
            <span className="font-semibold text-[15px] tracking-tight">CV Builder</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${isDarkMode ? 'border-zinc-700 text-zinc-400' : 'border-zinc-300 text-zinc-500'}`}>
              PRO
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition ${ghostBtn}`}
              aria-label={isDarkMode ? 'Mode clair' : 'Mode sombre'}
              title={isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" aria-hidden /> : <Moon className="w-4 h-4" aria-hidden />}
            </button>
            <button
              onClick={onStart}
              className={`text-[13px] font-medium px-4 py-2 rounded-lg transition flex items-center gap-1.5 ${accentBg}`}
            >
              Ouvrir l&apos;éditeur
              <ArrowRight className="w-3.5 h-3.5" aria-hidden />
            </button>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────  HERO  ────────────────────────── */}
      <section className="px-5 md:px-8 pt-20 md:pt-28 pb-16 md:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.25em] ${accentText} mb-5`}>
              Créateur de CV professionnel
            </p>
            <h1 className={`text-4xl md:text-6xl lg:text-[4.5rem] font-semibold tracking-tight leading-[1.05] mb-6 ${headingText}`}>
              Le CV que les recruteurs
              <br />
              <span className={accentText}>retiendront.</span>
            </h1>
            <p className={`text-base md:text-lg max-w-2xl mx-auto mb-9 leading-relaxed ${mutedText}`}>
              Un éditeur précis, des mises en page soignées et un assistant rédactionnel intégré. Construit en quelques minutes, exporté en PDF prêt à imprimer.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={onStart}
                className={`group inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-lg transition shadow-lg shadow-emerald-600/10 ${accentBg}`}
              >
                Commencer
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden />
              </button>
              <a
                href="#features"
                className={`inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-lg border transition ${ghostBtn}`}
              >
                Découvrir les outils
              </a>
            </div>

            <p className={`mt-5 text-xs ${mutedText}`}>
              Gratuit · Sans inscription · Données enregistrées sur votre appareil
            </p>
          </motion.div>
        </div>

        {/* Mockup preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-16 md:mt-20 max-w-5xl"
        >
          <div className={`relative rounded-2xl border ${cardBg} p-2 shadow-2xl ${isDarkMode ? 'shadow-black/40' : 'shadow-zinc-300/40'}`}>
            <div className={`rounded-xl overflow-hidden border ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
              {/* Window chrome */}
              <div className={`flex items-center gap-1.5 px-3.5 h-9 border-b ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-400/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-400/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-400/60" />
                <span className={`ml-2.5 text-[11px] font-mono ${mutedText}`}>cv-builder · aperçu en direct</span>
              </div>
              {/* Editor + Preview split */}
              <div className={`grid grid-cols-12 ${isDarkMode ? 'bg-zinc-950' : 'bg-zinc-100'}`}>
                {/* Editor column */}
                <div className={`col-span-5 p-4 space-y-2.5 hidden sm:block ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
                  <div className="flex gap-1">
                    <div className="h-5 w-14 rounded bg-emerald-500/70" />
                    <div className={`h-5 w-10 rounded ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
                    <div className={`h-5 w-10 rounded ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
                    <div className={`h-5 w-10 rounded ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
                  </div>
                  {[0.95, 0.7, 0.85, 0.6, 0.8].map((w, i) => (
                    <div
                      key={i}
                      className={`h-7 rounded ${isDarkMode ? 'bg-zinc-800/80' : 'bg-zinc-100'}`}
                      style={{ width: `${w * 100}%` }}
                    />
                  ))}
                  <div className="mt-3 flex items-center gap-1.5 p-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                    <Sparkle className="w-3 h-3 text-emerald-500" aria-hidden />
                    <div className="h-2 flex-1 rounded bg-emerald-500/40" />
                  </div>
                </div>
                {/* Preview column */}
                <div className={`col-span-12 sm:col-span-7 p-3.5 ${isDarkMode ? 'bg-zinc-950' : 'bg-zinc-200/50'}`}>
                  <div className={`rounded-lg overflow-hidden border ${isDarkMode ? 'border-zinc-800 bg-white' : 'border-zinc-200 bg-white'}`}>
                    <div className="grid grid-cols-12 min-h-[200px]">
                      <div className="col-span-4 bg-zinc-900 p-3 text-white">
                        <div className="w-12 h-12 rounded-full bg-white/20 mb-2.5" />
                        <div className="h-2.5 w-16 bg-white/50 rounded mb-1.5" />
                        <div className="h-2 w-12 bg-white/30 rounded mb-4" />
                        <div className="h-1.5 w-20 bg-white/20 rounded mb-1.5" />
                        <div className="h-1.5 w-16 bg-white/20 rounded mb-1.5" />
                        <div className="h-1.5 w-20 bg-white/20 rounded" />
                      </div>
                      <div className="col-span-8 p-3 space-y-1.5">
                        <div className="h-3 w-28 bg-zinc-900/70 rounded mb-2.5" />
                        <div className="h-1.5 w-36 bg-zinc-400/60 rounded" />
                        <div className="h-1.5 w-32 bg-zinc-400/50 rounded mb-3" />
                        <div className="h-1.5 w-full bg-zinc-200 rounded" />
                        <div className="h-1.5 w-5/6 bg-zinc-200 rounded" />
                        <div className="h-1.5 w-3/4 bg-zinc-200 rounded mb-3" />
                        <div className="h-2 w-24 bg-zinc-300 rounded mb-1.5" />
                        <div className="h-1.5 w-full bg-zinc-100 rounded" />
                        <div className="h-1.5 w-5/6 bg-zinc-100 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─────────────────────  FEATURES  ─────────────────────── */}
      <section id="features" className="px-5 md:px-8 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl mb-14 md:mb-16">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.25em] ${accentText} mb-3`}>Tout ce qu&apos;il vous faut</p>
            <h2 className={`text-3xl md:text-4xl font-semibold tracking-tight mb-4 ${headingText}`}>
              Un outil unique, du brouillon à la candidature.
            </h2>
            <p className={`text-sm md:text-base leading-relaxed ${mutedText}`}>
              Chaque fonctionnalité est pensée pour gagner du temps sans sacrifier la qualité. Pas de gadgets — seulement l&apos;essentiel.
            </p>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden border ${cardBg}`} style={{ background: isDarkMode ? 'oklch(0.27 0 0)' : 'oklch(0.92 0 0)' }}>
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: (idx % 3) * 0.08 }}
                  className={`p-6 md:p-7 ${isDarkMode ? 'bg-zinc-950' : 'bg-white'} ${cardHover} transition-colors`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                    <Icon className="w-5 h-5" aria-hidden />
                  </div>
                  <h3 className={`font-semibold text-base mb-2 ${headingText}`}>{feat.title}</h3>
                  <p className={`text-sm leading-relaxed ${mutedText}`}>{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────  HOW TO USE  ───────────────────── */}
      <section className={`px-5 md:px-8 py-20 md:py-28 ${subtleBg} border-y ${dividerLine}`}>
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl mb-14 md:mb-16">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.25em] ${accentText} mb-3`}>Mode d&apos;emploi</p>
            <h2 className={`text-3xl md:text-4xl font-semibold tracking-tight mb-4 ${headingText}`}>
              Quatre étapes, un CV abouti.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {STEPS.map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex flex-col"
                >
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className={`font-mono text-sm font-semibold ${accentText}`}>{s.step}</span>
                    <div className={`flex-1 h-px ${dividerLine}`} />
                  </div>
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${isDarkMode ? 'bg-zinc-900 border border-zinc-800 text-emerald-400' : 'bg-white border border-zinc-200 text-emerald-600'}`}>
                    <Icon className="w-5 h-5" aria-hidden />
                  </div>
                  <h3 className={`font-semibold text-base mb-2 ${headingText}`}>{s.title}</h3>
                  <p className={`text-sm leading-relaxed ${mutedText}`}>{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────  WHY  ──────────────────────── */}
      <section className="px-5 md:px-8 py-20 md:py-28">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.25em] ${accentText} mb-3`}>Pourquoi un bon CV compte</p>
            <h2 className={`text-3xl md:text-4xl font-semibold tracking-tight mb-5 ${headingText}`}>
              Conçu pour franchir les filtres automatiques.
            </h2>
            <p className={`text-sm md:text-base leading-relaxed mb-7 ${mutedText}`}>
              Une majorité de candidatures est d&apos;abord lue par un logiciel de tri, pas par un humain. CV Builder Pro vous donne un score en direct et vous indique précisément ce qui manque pour passer ce premier filtre.
            </p>
            <ul className="space-y-3">
              {[
                'Score calculé en continu pendant que vous écrivez',
                'Comparaison directe entre votre CV et une offre visée',
                'Suggestions de verbes d\'action et de résultats chiffrés',
                'Export PDF vectoriel respectant le format A4',
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className={`w-4 h-4 shrink-0 mt-0.5 ${accentText}`} aria-hidden />
                  <span className={`text-sm ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ATS visual mock */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`rounded-2xl border ${cardBg} p-7 md:p-8 shadow-xl ${isDarkMode ? 'shadow-black/30' : 'shadow-zinc-300/30'}`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className={`text-[11px] uppercase tracking-[0.2em] font-semibold ${mutedText}`}>Score d&apos;adéquation</p>
                <p className={`text-3xl font-semibold mt-1 ${headingText}`}>92<span className="text-lg">/100</span></p>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-[11px] font-medium ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                Excellent
              </div>
            </div>
            <div className="space-y-2.5">
              {ATS_POINTS.map((label, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg ${isDarkMode ? 'bg-zinc-900/60 border border-zinc-800' : 'bg-zinc-50 border border-zinc-200'}`}
                >
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden />
                  <span className={`text-[12px] font-medium ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────────────────  FINAL CTA  ──────────────────── */}
      <section className="px-5 md:px-8 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`mx-auto max-w-3xl rounded-3xl border ${cardBg} p-10 md:p-14 text-center`}
        >
          <h2 className={`text-3xl md:text-4xl font-semibold tracking-tight mb-4 ${headingText}`}>
            Lancez votre CV maintenant.
          </h2>
          <p className={`text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed ${mutedText}`}>
            Aucune inscription. Vos informations restent privées, enregistrées sur votre appareil avec sauvegarde en ligne optionnelle.
          </p>
          <button
            onClick={onStart}
            className={`group inline-flex items-center gap-2 text-base font-medium px-8 py-3.5 rounded-lg transition shadow-xl shadow-emerald-600/15 ${accentBg}`}
          >
            Commencer
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden />
          </button>
          <p className={`text-[11px] mt-5 ${mutedText}`}>
            Revenez à cette page à tout moment depuis le bouton Accueil de l&apos;éditeur.
          </p>
        </motion.div>
      </section>

      {/* ───────────────────  FOOTER  ─────────────────────── */}
      <footer className={`mt-auto px-5 md:px-8 py-8 border-t ${dividerLine}`}>
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center">
              <FileText className="w-3 h-3" aria-hidden />
            </div>
            <span className={`text-xs font-medium ${headingText}`}>CV Builder Pro</span>
          </div>
          <p className={`text-[11px] ${mutedText}`}>
            © {new Date().getFullYear()} CV Builder Pro · Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
};
