'use client';

import React, { useState } from 'react';
import {
  User,
  Code,
  Briefcase,
  GraduationCap,
  Globe,
  Layers,
  Palette,
  Upload,
  Trash2,
  Plus,
  PhoneCall,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Loader2
} from 'lucide-react';
import {
  CVData,
  SkillCategory,
  ProjectItem,
  EducationItem,
  LanguageItem,
  TemplateStyle,
  FontStyle,
  SpacingDensity
} from '@/lib/cv/types';

export type AiTarget =
  | { kind: 'summary' }
  | { kind: 'qualities' }
  | { kind: 'skills' }
  | { kind: 'project'; projectId: string }
  | { kind: 'bullets'; projectId: string };

interface EditorPanelProps {
  cv: CVData;
  onChange: (updated: CVData) => void;
  isDarkMode?: boolean;
  onAiGenerate?: (target: AiTarget) => void;
  aiLoadingKey?: string | null;
}

interface AiButtonProps {
  target: AiTarget;
  label: string;
  className?: string;
  isFr: boolean;
  isLoading: boolean;
  onGenerate: (target: AiTarget) => void;
}

const AiButton: React.FC<AiButtonProps> = ({ target, label, className, isFr, isLoading, onGenerate }) => (
  <button
    type="button"
    onClick={() => onGenerate(target)}
    disabled={isLoading}
    className={
      className ??
      'bg-gradient-to-r from-sky-600/20 to-emerald-600/20 text-sky-500 hover:from-sky-600/30 hover:to-emerald-600/30 px-2.5 py-1 rounded-lg border border-sky-500/30 text-[10px] font-bold transition flex items-center gap-1 disabled:opacity-60 shrink-0'
    }
    title={isFr ? "Générer / améliorer avec l'IA" : 'Generate / improve with AI'}
  >
    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" aria-hidden /> : <Sparkles className="w-3 h-3" aria-hidden />}
    <span>{label}</span>
  </button>
);

const aiTargetKey = (target: AiTarget): string =>
  target.kind === 'project'
    ? `project:${target.projectId}`
    : target.kind === 'bullets'
      ? `bullets:${target.projectId}`
      : target.kind;

export const EditorPanel: React.FC<EditorPanelProps> = ({ cv, onChange, isDarkMode = true, onAiGenerate, aiLoadingKey = null }) => {
  const [activeTab, setActiveTab] = useState<string>('personal');
  const isFr = cv.lang === 'fr';

  const updatePersonal = (key: keyof typeof cv.personal, value: string) => {
    onChange({
      ...cv,
      personal: {
        ...cv.personal,
        [key]: value
      }
    });
  };

  const updateTheme = (key: keyof typeof cv.theme, value: unknown) => {
    onChange({
      ...cv,
      theme: {
        ...cv.theme,
        [key]: value
      }
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        updatePersonal('photoUrl', evt.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ─── AI helpers ───────────────────────────────────────────────
  const handleAi = (target: AiTarget) => {
    if (onAiGenerate) onAiGenerate(target);
  };

  const renderAiButton = (target: AiTarget, label: string, className?: string) => {
    if (!onAiGenerate) return null;
    return (
      <AiButton target={target} label={label} className={className} isFr={isFr} isLoading={aiLoadingKey === aiTargetKey(target)} onGenerate={handleAi} />
    );
  };

  // ─── CRUD helpers ─────────────────────────────────────────────
  const addSkillCategory = () => {
    const newCat: SkillCategory = {
      id: Date.now().toString(),
      category: isFr ? 'Nouvelle Catégorie' : 'New Category',
      tags: 'React, Node.js, TypeScript'
    };
    onChange({ ...cv, skills: [...cv.skills, newCat] });
  };

  const updateSkill = (id: string, key: keyof SkillCategory, val: string) => {
    const updated = cv.skills.map((s) => (s.id === id ? { ...s, [key]: val } : s));
    onChange({ ...cv, skills: updated });
  };

  const removeSkill = (id: string) => {
    onChange({ ...cv, skills: cv.skills.filter((s) => s.id !== id) });
  };

  const addProject = () => {
    const newProj: ProjectItem = {
      id: Date.now().toString(),
      title: isFr ? 'Nouveau Projet / Poste' : 'New Project / Role',
      companyOrClient: isFr ? 'Entreprise / Client' : 'Company / Client',
      startDate: '2024',
      desc: isFr ? 'Description des réalisations et résultats obtenus.' : 'Key achievements and results.',
      tag: 'Tech Stack'
    };
    onChange({ ...cv, projects: [...cv.projects, newProj] });
  };

  const updateProject = (id: string, key: keyof ProjectItem, val: string | boolean | string[]) => {
    const updated = cv.projects.map((p) => (p.id === id ? { ...p, [key]: val } : p));
    onChange({ ...cv, projects: updated });
  };

  const removeProject = (id: string) => {
    onChange({ ...cv, projects: cv.projects.filter((p) => p.id !== id) });
  };

  const addEducation = () => {
    const newEdu: EducationItem = {
      id: Date.now().toString(),
      degree: isFr ? 'Diplôme / Formation' : 'Degree / Certificate',
      school: isFr ? 'Université / Établissement' : 'University / Institution',
      period: '2020 - 2023',
      details: isFr ? 'Mention ou spécialité' : 'Honors or major'
    };
    onChange({ ...cv, education: [...cv.education, newEdu] });
  };

  const updateEducation = (id: string, key: keyof EducationItem, val: string) => {
    const updated = cv.education.map((e) => (e.id === id ? { ...e, [key]: val } : e));
    onChange({ ...cv, education: updated });
  };

  const removeEducation = (id: string) => {
    onChange({ ...cv, education: cv.education.filter((e) => e.id !== id) });
  };

  const addLanguage = () => {
    const newLang: LanguageItem = {
      id: Date.now().toString(),
      name: isFr ? 'Anglais' : 'French',
      level: isFr ? 'Courant / B2' : 'Fluent / C1'
    };
    onChange({ ...cv, languages: [...cv.languages, newLang] });
  };

  const updateLanguage = (id: string, key: keyof LanguageItem, val: string) => {
    const updated = cv.languages.map((l) => (l.id === id ? { ...l, [key]: val } : l));
    onChange({ ...cv, languages: updated });
  };

  const removeLanguage = (id: string) => {
    onChange({ ...cv, languages: cv.languages.filter((l) => l.id !== id) });
  };

  const addCustomSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: isFr ? 'Certifications & Projets' : 'Certifications & Awards',
      items: [
        {
          id: Date.now().toString() + '_item',
          title: isFr ? 'Titre de la distinction / certification' : 'Certification title',
          subtitle: isFr ? 'Organisme / Année' : 'Institution / Year',
          period: '2024'
        }
      ]
    };
    onChange({ ...cv, customSections: [...cv.customSections, newSection] });
  };

  const tabs = [
    { id: 'personal', label: isFr ? 'Profil & Contact' : 'Profile & Contact', icon: User },
    { id: 'skills', label: isFr ? 'Compétences' : 'Skills', icon: Code },
    { id: 'projects', label: isFr ? 'Projets & Exp.' : 'Projects & Exp.', icon: Briefcase },
    { id: 'education', label: isFr ? 'Formation' : 'Education', icon: GraduationCap },
    { id: 'languages', label: isFr ? 'Langues' : 'Languages', icon: Globe },
    { id: 'custom', label: isFr ? 'Autres Sections' : 'Custom Sections', icon: Layers },
    { id: 'style', label: isFr ? 'Style & Thème' : 'Style & Theme', icon: Palette }
  ];

  // Dynamic Theme Classes
  const cardClass = isDarkMode ? 'bg-slate-800/60 border-slate-700/80' : 'bg-white border-slate-200 shadow-2xs';
  const subCardClass = isDarkMode ? 'bg-slate-800/80 border-slate-700/80' : 'bg-slate-50 border-slate-200/90 shadow-2xs';
  const inputClass = isDarkMode
    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500'
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-2xs';
  const labelClass = isDarkMode ? 'text-slate-300' : 'text-slate-700 font-semibold';
  const subLabelClass = isDarkMode ? 'text-slate-400' : 'text-slate-600 font-medium';
  const headingClass = isDarkMode ? 'text-sky-400 font-bold' : 'text-sky-600 font-bold';

  return (
    <div
      className={`no-print border-r flex flex-col h-full overflow-hidden transition-colors duration-200 ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
      }`}
      role="complementary"
      aria-label={isFr ? 'Panneau édition' : 'Editor panel'}
    >
      {/* Navigation Tabs Bar */}
      <div
        className={`flex items-center gap-1 p-2 border-b overflow-x-auto no-scrollbar transition-colors ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}
        role="tablist"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={isActive}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'bg-sky-600 text-white shadow-md'
                  : isDarkMode
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-6 custom-scrollbar">
        {/* ═══════ TAB 1: PERSONAL & CONTACT ═══════ */}
        {activeTab === 'personal' && (
          <div className="space-y-5 animate-fade-in">
            {/* Identity */}
            <div className={`border rounded-xl p-4 space-y-3 ${cardClass}`}>
              <h3 className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${headingClass}`}>
                <User className="w-4 h-4" aria-hidden />
                <span>{isFr ? 'Identité & Photo' : 'Identity & Photo'}</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs mb-1 ${labelClass}`} htmlFor="cv-firstname">
                    {isFr ? 'Prénom' : 'First Name'}
                  </label>
                  <input
                    id="cv-firstname"
                    type="text"
                    value={cv.personal.firstName}
                    onChange={(e) => updatePersonal('firstName', e.target.value)}
                    placeholder="ex: Jean"
                    className={`w-full rounded-lg px-3 py-2 text-xs ${inputClass}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${labelClass}`} htmlFor="cv-lastname">
                    {isFr ? 'Nom' : 'Last Name'}
                  </label>
                  <input
                    id="cv-lastname"
                    type="text"
                    value={cv.personal.lastName}
                    onChange={(e) => updatePersonal('lastName', e.target.value)}
                    placeholder="ex: DUPONT"
                    className={`w-full rounded-lg px-3 py-2 text-xs font-bold ${inputClass}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs mb-1 ${labelClass}`} htmlFor="cv-jobtitle">
                    {isFr ? 'Titre du poste' : 'Target Job Title'}
                  </label>
                  <input
                    id="cv-jobtitle"
                    type="text"
                    value={cv.personal.jobTitle}
                    onChange={(e) => updatePersonal('jobTitle', e.target.value)}
                    placeholder="ex: Développeur Full-Stack"
                    className={`w-full rounded-lg px-3 py-2 text-xs ${inputClass}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${labelClass}`} htmlFor="cv-subtitle">
                    {isFr ? 'Sous-titre / Spécialité' : 'Subtitle / Tagline'}
                  </label>
                  <input
                    id="cv-subtitle"
                    type="text"
                    value={cv.personal.subTitle}
                    onChange={(e) => updatePersonal('subTitle', e.target.value)}
                    placeholder="ex: Spécialiste React & Node.js"
                    className={`w-full rounded-lg px-3 py-2 text-xs ${inputClass}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs mb-1 ${labelClass}`} htmlFor="cv-nationality">
                    {isFr ? 'Nationalité' : 'Nationality'}
                  </label>
                  <input
                    id="cv-nationality"
                    type="text"
                    value={cv.personal.nationality}
                    onChange={(e) => updatePersonal('nationality', e.target.value)}
                    placeholder="ex: Togolaise / Française"
                    className={`w-full rounded-lg px-3 py-2 text-xs ${inputClass}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${labelClass}`} htmlFor="cv-license">
                    {isFr ? 'Permis de conduire' : 'Driver License'}
                  </label>
                  <input
                    id="cv-license"
                    type="text"
                    value={cv.personal.drivingLicense || ''}
                    onChange={(e) => updatePersonal('drivingLicense', e.target.value)}
                    placeholder="ex: Permis B"
                    className={`w-full rounded-lg px-3 py-2 text-xs ${inputClass}`}
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div className={`pt-2 border-t flex items-center gap-4 ${isDarkMode ? 'border-slate-700/60' : 'border-slate-200'}`}>
                {cv.personal.photoUrl ? (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-sky-500 shrink-0">
                    <img src={cv.personal.photoUrl} alt={isFr ? 'Photo' : 'Photo'} className="w-full h-full object-cover" />
                    <button
                      onClick={() => updatePersonal('photoUrl', '')}
                      className="absolute inset-0 bg-black/60 text-white opacity-0 hover:opacity-100 flex items-center justify-center transition text-xs"
                      title={isFr ? 'Supprimer la photo' : 'Remove photo'}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`w-14 h-14 rounded-full border-2 border-dashed flex items-center justify-center shrink-0 ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-500' : 'bg-slate-100 border-slate-300 text-slate-400'
                    }`}
                  >
                    <ImageIcon className="w-5 h-5" aria-hidden />
                  </div>
                )}
                <div className="flex-1">
                  <label className={`block text-xs mb-1 ${labelClass}`}>{isFr ? 'Photo de Profil' : 'Profile Photo'}</label>
                  <label
                    className={`cursor-pointer inline-flex items-center gap-2 border px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      isDarkMode ? 'bg-slate-900 hover:bg-slate-950 text-sky-400 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-sky-600 border-slate-300'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" aria-hidden />
                    <span>{isFr ? 'Téléverser photo' : 'Upload photo'}</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" aria-hidden />
                  </label>
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div className={`border rounded-xl p-4 space-y-3 ${cardClass}`}>
              <h3 className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${headingClass}`}>
                <PhoneCall className="w-4 h-4" aria-hidden />
                <span>{isFr ? 'Coordonnées & Réseaux' : 'Contact & Networks'}</span>
              </h3>

              <div>
                <label className={`block text-xs mb-1 ${labelClass}`} htmlFor="cv-address">
                  {isFr ? 'Adresse / Localisation' : 'Address / Location'}
                </label>
                <input
                  id="cv-address"
                  type="text"
                  value={cv.personal.address}
                  onChange={(e) => updatePersonal('address', e.target.value)}
                  placeholder="ex: Lomé, Togo"
                  className={`w-full rounded-lg px-3 py-2 text-xs ${inputClass}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs mb-1 ${labelClass}`} htmlFor="cv-phone">
                    {isFr ? 'Téléphone' : 'Phone'}
                  </label>
                  <input
                    id="cv-phone"
                    type="text"
                    value={cv.personal.phone}
                    onChange={(e) => updatePersonal('phone', e.target.value)}
                    placeholder="ex: +228 90 00 00 00"
                    className={`w-full rounded-lg px-3 py-2 text-xs ${inputClass}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${labelClass}`} htmlFor="cv-email">
                    Email
                  </label>
                  <input
                    id="cv-email"
                    type="email"
                    value={cv.personal.email}
                    onChange={(e) => updatePersonal('email', e.target.value)}
                    placeholder="ex: contact@domaine.com"
                    className={`w-full rounded-lg px-3 py-2 text-xs ${inputClass}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs mb-1 ${labelClass}`} htmlFor="cv-github">
                    GitHub
                  </label>
                  <input
                    id="cv-github"
                    type="text"
                    value={cv.personal.github}
                    onChange={(e) => updatePersonal('github', e.target.value)}
                    placeholder="ex: github.com/votre-nom"
                    className={`w-full rounded-lg px-3 py-2 text-xs ${inputClass}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${labelClass}`} htmlFor="cv-linkedin">
                    LinkedIn
                  </label>
                  <input
                    id="cv-linkedin"
                    type="text"
                    value={cv.personal.linkedin || ''}
                    onChange={(e) => updatePersonal('linkedin', e.target.value)}
                    placeholder="ex: linkedin.com/in/votre-nom"
                    className={`w-full rounded-lg px-3 py-2 text-xs ${inputClass}`}
                  />
                </div>
              </div>
            </div>

            {/* Profile / Summary */}
            <div className={`border rounded-xl p-4 space-y-3 ${cardClass}`}>
              <h3 className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${headingClass}`}>
                <FileText className="w-4 h-4" aria-hidden />
                <span>{isFr ? 'Profil & Accroche Professionnelle' : 'Professional Summary'}</span>
              </h3>
              <div className="flex items-start gap-2">
                <textarea
                  rows={4}
                  value={cv.personal.summary}
                  onChange={(e) => updatePersonal('summary', e.target.value)}
                  placeholder={
                    isFr
                      ? 'Présentez brièvement votre parcours, vos compétences clés, votre passion et vos objectifs professionnels...'
                      : 'Briefly present your background, key skills, and target professional goals...'
                  }
                  className={`w-full rounded-lg px-3 py-2 text-xs leading-relaxed ${inputClass}`}
                />
                {renderAiButton({ kind: 'summary' }, isFr ? 'IA' : 'AI')}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className={`block text-xs mb-1 ${labelClass}`} htmlFor="cv-qualities">
                    {isFr ? 'Atouts / Soft Skills' : 'Key Qualities'}
                  </label>
                  <div className="flex items-start gap-2">
                    <input
                      id="cv-qualities"
                      type="text"
                      value={cv.personal.qualities}
                      onChange={(e) => updatePersonal('qualities', e.target.value)}
                      placeholder="ex: Rigueur, Esprit d'équipe, Agilité"
                      className={`w-full rounded-lg px-3 py-2 text-xs ${inputClass}`}
                    />
                    {renderAiButton({ kind: 'qualities' }, isFr ? 'IA' : 'AI')}
                  </div>
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${labelClass}`} htmlFor="cv-availability">
                    {isFr ? 'Disponibilité / Statut' : 'Availability'}
                  </label>
                  <input
                    id="cv-availability"
                    type="text"
                    value={cv.personal.availability}
                    onChange={(e) => updatePersonal('availability', e.target.value)}
                    placeholder="ex: Disponible immédiatement"
                    className={`w-full rounded-lg px-3 py-2 text-xs ${inputClass}`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ TAB 2: SKILLS ═══════ */}
        {activeTab === 'skills' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center gap-2">
              <h3 className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${headingClass}`}>
                <Code className="w-4 h-4" aria-hidden />
                <span>{isFr ? 'Catégories de Compétences' : 'Skill Categories'}</span>
              </h3>
              <div className="flex items-center gap-2">
                {renderAiButton(
                  { kind: 'skills' },
                  isFr ? 'Suggestions IA' : 'AI Suggestions',
                  'bg-gradient-to-r from-sky-600/20 to-emerald-600/20 text-sky-500 hover:from-sky-600/30 hover:to-emerald-600/30 px-3 py-1.5 rounded-lg border border-sky-500/30 text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-60'
                )}
                <button
                  onClick={addSkillCategory}
                  className="bg-sky-600/20 text-sky-500 hover:bg-sky-600/30 px-3 py-1.5 rounded-lg border border-sky-500/30 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden />
                  <span>{isFr ? 'Ajouter' : 'Add'}</span>
                </button>
              </div>
            </div>

            {cv.skills.length === 0 ? (
              <p className={`text-xs italic text-center py-6 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {isFr ? 'Aucune catégorie de compétence. Cliquez sur Ajouter.' : 'No skill categories yet. Click Add.'}
              </p>
            ) : (
              cv.skills.map((item, idx) => (
                <div key={item.id} className={`border rounded-xl p-3.5 relative space-y-2 ${subCardClass}`}>
                  <button
                    onClick={() => removeSkill(item.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 p-1 transition"
                    aria-label={isFr ? 'Supprimer' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden />
                  </button>
                  <div className="pr-8">
                    <label className={`block ${subLabelClass}`}>{isFr ? `Catégorie ${idx + 1}` : `Category ${idx + 1}`}</label>
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) => updateSkill(item.id, 'category', e.target.value)}
                      placeholder="ex: Développement Web Front-End"
                      className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold ${inputClass}`}
                    />
                  </div>
                  <div className="pr-8">
                    <label className={`block ${subLabelClass}`}>{isFr ? 'Mots-clés (séparés par des virgules)' : 'Keywords (comma separated)'}</label>
                    <input
                      type="text"
                      value={item.tags}
                      onChange={(e) => updateSkill(item.id, 'tags', e.target.value)}
                      placeholder="ex: React, Next.js, TypeScript, Tailwind CSS"
                      className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-medium ${inputClass}`}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ═══════ TAB 3: PROJECTS & EXPERIENCE ═══════ */}
        {activeTab === 'projects' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${headingClass}`}>
                <Briefcase className="w-4 h-4" aria-hidden />
                <span>{isFr ? 'Projets & Expériences Pro' : 'Projects & Experiences'}</span>
              </h3>
              <button
                onClick={addProject}
                className="bg-sky-600/20 text-sky-500 hover:bg-sky-600/30 px-3 py-1.5 rounded-lg border border-sky-500/30 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden />
                <span>{isFr ? 'Ajouter Projet' : 'Add Project'}</span>
              </button>
            </div>

            {cv.projects.length === 0 ? (
              <p className={`text-xs italic text-center py-6 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {isFr ? 'Aucune expérience ou projet.' : 'No experience or project items.'}
              </p>
            ) : (
              cv.projects.map((proj) => (
                <div key={proj.id} className={`border rounded-xl p-4 relative space-y-3 ${subCardClass}`}>
                  <button
                    onClick={() => removeProject(proj.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 p-1 transition"
                    aria-label={isFr ? 'Supprimer le projet' : 'Delete project'}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden />
                  </button>

                  <div className="grid grid-cols-2 gap-3 pr-6">
                    <div>
                      <label className={`block ${subLabelClass}`}>{isFr ? 'Titre du projet / Poste' : 'Project Title / Role'}</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                        placeholder="ex: Marketplace Mobile"
                        className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-bold ${inputClass}`}
                      />
                    </div>
                    <div>
                      <label className={`block ${subLabelClass}`}>{isFr ? 'Entreprise / Client' : 'Company / Client'}</label>
                      <input
                        type="text"
                        value={proj.companyOrClient || ''}
                        onChange={(e) => updateProject(proj.id, 'companyOrClient', e.target.value)}
                        placeholder="ex: TechPro Solutions"
                        className={`w-full rounded-lg px-2.5 py-1.5 text-xs ${inputClass}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className={`block ${subLabelClass}`}>{isFr ? 'Sous-titre' : 'Subtitle'}</label>
                      <input
                        type="text"
                        value={proj.subtitle || ''}
                        onChange={(e) => updateProject(proj.id, 'subtitle', e.target.value)}
                        placeholder="ex: App e-commerce"
                        className={`w-full rounded-lg px-2.5 py-1.5 text-xs ${inputClass}`}
                      />
                    </div>
                    <div>
                      <label className={`block ${subLabelClass}`}>{isFr ? 'Début – Fin' : 'Start – End'}</label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={proj.startDate || ''}
                          onChange={(e) => updateProject(proj.id, 'startDate', e.target.value)}
                          placeholder="2024"
                          className={`w-full rounded-lg px-2.5 py-1.5 text-xs ${inputClass}`}
                        />
                        <input
                          type="text"
                          value={proj.endDate || ''}
                          onChange={(e) => updateProject(proj.id, 'endDate', e.target.value)}
                          placeholder={proj.isCurrent ? (isFr ? 'En cours' : 'Now') : '2025'}
                          className={`w-full rounded-lg px-2.5 py-1.5 text-xs ${inputClass}`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block ${subLabelClass}`}>{isFr ? 'Badge / Tech' : 'Badge Tag'}</label>
                      <input
                        type="text"
                        value={proj.tag || ''}
                        onChange={(e) => updateProject(proj.id, 'tag', e.target.value)}
                        placeholder="ex: Kotlin / React"
                        className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold ${inputClass}`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className={`block ${subLabelClass}`}>{isFr ? 'Description & Résultats' : 'Description & Impact'}</label>
                      {renderAiButton({ kind: 'project', projectId: proj.id }, isFr ? 'Améliorer avec IA' : 'Improve with AI')}
                    </div>
                    <textarea
                      rows={2}
                      value={proj.desc}
                      onChange={(e) => updateProject(proj.id, 'desc', e.target.value)}
                      placeholder={isFr ? 'Décrivez les défis relevés, les technologies utilisées et l\'impact...' : 'Describe challenges, technologies and impact...'}
                      className={`w-full rounded-lg px-2.5 py-1.5 text-xs ${inputClass}`}
                    />
                  </div>

                  {/* Bullets (achievement bullets) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className={`block ${subLabelClass}`}>
                        {isFr ? 'Puces de réussites (optionnel)' : 'Achievement bullets (optional)'}
                      </label>
                      {renderAiButton({ kind: 'bullets', projectId: proj.id }, isFr ? 'Générer puces' : 'Generate bullets')}
                    </div>
                    {(proj.bullets || []).map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-1.5 mb-1.5">
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => {
                            const newBullets = [...(proj.bullets || [])];
                            newBullets[bIdx] = e.target.value;
                            updateProject(proj.id, 'bullets', newBullets);
                          }}
                          placeholder={isFr ? 'ex: Réduction du temps de chargement de 40%' : 'e.g. Reduced load times by 40%'}
                          className={`w-full rounded-lg px-2.5 py-1.5 text-xs ${inputClass}`}
                        />
                        <button
                          onClick={() => {
                            const newBullets = (proj.bullets || []).filter((_, i) => i !== bIdx);
                            updateProject(proj.id, 'bullets', newBullets);
                          }}
                          className="text-slate-400 hover:text-rose-500 p-1 transition shrink-0"
                          aria-label={isFr ? 'Supprimer la puce' : 'Delete bullet'}
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => updateProject(proj.id, 'bullets', [...(proj.bullets || []), ''])}
                      className="text-[11px] text-sky-500 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Plus className="w-3 h-3" aria-hidden /> {isFr ? 'Ajouter une puce' : 'Add bullet'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ═══════ TAB 4: EDUCATION ═══════ */}
        {activeTab === 'education' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${headingClass}`}>
                <GraduationCap className="w-4 h-4" aria-hidden />
                <span>{isFr ? 'Cursus Académique' : 'Education History'}</span>
              </h3>
              <button
                onClick={addEducation}
                className="bg-sky-600/20 text-sky-500 hover:bg-sky-600/30 px-3 py-1.5 rounded-lg border border-sky-500/30 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden />
                <span>{isFr ? 'Ajouter Formation' : 'Add Education'}</span>
              </button>
            </div>

            {cv.education.length === 0 ? (
              <p className={`text-xs italic text-center py-6 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {isFr ? 'Aucune formation.' : 'No education records.'}
              </p>
            ) : (
              cv.education.map((edu) => (
                <div key={edu.id} className={`border rounded-xl p-4 relative space-y-3 ${subCardClass}`}>
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 p-1 transition"
                    aria-label={isFr ? 'Supprimer' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden />
                  </button>

                  <div className="grid grid-cols-3 gap-2 pr-6">
                    <div className="col-span-2">
                      <label className={`block ${subLabelClass}`}>{isFr ? 'Diplôme / Formation' : 'Degree / Program'}</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        placeholder="ex: Master en Génie Logiciel"
                        className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-bold ${inputClass}`}
                      />
                    </div>
                    <div>
                      <label className={`block ${subLabelClass}`}>{isFr ? 'Période' : 'Period'}</label>
                      <input
                        type="text"
                        value={edu.period}
                        onChange={(e) => updateEducation(edu.id, 'period', e.target.value)}
                        placeholder="ex: 2023 - 2025"
                        className={`w-full rounded-lg px-2.5 py-1.5 text-xs ${inputClass}`}
                      />
                    </div>
                  </div>

                  <div className="pr-6">
                    <label className={`block ${subLabelClass}`}>{isFr ? 'Établissement & Ville' : 'School & Location'}</label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                      placeholder="ex: Université de Lomé, Togo"
                      className={`w-full rounded-lg px-2.5 py-1.5 text-xs ${inputClass}`}
                    />
                  </div>

                  <div className="pr-6">
                    <label className={`block ${subLabelClass}`}>{isFr ? 'Mention / Détails' : 'Honors / Details'}</label>
                    <input
                      type="text"
                      value={edu.details || ''}
                      onChange={(e) => updateEducation(edu.id, 'details', e.target.value)}
                      placeholder="ex: Mention Très Bien, Spécialité Web"
                      className={`w-full rounded-lg px-2.5 py-1.5 text-xs ${inputClass}`}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ═══════ TAB 5: LANGUAGES ═══════ */}
        {activeTab === 'languages' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${headingClass}`}>
                <Globe className="w-4 h-4" aria-hidden />
                <span>{isFr ? 'Langues Pratiquées' : 'Languages Spoken'}</span>
              </h3>
              <button
                onClick={addLanguage}
                className="bg-sky-600/20 text-sky-500 hover:bg-sky-600/30 px-3 py-1.5 rounded-lg border border-sky-500/30 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden />
                <span>{isFr ? 'Ajouter Langue' : 'Add Language'}</span>
              </button>
            </div>

            {cv.languages.length === 0 ? (
              <p className={`text-xs italic text-center py-6 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {isFr ? 'Aucune langue ajoutée.' : 'No languages added.'}
              </p>
            ) : (
              cv.languages.map((langItem) => (
                <div key={langItem.id} className={`border rounded-xl p-3 flex items-center gap-2 relative ${subCardClass}`}>
                  <input
                    type="text"
                    value={langItem.name}
                    onChange={(e) => updateLanguage(langItem.id, 'name', e.target.value)}
                    placeholder="ex: Français"
                    className={`w-1/2 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${inputClass}`}
                  />
                  <input
                    type="text"
                    value={langItem.level}
                    onChange={(e) => updateLanguage(langItem.id, 'level', e.target.value)}
                    placeholder="ex: Maternelle / Courant / B2"
                    className={`w-1/2 rounded-lg px-2.5 py-1.5 text-xs ${inputClass}`}
                  />
                  <button
                    onClick={() => removeLanguage(langItem.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 transition shrink-0"
                    aria-label={isFr ? 'Supprimer' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ═══════ TAB 6: CUSTOM SECTIONS ═══════ */}
        {activeTab === 'custom' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${headingClass}`}>
                <Layers className="w-4 h-4" aria-hidden />
                <span>{isFr ? 'Sections Personnalisées' : 'Custom Sections'}</span>
              </h3>
              <button
                onClick={addCustomSection}
                className="bg-sky-600/20 text-sky-500 hover:bg-sky-600/30 px-3 py-1.5 rounded-lg border border-sky-500/30 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden />
                <span>{isFr ? 'Nouvelle Section' : 'New Section'}</span>
              </button>
            </div>

            {cv.customSections.length === 0 ? (
              <p className={`text-xs italic text-center py-6 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {isFr ? 'Ajoutez des certifications, projets personnels ou bénévolat.' : 'Add certifications, side projects, or volunteer work.'}
              </p>
            ) : (
              cv.customSections.map((sec) => (
                <div key={sec.id} className={`border rounded-xl p-4 space-y-3 relative ${subCardClass}`}>
                  <button
                    onClick={() => {
                      const updated = cv.customSections.filter((s) => s.id !== sec.id);
                      onChange({ ...cv, customSections: updated });
                    }}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 p-1"
                    aria-label={isFr ? 'Supprimer la section' : 'Delete section'}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden />
                  </button>

                  <div className="pr-6">
                    <label className={`block ${subLabelClass}`}>{isFr ? 'Titre de la section' : 'Section Title'}</label>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => {
                        const updated = cv.customSections.map((s) => (s.id === sec.id ? { ...s, title: e.target.value } : s));
                        onChange({ ...cv, customSections: updated });
                      }}
                      placeholder="ex: Certifications & Prix"
                      className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-bold ${inputClass}`}
                    />
                  </div>

                  <div className="space-y-2">
                    {sec.items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-lg border grid grid-cols-3 gap-2 ${isDarkMode ? 'bg-slate-900 border-slate-700/60' : 'bg-white border-slate-200'}`}
                      >
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const newItems = sec.items.map((it) => (it.id === item.id ? { ...it, title: e.target.value } : it));
                            const newSecs = cv.customSections.map((s) => (s.id === sec.id ? { ...s, items: newItems } : s));
                            onChange({ ...cv, customSections: newSecs });
                          }}
                          placeholder={isFr ? 'Titre' : 'Title'}
                          className={`rounded px-2 py-1 text-xs font-semibold ${inputClass}`}
                        />
                        <input
                          type="text"
                          value={item.subtitle || ''}
                          onChange={(e) => {
                            const newItems = sec.items.map((it) => (it.id === item.id ? { ...it, subtitle: e.target.value } : it));
                            const newSecs = cv.customSections.map((s) => (s.id === sec.id ? { ...s, items: newItems } : s));
                            onChange({ ...cv, customSections: newSecs });
                          }}
                          placeholder={isFr ? 'Organisme' : 'Institution'}
                          className={`rounded px-2 py-1 text-xs ${inputClass}`}
                        />
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={item.period || ''}
                            onChange={(e) => {
                              const newItems = sec.items.map((it) => (it.id === item.id ? { ...it, period: e.target.value } : it));
                              const newSecs = cv.customSections.map((s) => (s.id === sec.id ? { ...s, items: newItems } : s));
                              onChange({ ...cv, customSections: newSecs });
                            }}
                            placeholder="2024"
                            className={`w-full rounded px-2 py-1 text-xs ${inputClass}`}
                          />
                          <button
                            onClick={() => {
                              const newItems = sec.items.filter((it) => it.id !== item.id);
                              const newSecs = cv.customSections.map((s) => (s.id === sec.id ? { ...s, items: newItems } : s));
                              onChange({ ...cv, customSections: newSecs });
                            }}
                            className="text-slate-400 hover:text-rose-500 p-1 transition shrink-0"
                            aria-label={isFr ? 'Supprimer' : 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newItem = { id: Date.now().toString(), title: isFr ? 'Élément' : 'Item', subtitle: '' };
                        const newSecs = cv.customSections.map((s) => (s.id === sec.id ? { ...s, items: [...s.items, newItem] } : s));
                        onChange({ ...cv, customSections: newSecs });
                      }}
                      className="text-[11px] text-sky-500 hover:underline flex items-center gap-1 font-semibold pt-1"
                    >
                      <Plus className="w-3 h-3" aria-hidden /> {isFr ? 'Ajouter une ligne' : 'Add item'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ═══════ TAB 7: STYLE & THEME ═══════ */}
        {activeTab === 'style' && (
          <div className="space-y-5 animate-fade-in">
            {/* Template Chooser */}
            <div className={`border rounded-xl p-4 space-y-3 ${cardClass}`}>
              <h3 className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${headingClass}`}>
                <Palette className="w-4 h-4" aria-hidden />
                <span>{isFr ? 'Modèle de Design' : 'Layout Template'}</span>
              </h3>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'modern', label: isFr ? 'Moderne (Sidebar)' : 'Modern (Sidebar)', hint: isFr ? 'Colonne latérale' : 'Sidebar layout' },
                  { id: 'minimalist', label: isFr ? 'Minimaliste' : 'Minimalist', hint: isFr ? '1 colonne épurée' : 'Single column' },
                  { id: 'executive', label: isFr ? 'Exécutif' : 'Executive', hint: isFr ? 'En-tête centré premium' : 'Premium centered header' },
                  { id: 'creative', label: isFr ? 'Créatif' : 'Creative', hint: isFr ? 'Dégradé & badges' : 'Gradient & chips' }
                ].map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => updateTheme('template', tmpl.id as TemplateStyle)}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 text-center ${
                      cv.theme.template === tmpl.id
                        ? 'bg-sky-600 border-sky-400 text-white shadow-lg'
                        : isDarkMode
                          ? 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                          : 'bg-slate-50 border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span>{tmpl.label}</span>
                    <span className={`text-[9px] font-normal ${cv.theme.template === tmpl.id ? 'text-white/70' : isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      {tmpl.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className={`border rounded-xl p-4 space-y-3 ${cardClass}`}>
              <div>
                <h3 className={`text-xs uppercase tracking-wider ${headingClass}`}>{isFr ? 'Thème & Couleurs du CV' : 'CV Colors & Theme'}</h3>
                <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {isFr
                    ? 'Choisissez une palette prédéfinie ou personnalisez le fond de la sidebar / en-tête et la couleur des icônes/titres.'
                    : 'Select a preset palette or customize background and accent colors.'}
                </p>
              </div>

              {/* Presets */}
              <div className="space-y-1.5">
                <span className={`text-[10px] uppercase tracking-wider font-bold block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {isFr ? 'Palettes Prédéfinies' : 'Preset Palettes'}
                </span>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {[
                    { name: 'Bleu Slate', bg: '#0f172a', accent: '#0284c7' },
                    { name: 'Rouge Crimson', bg: '#881337', accent: '#be123c' },
                    { name: 'Bleu Roi', bg: '#1e3a8a', accent: '#2563eb' },
                    { name: 'Vert Émeraude', bg: '#064e3b', accent: '#059669' },
                    { name: 'Violet Améthyste', bg: '#4c1d95', accent: '#7c3aed' },
                    { name: 'Teal / Cyan', bg: '#134e4a', accent: '#0d9488' },
                    { name: 'Ambre Soleil', bg: '#78350f', accent: '#d97706' },
                    { name: 'Rose Vif', bg: '#881337', accent: '#f43f5e' },
                    { name: 'Bordeaux Profond', bg: '#4c0519', accent: '#e11d48' },
                    { name: 'Noir Anthracite', bg: '#18181b', accent: '#38bdf8' }
                  ].map((c) => {
                    const isActive = (cv.theme.primaryColor || '#0f172a').toLowerCase() === c.bg.toLowerCase();
                    return (
                      <button
                        key={c.name}
                        onClick={() => {
                          updateTheme('primaryColor', c.bg);
                          updateTheme('accentColor', c.accent);
                        }}
                        className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 relative overflow-hidden ${
                          isActive ? 'border-white ring-2 ring-sky-400 scale-110 shadow-lg' : 'border-slate-400'
                        }`}
                        style={{ backgroundColor: c.bg }}
                        title={c.name}
                        aria-label={c.name}
                      >
                        <span className="absolute right-0 bottom-0 w-3.5 h-3.5 rounded-tl-full" style={{ backgroundColor: c.accent }} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className={`grid grid-cols-2 gap-2.5 pt-2 border-t ${isDarkMode ? 'border-slate-700/60' : 'border-slate-200'}`}>
                <label
                  className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border text-[11px] transition ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300' : 'bg-slate-50 border-slate-300 hover:border-slate-400 text-slate-800'
                  }`}
                >
                  <input
                    type="color"
                    value={cv.theme.primaryColor || '#0f172a'}
                    onChange={(e) => updateTheme('primaryColor', e.target.value)}
                    className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent shrink-0"
                    aria-label={isFr ? 'Couleur de fond' : 'Background color'}
                  />
                  <div className="truncate">
                    <div className="font-semibold">{isFr ? 'Couleur de fond' : 'Background'}</div>
                    <div className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {isFr ? 'Sidebar / En-tête' : 'Sidebar / Header'}
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border text-[11px] transition ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300' : 'bg-slate-50 border-slate-300 hover:border-slate-400 text-slate-800'
                  }`}
                >
                  <input
                    type="color"
                    value={cv.theme.accentColor || '#0284c7'}
                    onChange={(e) => updateTheme('accentColor', e.target.value)}
                    className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent shrink-0"
                    aria-label={isFr ? "Couleur d'accent" : 'Accent color'}
                  />
                  <div className="truncate">
                    <div className="font-semibold">{isFr ? "Couleur d'accent" : 'Accent Color'}</div>
                    <div className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {isFr ? 'Icônes & Bordures' : 'Icons & Titles'}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Fonts & Spacing */}
            <div className={`border rounded-xl p-4 space-y-3 ${cardClass}`}>
              <h3 className={`text-xs uppercase tracking-wider ${headingClass}`}>{isFr ? 'Typographie & Densité' : 'Typography & Spacing'}</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs mb-1 ${labelClass}`} htmlFor="cv-font">
                    {isFr ? 'Police de caractères' : 'Font Family'}
                  </label>
                  <select
                    id="cv-font"
                    value={cv.theme.fontFamily}
                    onChange={(e) => updateTheme('fontFamily', e.target.value as FontStyle)}
                    className={`w-full rounded-lg px-2.5 py-2 text-xs ${inputClass}`}
                  >
                    <option value="sans">Inter / Modern Sans</option>
                    <option value="display">Jakarta / Display</option>
                    <option value="serif">Lora / Serif Élégant</option>
                    <option value="mono">Fira Code / Tech Mono</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs mb-1 ${labelClass}`} htmlFor="cv-density">
                    {isFr ? 'Espacement / Densité' : 'Spacing Density'}
                  </label>
                  <select
                    id="cv-density"
                    value={cv.theme.density}
                    onChange={(e) => updateTheme('density', e.target.value as SpacingDensity)}
                    className={`w-full rounded-lg px-2.5 py-2 text-xs ${inputClass}`}
                  >
                    <option value="compact">{isFr ? 'Compact (1 page)' : 'Compact (1 page)'}</option>
                    <option value="normal">{isFr ? 'Normal (Équilibré)' : 'Normal'}</option>
                    <option value="spacious">{isFr ? 'Aéré' : 'Spacious'}</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="toggle-photo"
                  checked={cv.theme.showPhoto}
                  onChange={(e) => updateTheme('showPhoto', e.target.checked)}
                  className="rounded border-slate-400 text-sky-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="toggle-photo" className={`text-xs font-medium cursor-pointer ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  {isFr ? "Afficher l'emplacement photo" : 'Display profile photo'}
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
