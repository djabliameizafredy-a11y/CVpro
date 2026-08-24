'use client';

import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Github,
  Linkedin,
  Car,
  Briefcase,
  GraduationCap,
  Award,
  UserCheck,
  Globe as GlobeIcon
} from 'lucide-react';
import { CVData, ProjectItem } from '@/lib/cv/types';

interface CVPreviewProps {
  cv: CVData;
}

const Bullets: React.FC<{ items?: string[] }> = ({ items }) => {
  if (!items || items.length === 0) return null;
  return (
    <ul className="mt-1.5 space-y-1">
      {items.map((b, i) => (
        <li key={i} className="flex gap-1.5 text-[11px] leading-snug text-slate-700">
          <span className="text-slate-400 shrink-0 mt-[3px]">▪</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
};

const ProjectDates: React.FC<{ p: ProjectItem; fr: boolean }> = ({ p, fr }) => {
  if (!p.startDate && !p.endDate) return null;
  const end = p.isCurrent ? (fr ? 'Aujourd’hui' : 'Present') : p.endDate;
  const dates = [p.startDate, end].filter(Boolean).join(' – ');
  return <span className="text-[10px] text-slate-500 font-semibold whitespace-nowrap">{dates}</span>;
};

export const CVPreview: React.FC<CVPreviewProps> = ({ cv }) => {
  const { personal, skills, projects, education, languages, customSections, theme } = cv;
  const isFr = cv.lang === 'fr';

  const primaryBg = theme.primaryColor || '#0f172a';
  const accentColor = theme.accentColor || '#0284c7';

  const getFontClass = () => {
    switch (theme.fontFamily) {
      case 'serif':
        return 'font-serif-lora';
      case 'mono':
        return 'font-mono-fira';
      case 'display':
        return 'font-sans-jakarta';
      default:
        return 'font-sans-inter';
    }
  };

  const getDensityClass = () => {
    switch (theme.density) {
      case 'compact':
        return { pad: 'p-5', gap: 'space-y-3', text: 'text-[11px]', heading: 'text-xs' };
      case 'spacious':
        return { pad: 'p-8', gap: 'space-y-6', text: 'text-xs', heading: 'text-sm' };
      default:
        return { pad: 'p-6', gap: 'space-y-4', text: 'text-xs', heading: 'text-xs' };
    }
  };

  const density = getDensityClass();
  const defaultAvatarSvg =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>";

  /* ================= TEMPLATE 1: MODERN (Sidebar on left) ================= */
  if (theme.template === 'modern') {
    return (
      <div
        id="cv-preview-container"
        className={`cv-paper-container w-full bg-white text-slate-800 shadow-2xl rounded-lg overflow-hidden border border-slate-200 grid grid-cols-12 min-h-[297mm] ${getFontClass()}`}
      >
        {/* SIDEBAR (Col 4) */}
        <aside className="col-span-4 text-white p-6 flex flex-col justify-between transition-colors duration-300" style={{ backgroundColor: primaryBg }}>
          <div>
            {/* Photo & Identity */}
            <div className="flex flex-col items-center text-center mb-6">
              {theme.showPhoto && (
                <div className="relative w-28 h-28 mb-3">
                  <img
                    src={personal.photoUrl || defaultAvatarSvg}
                    alt={isFr ? 'Photo de profil' : 'Profile photo'}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white/20 shadow-xl bg-slate-800"
                  />
                </div>
              )}
              <h1 className="text-base font-extrabold uppercase tracking-wide text-white break-words w-full">
                {personal.firstName || (isFr ? 'Prénom' : 'First Name')}
              </h1>
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-white mb-1 break-words w-full">
                {personal.lastName || (isFr ? 'Nom' : 'Last Name')}
              </h2>
              {personal.nationality && (
                <p className="text-[10px] font-medium text-white bg-white/20 px-2.5 py-0.5 rounded-full border border-white/20 mt-1 inline-block">
                  {personal.nationality} {personal.drivingLicense ? `• ${personal.drivingLicense}` : ''}
                </p>
              )}
            </div>

            {/* Contacts */}
            <div className="mb-5 border-t border-white/20 pt-4">
              <h3 className="text-[11px] font-bold uppercase tracking-wider mb-2.5 text-white">Contact</h3>
              <ul className="space-y-2 text-[11px] text-white/95">
                {personal.address && (
                  <li className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-white/90" aria-hidden />
                    <span className="truncate">{personal.address}</span>
                  </li>
                )}
                {personal.phone && (
                  <li className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-white/90" aria-hidden />
                    <span>{personal.phone}</span>
                  </li>
                )}
                {personal.email && (
                  <li className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-white/90" aria-hidden />
                    <span className="break-all">{personal.email}</span>
                  </li>
                )}
                {personal.github && (
                  <li className="flex items-center gap-2">
                    <Github className="w-3.5 h-3.5 shrink-0 text-white/90" aria-hidden />
                    <span className="break-all">{personal.github}</span>
                  </li>
                )}
                {personal.linkedin && (
                  <li className="flex items-center gap-2">
                    <Linkedin className="w-3.5 h-3.5 shrink-0 text-white/90" aria-hidden />
                    <span className="break-all">{personal.linkedin}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mb-5 border-t border-white/20 pt-4">
                <h3 className="text-[11px] font-bold uppercase tracking-wider mb-2.5 text-white">
                  {isFr ? 'Compétences Tech' : 'Tech Skills'}
                </h3>
                <div className="space-y-2.5 text-[11px]">
                  {skills.map((s) => {
                    const tags = s.tags.split(',').filter((t) => t.trim() !== '');
                    return (
                      <div key={s.id}>
                        <span className="text-white/90 font-semibold block mb-1 text-[10px]">{s.category}</span>
                        <div className="flex flex-wrap gap-1">
                          {tags.map((t, idx) => (
                            <span key={idx} className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-medium border border-white/10">
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div className="border-t border-white/20 pt-4">
                <h3 className="text-[11px] font-bold uppercase tracking-wider mb-2.5 text-white">{isFr ? 'Langues' : 'Languages'}</h3>
                <ul className="space-y-1.5 text-[11px] text-white/95">
                  {languages.map((l) => (
                    <li key={l.id} className="flex justify-between items-center">
                      <span className="font-semibold">{l.name}</span>
                      <span className="text-white/80 text-[10px]">{l.level}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="text-[9px] text-white/80 pt-4 border-t border-white/10 text-center uppercase tracking-widest">
            {isFr ? 'Document Officiel' : 'Official Resume'}
          </div>
        </aside>

        {/* MAIN COLUMN (Col 8) */}
        <main className={`col-span-8 ${density.pad} bg-white flex flex-col justify-between`}>
          <div className={density.gap}>
            {/* Header Banner */}
            <div className="border-b-2 border-slate-200 pb-3">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                {personal.jobTitle || (isFr ? 'Titre du Poste' : 'Job Title')}
              </h2>
              <p className="font-semibold text-xs mt-0.5 transition-colors" style={{ color: accentColor }}>
                {personal.subTitle || (isFr ? 'Spécialité & Domaine' : 'Specialization')}
              </p>
            </div>

            {/* Profile Summary */}
            {personal.summary && (
              <section>
                <h3
                  className="text-[11px] font-bold uppercase tracking-wider text-slate-800 bg-slate-100 px-2.5 py-1.5 rounded mb-2 flex items-center gap-1.5 border-l-4 transition-all"
                  style={{ borderLeftColor: accentColor }}
                >
                  <UserCheck className="w-3.5 h-3.5" style={{ color: accentColor }} aria-hidden />
                  <span>{isFr ? 'Profil Professionnel' : 'Professional Summary'}</span>
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-3 rounded-lg border border-slate-100">{personal.summary}</p>
              </section>
            )}

            {/* Projects & Experience */}
            {projects.length > 0 && (
              <section>
                <h3
                  className="text-[11px] font-bold uppercase tracking-wider text-slate-800 bg-slate-100 px-2.5 py-1.5 rounded mb-2.5 flex items-center gap-1.5 border-l-4 transition-all"
                  style={{ borderLeftColor: accentColor }}
                >
                  <Briefcase className="w-3.5 h-3.5" style={{ color: accentColor }} aria-hidden />
                  <span>{isFr ? 'Projets & Expériences' : 'Projects & Experiences'}</span>
                </h3>
                <div className="space-y-3">
                  {projects.map((p) => (
                    <div key={p.id} className="border-l-2 pl-3 py-0.5 transition-all" style={{ borderLeftColor: accentColor }}>
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className="font-bold text-slate-900 text-xs">
                          {p.title} {p.companyOrClient ? <span className="font-normal text-slate-600">• {p.companyOrClient}</span> : null}
                        </h4>
                        <div className="flex items-center gap-2">
                          <ProjectDates p={p} fr={isFr} />
                          {p.tag && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white shadow-sm" style={{ backgroundColor: accentColor }}>
                              {p.tag}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-normal">{p.desc}</p>
                      <Bullets items={p.bullets} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section>
                <h3
                  className="text-[11px] font-bold uppercase tracking-wider text-slate-800 bg-slate-100 px-2.5 py-1.5 rounded mb-2 flex items-center gap-1.5 border-l-4 transition-all"
                  style={{ borderLeftColor: accentColor }}
                >
                  <GraduationCap className="w-3.5 h-3.5" style={{ color: accentColor }} aria-hidden />
                  <span>{isFr ? 'Cursus Académique' : 'Education'}</span>
                </h3>
                <div className="space-y-2.5">
                  {education.map((e) => (
                    <div key={e.id} className="flex justify-between items-start text-xs border-b border-slate-100 pb-2 last:border-none">
                      <div>
                        <h4 className="font-bold text-slate-900">{e.degree}</h4>
                        <p className="text-slate-700 text-[11px]">{e.school}</p>
                        {e.details && <p className="text-[10px] text-slate-500 italic mt-0.5">{e.details}</p>}
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold whitespace-nowrap">{e.period}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Custom Sections */}
            {customSections.map((sec) => (
              <section key={sec.id}>
                <h3
                  className="text-[11px] font-bold uppercase tracking-wider text-slate-800 bg-slate-100 px-2.5 py-1.5 rounded mb-2 flex items-center gap-1.5 border-l-4 transition-all"
                  style={{ borderLeftColor: accentColor }}
                >
                  <Award className="w-3.5 h-3.5" style={{ color: accentColor }} aria-hidden />
                  <span>{sec.title}</span>
                </h3>
                <div className="space-y-1.5 text-xs">
                  {sec.items.map((it) => (
                    <div key={it.id} className="flex justify-between items-center text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100">
                      <span className="font-semibold">{it.title}</span>
                      <span className="text-[10px] text-slate-600">{it.subtitle}</span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Footer Bar */}
          <div className="border-t border-slate-100 pt-3 mt-4 flex justify-between items-center gap-2 text-[10px] text-slate-600">
            {personal.qualities && (
              <div>
                <span className="font-bold text-slate-800">{isFr ? 'Atouts :' : 'Strengths:'}</span> {personal.qualities}
              </div>
            )}
            {personal.availability && (
              <div className="font-bold text-white px-2.5 py-0.5 rounded shadow-sm whitespace-nowrap" style={{ backgroundColor: accentColor }}>
                {personal.availability}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  /* ================= TEMPLATE 2: MINIMALIST (Single column, colored banner) ================= */
  if (theme.template === 'minimalist') {
    return (
      <div
        id="cv-preview-container"
        className={`cv-paper-container w-full bg-white text-slate-800 shadow-2xl rounded-lg overflow-hidden border border-slate-200 min-h-[297mm] flex flex-col justify-between ${getFontClass()}`}
      >
        <div>
          {/* Top Banner Header */}
          <div className="p-6 text-white flex justify-between items-start gap-4 transition-colors duration-300" style={{ backgroundColor: primaryBg }}>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white">
                {personal.firstName} {personal.lastName}
              </h1>
              <h2 className="text-sm font-bold uppercase tracking-widest text-white/90 mt-1">{personal.jobTitle}</h2>
              {personal.subTitle && <p className="text-xs text-white/80 mt-0.5">{personal.subTitle}</p>}
            </div>

            <div className="text-right text-[11px] text-white/90 space-y-0.5 shrink-0">
              {personal.email && <div>{personal.email}</div>}
              {personal.phone && <div>{personal.phone}</div>}
              {personal.address && <div>{personal.address}</div>}
              {personal.github && <div>{personal.github}</div>}
            </div>
          </div>

          <div className={`p-8 space-y-5 ${getDensityClass().gap}`}>
            {/* Profile Summary */}
            {personal.summary && (
              <section>
                <h3
                  className="text-xs font-extrabold uppercase tracking-widest text-slate-800 bg-slate-100 px-3 py-1 rounded mb-2 inline-block border-l-4"
                  style={{ borderLeftColor: accentColor }}
                >
                  {isFr ? 'À propos' : 'Profile'}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed mt-1">{personal.summary}</p>
              </section>
            )}

            {/* Skills Grid */}
            {skills.length > 0 && (
              <section>
                <h3
                  className="text-xs font-extrabold uppercase tracking-widest text-slate-800 bg-slate-100 px-3 py-1 rounded mb-2 inline-block border-l-4"
                  style={{ borderLeftColor: accentColor }}
                >
                  {isFr ? 'Compétences Techniques' : 'Technical Skills'}
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs mt-1">
                  {skills.map((s) => (
                    <div key={s.id} className="bg-slate-50 p-2.5 rounded border border-slate-100">
                      <span className="font-bold text-slate-900 block mb-1">{s.category}</span>
                      <p className="text-slate-700 text-[11px]">{s.tags}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Experience */}
            {projects.length > 0 && (
              <section>
                <h3
                  className="text-xs font-extrabold uppercase tracking-widest text-slate-800 bg-slate-100 px-3 py-1 rounded mb-3 inline-block border-l-4"
                  style={{ borderLeftColor: accentColor }}
                >
                  {isFr ? 'Expériences & Réalisations' : 'Experience & Projects'}
                </h3>
                <div className="space-y-3">
                  {projects.map((p) => (
                    <div key={p.id} className="text-xs border-l-2 pl-3" style={{ borderLeftColor: accentColor }}>
                      <div className="flex justify-between items-baseline gap-2 font-bold text-slate-900">
                        <span>
                          {p.title} {p.companyOrClient ? `— ${p.companyOrClient}` : ''}
                        </span>
                        <ProjectDates p={p} fr={isFr} />
                      </div>
                      <p className="text-slate-700 mt-0.5">{p.desc}</p>
                      <Bullets items={p.bullets} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section>
                <h3
                  className="text-xs font-extrabold uppercase tracking-widest text-slate-800 bg-slate-100 px-3 py-1 rounded mb-2 inline-block border-l-4"
                  style={{ borderLeftColor: accentColor }}
                >
                  {isFr ? 'Diplômes & Formations' : 'Education & Credentials'}
                </h3>
                <div className="space-y-2 text-xs mt-1">
                  {education.map((e) => (
                    <div key={e.id} className="flex justify-between items-baseline border-b border-slate-100 pb-1.5">
                      <div>
                        <span className="font-bold text-slate-900">{e.degree}</span>
                        <span className="text-slate-600 ml-2">({e.school})</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{e.period}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Custom sections + languages */}
            {customSections.map((sec) => (
              <section key={sec.id}>
                <h3
                  className="text-xs font-extrabold uppercase tracking-widest text-slate-800 bg-slate-100 px-3 py-1 rounded mb-2 inline-block border-l-4"
                  style={{ borderLeftColor: accentColor }}
                >
                  {sec.title}
                </h3>
                <div className="space-y-1.5 text-xs mt-1">
                  {sec.items.map((it) => (
                    <div key={it.id} className="flex justify-between items-baseline border-b border-slate-100 pb-1.5">
                      <span className="font-semibold text-slate-900">{it.title}</span>
                      <span className="text-[10px] text-slate-600">
                        {it.subtitle} {it.period ? `• ${it.period}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {languages.length > 0 && (
              <section>
                <h3
                  className="text-xs font-extrabold uppercase tracking-widest text-slate-800 bg-slate-100 px-3 py-1 rounded mb-2 inline-block border-l-4"
                  style={{ borderLeftColor: accentColor }}
                >
                  {isFr ? 'Langues' : 'Languages'}
                </h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {languages.map((l) => (
                    <span key={l.id} className="text-[11px] bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                      <strong className="text-slate-900">{l.name}</strong> — <span className="text-slate-600">{l.level}</span>
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 p-4 flex justify-between gap-2 text-[10px] text-slate-600">
          <span>{personal.qualities}</span>
          <span className="font-semibold whitespace-nowrap">{personal.availability}</span>
        </div>
      </div>
    );
  }

  /* ================= TEMPLATE 3: EXECUTIVE (Premium centered header + timeline) ================= */
  if (theme.template === 'executive') {
    return (
      <div
        id="cv-preview-container"
        className={`cv-paper-container w-full bg-white text-slate-800 shadow-2xl rounded-lg overflow-hidden border border-slate-200 min-h-[297mm] flex flex-col ${getFontClass()}`}
      >
        {/* Executive Centered Header */}
        <header className="relative text-white text-center pt-8 pb-6 px-8" style={{ backgroundColor: primaryBg }}>
          <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accentColor }} aria-hidden />
          {theme.showPhoto && (
            <img
              src={personal.photoUrl || defaultAvatarSvg}
              alt={isFr ? 'Photo de profil' : 'Profile photo'}
              className="w-24 h-24 rounded-full object-cover border-4 mx-auto mb-3 shadow-2xl bg-slate-800"
              style={{ borderColor: accentColor }}
            />
          )}
          <h1 className="text-3xl font-black uppercase tracking-[0.2em] text-white leading-tight">
            {personal.firstName} {personal.lastName}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="h-px w-10" style={{ backgroundColor: accentColor }} aria-hidden />
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/90">{personal.jobTitle}</h2>
            <span className="h-px w-10" style={{ backgroundColor: accentColor }} aria-hidden />
          </div>
          {personal.subTitle && <p className="text-[11px] text-white/70 mt-1 italic">{personal.subTitle}</p>}

          <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-1 text-[10px] text-white/85 mt-4 pt-3 border-t border-white/15">
            {personal.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3 h-3" style={{ color: accentColor }} aria-hidden /> {personal.email}
              </span>
            )}
            {personal.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3" style={{ color: accentColor }} aria-hidden /> {personal.phone}
              </span>
            )}
            {personal.address && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3" style={{ color: accentColor }} aria-hidden /> {personal.address}
              </span>
            )}
            {personal.linkedin && (
              <span className="flex items-center gap-1.5">
                <Linkedin className="w-3 h-3" style={{ color: accentColor }} aria-hidden /> {personal.linkedin}
              </span>
            )}
          </div>
        </header>

        <div className={`px-8 py-6 grid grid-cols-12 gap-6 flex-1 ${density.gap}`}>
          {/* Left main column */}
          <div className="col-span-8 space-y-5">
            {personal.summary && (
              <section>
                <h3 className="text-[11px] font-black uppercase tracking-[0.25em] pb-1.5 mb-2 border-b-2" style={{ borderColor: primaryBg }}>
                  {isFr ? 'Profil de Direction' : 'Executive Profile'}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">{personal.summary}</p>
              </section>
            )}

            {projects.length > 0 && (
              <section>
                <h3 className="text-[11px] font-black uppercase tracking-[0.25em] pb-1.5 mb-3 border-b-2" style={{ borderColor: primaryBg }}>
                  {isFr ? 'Parcours & Réalisations' : 'Track Record'}
                </h3>
                <div className="relative pl-4 space-y-4">
                  {/* timeline vertical line */}
                  <span className="absolute left-0 top-1 bottom-1 w-px" style={{ backgroundColor: `${accentColor}55` }} aria-hidden />
                  {projects.map((p) => (
                    <div key={p.id} className="relative">
                      <span
                        className="absolute -left-[18px] top-1.5 w-2.5 h-2.5 rounded-full border-2 bg-white"
                        style={{ borderColor: accentColor }}
                        aria-hidden
                      />
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className="text-xs font-bold text-slate-900">
                          {p.title}
                          {p.companyOrClient ? <span className="font-semibold text-slate-500"> — {p.companyOrClient}</span> : null}
                        </h4>
                        <ProjectDates p={p} fr={isFr} />
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed mt-0.5">{p.desc}</p>
                      <Bullets items={p.bullets} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {education.length > 0 && (
              <section>
                <h3 className="text-[11px] font-black uppercase tracking-[0.25em] pb-1.5 mb-2 border-b-2" style={{ borderColor: primaryBg }}>
                  {isFr ? 'Formation' : 'Education'}
                </h3>
                <div className="space-y-2">
                  {education.map((e) => (
                    <div key={e.id} className="flex justify-between items-start text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{e.degree}</span>
                        <p className="text-slate-600 text-[11px]">
                          {e.school} {e.location ? `• ${e.location}` : ''}
                        </p>
                        {e.details && <p className="text-[10px] text-slate-500 italic">{e.details}</p>}
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold whitespace-nowrap">{e.period}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column */}
          <aside className="col-span-4 space-y-5">
            {skills.length > 0 && (
              <section className="rounded-lg p-4 text-white shadow-inner" style={{ backgroundColor: primaryBg }}>
                <h3 className="text-[10px] font-black uppercase tracking-[0.25em] mb-3 text-white/90">
                  {isFr ? 'Expertises' : 'Expertise'}
                </h3>
                <div className="space-y-2.5">
                  {skills.map((s) => {
                    const tags = s.tags.split(',').filter((t) => t.trim() !== '');
                    return (
                      <div key={s.id}>
                        <p className="text-[10px] font-bold text-white/95 mb-1">{s.category}</p>
                        <div className="flex flex-wrap gap-1">
                          {tags.map((t, idx) => (
                            <span key={idx} className="text-[9px] bg-white/15 text-white px-1.5 py-0.5 rounded border border-white/10">
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {languages.length > 0 && (
              <section>
                <h3 className="text-[11px] font-black uppercase tracking-[0.25em] pb-1.5 mb-2 border-b-2" style={{ borderColor: primaryBg }}>
                  {isFr ? 'Langues' : 'Languages'}
                </h3>
                <div className="space-y-1.5">
                  {languages.map((l) => (
                    <div key={l.id} className="flex justify-between text-[11px] border-b border-dashed border-slate-200 pb-1">
                      <span className="font-semibold text-slate-800">{l.name}</span>
                      <span className="text-slate-500">{l.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {customSections.map((sec) => (
              <section key={sec.id}>
                <h3 className="text-[11px] font-black uppercase tracking-[0.25em] pb-1.5 mb-2 border-b-2" style={{ borderColor: primaryBg }}>
                  {sec.title}
                </h3>
                <div className="space-y-1.5">
                  {sec.items.map((it) => (
                    <div key={it.id} className="text-[11px]">
                      <div className="flex justify-between items-baseline gap-1">
                        <span className="font-bold text-slate-800">{it.title}</span>
                        <span className="text-slate-500 text-[10px]">{it.period}</span>
                      </div>
                      {it.subtitle && <p className="text-slate-600 text-[10px]">{it.subtitle}</p>}
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {(personal.nationality || personal.drivingLicense) && (
              <section className="text-[10px] text-slate-500 space-y-1">
                {personal.nationality && (
                  <p className="flex items-center gap-1.5">
                    <GlobeIcon className="w-3 h-3" aria-hidden /> {personal.nationality}
                  </p>
                )}
                {personal.drivingLicense && (
                  <p className="flex items-center gap-1.5">
                    <Car className="w-3 h-3" aria-hidden /> {personal.drivingLicense}
                  </p>
                )}
              </section>
            )}
          </aside>
        </div>

        {/* Executive Footer */}
        <footer className="px-8 py-3 border-t flex justify-between items-center text-[10px] text-white" style={{ backgroundColor: primaryBg }}>
          <span className="uppercase tracking-widest">{personal.qualities}</span>
          {personal.availability && <span className="font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: accentColor }}>{personal.availability}</span>}
        </footer>
      </div>
    );
  }

  /* ================= TEMPLATE 4: CREATIVE (Gradient header + playful chips) ================= */
  return (
    <div
      id="cv-preview-container"
      className={`cv-paper-container w-full bg-white text-slate-800 shadow-2xl rounded-lg overflow-hidden border border-slate-200 min-h-[297mm] flex flex-col ${getFontClass()}`}
    >
      {/* Creative gradient banner */}
      <header
        className="relative text-white px-8 pt-7 pb-16 overflow-hidden"
        style={{ background: `linear-gradient(120deg, ${primaryBg} 0%, ${accentColor} 100%)` }}
      >
        {/* decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" aria-hidden />
        <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-black/10" aria-hidden />

        <div className="relative flex items-center justify-between gap-4">
          <div>
            {personal.subTitle && (
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70 mb-1">{personal.subTitle}</p>
            )}
            <h1 className="text-3xl font-black uppercase tracking-tight text-white leading-tight drop-shadow">
              {personal.firstName} {personal.lastName}
            </h1>
            <h2 className="text-sm font-bold text-white/90 mt-1 inline-block bg-black/25 px-3 py-1 rounded-full">{personal.jobTitle}</h2>
          </div>
          {theme.showPhoto && (
            <img
              src={personal.photoUrl || defaultAvatarSvg}
              alt={isFr ? 'Photo de profil' : 'Profile photo'}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white/60 shadow-2xl bg-slate-800 rotate-3 shrink-0"
            />
          )}
        </div>
      </header>

      {/* Contact chips bar overlapping the banner */}
      <div className="px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] text-slate-700 font-medium">
          {personal.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" style={{ color: accentColor }} aria-hidden /> {personal.email}
            </span>
          )}
          {personal.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" style={{ color: accentColor }} aria-hidden /> {personal.phone}
            </span>
          )}
          {personal.address && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" style={{ color: accentColor }} aria-hidden /> {personal.address}
            </span>
          )}
          {personal.github && (
            <span className="flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5" style={{ color: accentColor }} aria-hidden /> {personal.github}
            </span>
          )}
          {personal.linkedin && (
            <span className="flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5" style={{ color: accentColor }} aria-hidden /> {personal.linkedin}
            </span>
          )}
        </div>
      </div>

      <div className={`px-8 py-6 space-y-5 flex-1 ${density.gap}`}>
        {personal.summary && (
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: accentColor }}>
              <span className="w-6 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} aria-hidden />
              {isFr ? 'À propos de moi' : 'About Me'}
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">{personal.summary}</p>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest mb-2.5 flex items-center gap-2" style={{ color: accentColor }}>
              <span className="w-6 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} aria-hidden />
              {isFr ? 'Toolbox & Compétences' : 'Toolbox & Skills'}
            </h3>
            <div className="space-y-2.5">
              {skills.map((s) => {
                const tags = s.tags.split(',').filter((t) => t.trim() !== '');
                return (
                  <div key={s.id}>
                    <p className="text-[11px] font-bold text-slate-800 mb-1">{s.category}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all"
                          style={{ color: accentColor, borderColor: `${accentColor}55`, backgroundColor: `${accentColor}0f` }}
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest mb-2.5 flex items-center gap-2" style={{ color: accentColor }}>
              <span className="w-6 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} aria-hidden />
              {isFr ? 'Projets & Expériences' : 'Projects & Experience'}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {projects.map((p) => (
                <div key={p.id} className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/60 hover:bg-slate-50 transition-colors" style={{ borderLeft: `4px solid ${accentColor}` }}>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {p.title} {p.companyOrClient ? <span className="text-slate-500 font-medium">— {p.companyOrClient}</span> : null}
                      </h4>
                      {p.subtitle && <p className="text-[10px] italic text-slate-500">{p.subtitle}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <ProjectDates p={p} fr={isFr} />
                      {p.tag && (
                        <span className="text-[9px] font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: primaryBg }}>
                          {p.tag}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed mt-1">{p.desc}</p>
                  <Bullets items={p.bullets} />
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest mb-2.5 flex items-center gap-2" style={{ color: accentColor }}>
              <span className="w-6 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} aria-hidden />
              {isFr ? 'Parcours Académique' : 'Education'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {education.map((e) => (
                <div key={e.id} className="rounded-xl border p-3" style={{ borderColor: `${accentColor}44`, backgroundColor: `${accentColor}08` }}>
                  <h4 className="text-[11px] font-bold text-slate-900 leading-snug">{e.degree}</h4>
                  <p className="text-[10px] text-slate-600 mt-0.5">{e.school}</p>
                  {e.details && <p className="text-[9px] text-slate-500 italic mt-0.5">{e.details}</p>}
                  <p className="text-[9px] font-bold mt-1" style={{ color: accentColor }}>
                    {e.period}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {customSections.map((sec) => (
          <section key={sec.id}>
            <h3 className="text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: accentColor }}>
              <span className="w-6 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} aria-hidden />
              {sec.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {sec.items.map((it) => (
                <div key={it.id} className="text-[10px] bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <span className="font-bold text-slate-800 block">{it.title}</span>
                  <span className="text-slate-500">
                    {it.subtitle} {it.period ? `• ${it.period}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}

        {languages.length > 0 && (
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: accentColor }}>
              <span className="w-6 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} aria-hidden />
              {isFr ? 'Langues' : 'Languages'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((l) => (
                <span key={l.id} className="text-[10px] rounded-full px-3 py-1.5 font-semibold text-white" style={{ backgroundColor: primaryBg }}>
                  {l.name} · <span className="font-normal opacity-85">{l.level}</span>
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Creative footer */}
      <footer className="px-8 py-3 text-white flex justify-between items-center gap-2 text-[10px]" style={{ background: `linear-gradient(120deg, ${accentColor} 0%, ${primaryBg} 100%)` }}>
        <span className="font-medium">{personal.qualities}</span>
        {personal.availability && <span className="font-bold bg-white/20 px-2.5 py-0.5 rounded-full">{personal.availability}</span>}
      </footer>
    </div>
  );
};
