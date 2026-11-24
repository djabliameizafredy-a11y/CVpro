'use client';
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Pencil, Plus, Trash2, Download } from 'lucide-react';
import { CVData, TemplateStyle } from '@/lib/cv/types';
import { exportToImage, exportToPdf } from '@/lib/cv/exportHelpers';
import { emptyCVState } from '@/lib/cv/sampleCV';

type Draft = Record<string, string>;
type Field = { id: string; label: string; type?: 'text' | 'area' | 'select' | 'month' | 'file' | 'end'; opt?: boolean; options?: string[]; why?: string; ph?: string; check?: (v: string, d: Draft) => string };
type Step = { title: string; msg: string; fields: Field[]; list?: 'exp' | 'edu' | 'proj' };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s().-]{7,20}$/;
const url = (v: string) => { if (!v) return ''; try { const u = new URL(/^https?:\/\//.test(v) ? v : 'https://' + v); return u.hostname.includes('.') ? '' : 'Lien invalide'; } catch { return 'Lien invalide. Exemple : github.com/nom'; } };
const mm = (v: string) => (v && /^\d{4}-\d{2}$/.test(v) ? `${v.slice(5)}/${v.slice(0, 4)}` : v);
const endCheck = (v: string, d: Draft) => (v && v !== 'now' && d.start && v < d.start ? 'La date de fin est antérieure à la date de début.' : '');
const uid = () => Math.random().toString(36).slice(2, 9);

const STEPS: Step[] = [
  { title: 'Informations personnelles', msg: 'Commençons par vos coordonnées.', fields: [
    { id: 'name', label: 'Nom complet', why: 'Le nom est indispensable pour identifier le CV.', check: (v) => (v.trim().length < 2 ? 'Le nom est obligatoire.' : '') },
    { id: 'label', label: 'Titre ou poste recherché', ph: 'Ex : Développeur web', opt: true },
    { id: 'phone', label: 'Téléphone', ph: '+228 90 00 00 00', opt: true, check: (v, d) => (!v && !d.email ? 'Indiquez au moins un téléphone ou un e-mail.' : v && !PHONE.test(v) ? 'Numéro invalide.' : '') },
    { id: 'email', label: 'E-mail', opt: true, check: (v, d) => (!v && !d.phone ? 'Indiquez au moins un e-mail ou un téléphone.' : v && !EMAIL.test(v) ? 'Adresse e-mail invalide.' : '') },
    { id: 'city', label: 'Ville / pays', ph: 'Lomé, Togo', opt: true },
    { id: 'linkedin', label: 'Lien LinkedIn (optionnel)', opt: true, check: url },
    { id: 'web', label: 'Lien portfolio ou GitHub (optionnel)', opt: true, check: url },
    { id: 'photo', label: 'Photo de profil (optionnelle)', type: 'file', opt: true } ] },
  { title: 'Profil professionnel', msg: 'Présentez-vous en quelques lignes.', fields: [
    { id: 'summary', label: 'Résumé professionnel', type: 'area', opt: true },
    { id: 'years', label: "Années d'expérience", opt: true, check: (v) => (v && !/^\d{1,2}$/.test(v) ? 'Indiquez un nombre.' : '') },
    { id: 'level', label: "Niveau d'expérience", type: 'select', options: ['Débutant', 'Junior', 'Intermédiaire', 'Senior'], opt: true },
    { id: 'domain', label: "Domaine d'activité", opt: true } ] },
  { title: 'Expériences professionnelles', msg: 'Ajoutons une expérience.', list: 'exp', fields: [
    { id: 'company', label: "Nom de l'entreprise", why: "L'entreprise est nécessaire.", check: (v) => (v.trim() ? '' : "Nom de l'entreprise requis.") },
    { id: 'role', label: 'Poste occupé', check: (v) => (v.trim() ? '' : 'Poste requis.') },
    { id: 'place', label: 'Ville / pays', opt: true },
    { id: 'start', label: 'Date de début', type: 'month', check: (v) => (v ? '' : 'Date de début requise.') },
    { id: 'end', label: 'Date de fin', type: 'end', check: endCheck },
    { id: 'desc', label: 'Description des missions', type: 'area', check: (v) => (v.trim() ? '' : 'Décrivez brièvement vos missions.') },
    { id: 'result', label: 'Réalisations ou résultats (optionnel)', type: 'area', opt: true } ] },
  { title: 'Formations', msg: 'Ajoutons une formation.', list: 'edu', fields: [
    { id: 'degree', label: 'Diplôme ou certification', check: (v) => (v.trim() ? '' : 'Diplôme requis.') },
    { id: 'school', label: 'École / université', check: (v) => (v.trim() ? '' : 'Établissement requis.') },
    { id: 'place', label: 'Ville / pays', opt: true },
    { id: 'start', label: 'Date de début', type: 'month', check: (v) => (v ? '' : 'Date de début requise.') },
    { id: 'end', label: 'Date de fin', type: 'end', check: endCheck },
    { id: 'mention', label: 'Mention ou spécialité (optionnel)', opt: true } ] },
  { title: 'Compétences', msg: 'Séparez les éléments par des virgules.', fields: [
    { id: 'tech', label: 'Compétences techniques', opt: true }, { id: 'soft', label: 'Compétences logicielles', opt: true },
    { id: 'langs', label: 'Langues et niveau', ph: 'Français : Courant, Anglais : B2', opt: true },
    { id: 'skills', label: 'Soft skills', opt: true } ] },
  { title: 'Projets / portfolio', msg: 'Un projet à mettre en avant ? (optionnel)', list: 'proj', fields: [
    { id: 'name', label: 'Nom du projet', check: (v) => (v.trim() ? '' : 'Nom requis.') },
    { id: 'link', label: 'Lien du projet', opt: true, check: url },
    { id: 'desc', label: 'Description', type: 'area', opt: true },
    { id: 'tech', label: 'Technologies utilisées', opt: true },
    { id: 'role', label: 'Votre rôle', opt: true } ] },
  { title: "Centres d'intérêt", msg: 'Vos loisirs, séparés par des virgules. (optionnel)', fields: [{ id: 'hobbies', label: "Centres d'intérêt", opt: true }] },
  { title: 'Modèle et vérification', msg: 'Choisissez le modèle, vérifiez, puis exportez.', fields: [] },
];
const TPL: [TemplateStyle, string][] = [['modern', 'Moderne'], ['minimalist', 'Minimaliste'], ['executive', 'Professionnel'], ['creative', 'Créatif']];

const csv = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);
const cat = (cv: CVData, id: string, category: string, tags: string): CVData => ({ ...cv, skills: [...cv.skills.filter((s) => s.id !== id), ...(tags ? [{ id, category, tags }] : [])] });
const section = (cv: CVData, id: string, title: string, items: { id: string; title: string; subtitle?: string; description?: string }[]): CVData => ({ ...cv, customSections: [...cv.customSections.filter((s) => s.id !== id), ...(items.length ? [{ id, title, items }] : [])] });

function apply(cv: CVData, si: number, d: Draft): CVData {
  const p = cv.personal;
  if (si === 0) { const [f, ...r] = (d.name || '').trim().split(/\s+/); return { ...cv, personal: { ...p, firstName: f || '', lastName: r.join(' '), jobTitle: d.label || '', phone: d.phone || '', email: d.email || '', address: d.city || '', linkedin: d.linkedin || '', github: d.web || '', photoUrl: d.photo || p.photoUrl } }; }
  if (si === 1) return { ...cv, personal: { ...p, summary: d.summary || '', subTitle: [d.domain, d.level, d.years ? `${d.years} an(s) d'expérience` : ''].filter(Boolean).join(' · ') } };
  if (si === 4) { let n = cat(cv, 'g-tech', 'Compétences techniques', d.tech || ''); n = cat(n, 'g-soft', 'Logiciels', d.soft || ''); n = cat(n, 'g-skills', 'Soft skills', d.skills || '');
    return { ...n, languages: csv(d.langs || '').map((x) => { const [a, b] = x.split(':'); return { id: uid(), name: a.trim(), level: (b || '').trim() }; }) }; }
  if (si === 6) return section(cv, 'g-hobbies', "Centres d'intérêt", csv(d.hobbies || '').map((t) => ({ id: uid(), title: t })));
  return cv;
}
const fromCv = (cv: CVData, si: number): Draft => { const p = cv.personal; const t = (id: string) => cv.skills.find((s) => s.id === id)?.tags || '';
  if (si === 0) return { name: `${p.firstName} ${p.lastName}`.trim(), label: p.jobTitle, phone: p.phone, email: p.email, city: p.address, linkedin: p.linkedin || '', web: p.github, photo: p.photoUrl };
  if (si === 1) return { summary: p.summary };
  if (si === 4) return { tech: t('g-tech'), soft: t('g-soft'), skills: t('g-skills'), langs: cv.languages.map((l) => `${l.name} : ${l.level}`).join(', ') };
  if (si === 6) return { hobbies: (cv.customSections.find((s) => s.id === 'g-hobbies')?.items || []).map((i) => i.title).join(', ') };
  return {}; };

interface Props { cv: CVData; onChange: (u: (c: CVData) => CVData) => void; isDarkMode: boolean; onClear: () => void }
const KEY = 'cv_guided_step_v1';
const readStep = () => { try { const n = Number(localStorage.getItem(KEY)); return n > 0 && n < STEPS.length ? n : 0; } catch { return 0; } };

export const GuidedAssistant: React.FC<Props> = ({ cv, onChange, isDarkMode: dk, onClear }) => {
  const [si, setSi] = useState(readStep); const [fi, setFi] = useState(0);
  const [d, setD] = useState<Draft>({}); const [err, setErr] = useState(''); const [adding, setAdding] = useState(() => readStep() === 0);
  const [editId, setEditId] = useState<string | null>(null); const [fname, setFname] = useState('Mon_CV'); const [busy, setBusy] = useState(false);
  const step = STEPS[si]; const fld = step.fields[fi];
  const cur = (): Draft => (step.list ? d : { ...fromCv(cv, si), ...d });
  const items = step.list === 'exp' ? cv.projects : step.list === 'edu' ? cv.education : step.list === 'proj' ? (cv.customSections.find((s) => s.id === 'g-proj')?.items || []) : [];
  const go = (s: number, f = 0) => { setSi(s); setFi(f); setErr(''); try { localStorage.setItem(KEY, String(s)); } catch {}
    const st = STEPS[s]; const n = st.list === 'exp' ? cv.projects.length : st.list === 'edu' ? cv.education.length : st.list === 'proj' ? (cv.customSections.find((x) => x.id === 'g-proj')?.items.length ?? 0) : 0; setEditId(null); setAdding(!!st.list && n === 0); setD({}); };

  const input = `w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40 ${dk ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'}`;
  const btn = (p: boolean) => `px-4 py-2 rounded-lg text-sm font-medium transition inline-flex items-center gap-1.5 disabled:opacity-40 ${p ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : dk ? 'border border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border border-zinc-300 text-zinc-700 hover:bg-zinc-100'}`;
  const bubble = `rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[90%] ${dk ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-100 text-zinc-800'}`;

  const saveItem = () => {
    const id = editId || uid(); const endNow = d.end === 'now'; const period = [mm(d.start), endNow ? (step.list === 'edu' ? 'En cours' : 'Actuellement') : mm(d.end || '')].filter(Boolean).join(' – ');
    onChange((c) => {
      if (step.list === 'exp') { const it = { id, title: d.role, companyOrClient: d.company, location: d.place, startDate: mm(d.start), endDate: endNow ? '' : mm(d.end || ''), isCurrent: endNow, desc: d.desc, bullets: d.result ? [d.result] : [] }; return { ...c, projects: editId ? c.projects.map((x) => (x.id === id ? it : x)) : [...c.projects, it] }; }
      if (step.list === 'edu') { const it = { id, degree: d.degree, school: d.school, location: d.place, details: d.mention, period }; return { ...c, education: editId ? c.education.map((x) => (x.id === id ? it : x)) : [...c.education, it] }; }
      const it = { id, title: d.name, subtitle: [d.tech, d.role].filter(Boolean).join(' · '), description: [d.desc, d.link].filter(Boolean).join(' — ') }; const cur = c.customSections.find((s) => s.id === 'g-proj')?.items || [];
      return section(c, 'g-proj', 'Projets', editId ? cur.map((x) => (x.id === id ? it : x)) : [...cur, it]); });
    setD({}); setFi(0); setEditId(null); setAdding(false); };
  const editItem = (it: any) => { setEditId(it.id); setFi(0); setAdding(true);
    if (step.list === 'exp') setD({ company: it.companyOrClient || '', role: it.title, place: it.location || '', start: '', end: it.isCurrent ? 'now' : '', desc: it.desc, result: it.bullets?.[0] || '' });
    else if (step.list === 'edu') setD({ degree: it.degree, school: it.school, place: it.location || '', mention: it.details || '', start: '', end: '' });
    else setD({ name: it.title, tech: '', desc: it.description || '' }); };
  const delItem = (id: string) => onChange((c) => step.list === 'exp' ? { ...c, projects: c.projects.filter((x) => x.id !== id) } : step.list === 'edu' ? { ...c, education: c.education.filter((x) => x.id !== id) } : section(c, 'g-proj', 'Projets', (c.customSections.find((s) => s.id === 'g-proj')?.items || []).filter((x) => x.id !== id)));

  const next = (skip = false) => {
    const dd = cur(); const v = skip ? '' : dd[fld.id] || '';
    const e = fld.check ? fld.check(v, dd) : '';
    if (skip && !fld.opt) return setErr(fld.why || 'Ce champ est obligatoire.');
    if (e) return setErr(e);
    setD((x) => ({ ...x, [fld.id]: v }));
    setErr('');
    if (fi < step.fields.length - 1) return setFi(fi + 1);
    if (step.list) return saveItem();
    onChange((c) => apply(c, si, { ...dd, [fld.id]: v })); go(si + 1);
  };
  const live = (id: string, v: string) => { setErr(''); setD((x) => ({ ...x, [id]: v })); if (!step.list) onChange((c) => apply(c, si, { ...fromCv(c, si), ...d, [id]: v })); };
  const exp = async (k: 'pdf' | 'png') => { setBusy(true); try { if (k === 'pdf') await exportToPdf('cv-preview-container', fname || 'CV'); else await exportToImage('cv-preview-container', fname || 'CV', 'png'); } finally { setBusy(false); } };

  const total = STEPS.length; const showForm = !step.list || adding;
  return (
    <div className={`flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-4 ${dk ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-zinc-900'}`}>
      <div>
        <div className="flex justify-between text-xs mb-1.5"><span className="font-semibold">Étape {si + 1} sur {total} — {step.title}</span><span className={dk ? 'text-zinc-400' : 'text-zinc-500'}>{Math.round(((si + 1) / total) * 100)} %</span></div>
        <div className={`h-1.5 rounded-full ${dk ? 'bg-zinc-800' : 'bg-zinc-200'}`}><div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${((si + 1) / total) * 100}%` }} /></div>
      </div>

      <div className={bubble}>{step.list && !adding ? (items.length ? 'Voici ce que vous avez déjà ajouté. Vous pouvez modifier, supprimer ou en ajouter une autre.' : 'Rien d\'ajouté pour le moment.') : step.msg}</div>
      {si === 0 && fi === 0 && <button className={`text-xs underline ${dk ? 'text-zinc-400' : 'text-zinc-500'}`} onClick={() => { onChange((c) => ({ ...emptyCVState, lang: c.lang, theme: c.theme })); setD({}); try { localStorage.removeItem(KEY); } catch {} }}>Commencer avec un CV vide (effacer l'exemple)</button>}
      {si > 0 && !step.list && fi === 0 && <div className="flex justify-end"><div className="rounded-2xl rounded-tr-sm px-4 py-2 text-sm bg-emerald-600 text-white">Réponses enregistrées à l'étape précédente</div></div>}

      {step.list && items.length > 0 && !adding && (
        <ul className="space-y-2">{items.map((it: any) => (
          <li key={it.id} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${dk ? 'border-zinc-700' : 'border-zinc-200'}`}>
            <span className="flex-1 truncate">{it.title || it.degree || it.name}<span className={`block text-xs ${dk ? 'text-zinc-400' : 'text-zinc-500'}`}>{it.companyOrClient || it.school || it.subtitle}</span></span>
            <button className="p-1.5" aria-label="Modifier" onClick={() => editItem(it)}><Pencil className="w-4 h-4" /></button>
            <button className="p-1.5 text-rose-500" aria-label="Supprimer" onClick={() => confirm('Supprimer cet élément ?') && delItem(it.id)}><Trash2 className="w-4 h-4" /></button></li>))}</ul>)}

      {showForm && fld && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">{fld.label}{!fld.opt && <span className="text-rose-500"> *</span>}</label>
          {fld.type === 'area' ? <textarea rows={4} className={input} value={cur()[fld.id] || ''} onChange={(e) => live(fld.id, e.target.value)} />
            : fld.type === 'select' ? <div className="flex flex-wrap gap-2">{fld.options!.map((o) => <button key={o} onClick={() => live(fld.id, o)} className={`px-3 py-1.5 rounded-lg text-sm border ${cur()[fld.id] === o ? 'bg-emerald-600 text-white border-emerald-600' : dk ? 'border-zinc-700' : 'border-zinc-300'}`}>{o}</button>)}</div>
            : fld.type === 'file' ? <input type="file" accept="image/*" className="text-sm" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => live('photo', String(r.result)); r.readAsDataURL(f); }} />
            : fld.type === 'end' ? <div className="flex flex-wrap gap-2 items-center"><input type="month" className={input + ' !w-auto'} disabled={d.end === 'now'} value={d.end === 'now' ? '' : d.end || ''} onChange={(e) => live('end', e.target.value)} />
              <button onClick={() => live('end', d.end === 'now' ? '' : 'now')} className={`px-3 py-2 rounded-lg text-sm border ${d.end === 'now' ? 'bg-emerald-600 text-white border-emerald-600' : dk ? 'border-zinc-700' : 'border-zinc-300'}`}>{step.list === 'edu' ? 'En cours' : 'Actuellement'}</button></div>
            : <input type={fld.type === 'month' ? 'month' : 'text'} placeholder={fld.ph} className={input} value={cur()[fld.id] || ''} onChange={(e) => live(fld.id, e.target.value)} onKeyDown={(e) => e.key === 'Enter' && next()} />}
          {err && <p className="text-xs text-rose-500" role="alert">{err}</p>}
          <div className="flex flex-wrap gap-2 pt-1">
            <button className={btn(false)} disabled={si === 0 && fi === 0} onClick={() => (fi > 0 ? (setFi(fi - 1), setErr('')) : step.list && items.length ? setAdding(false) : go(si - 1))}><ArrowLeft className="w-4 h-4" />Retour</button>
            {step.list && fi === 0 && !editId && items.length === 0 && <button className={btn(false)} onClick={() => { setErr(''); setAdding(false); }}>Passer la section</button>}
            {fld.opt && fld.type !== 'select' && <button className={btn(false)} onClick={() => next(true)}>Passer</button>}
            <button className={btn(true)} onClick={() => next()}>{fi === step.fields.length - 1 && step.list ? (editId ? 'Enregistrer' : "Valider l'élément") : 'Continuer'}<ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>)}

      {step.list && !adding && (
        <div className="flex flex-wrap gap-2">
          <button className={btn(false)} onClick={() => go(si - 1)}><ArrowLeft className="w-4 h-4" />Retour</button>
          <button className={btn(false)} onClick={() => { setD({}); setFi(0); setAdding(true); }}><Plus className="w-4 h-4" />{step.list === 'exp' ? 'Ajouter une expérience' : step.list === 'edu' ? 'Ajouter une formation' : 'Ajouter un projet'}</button>
          <button className={btn(true)} onClick={() => go(si + 1)}>{items.length ? 'Continuer' : 'Passer'}<ArrowRight className="w-4 h-4" /></button></div>)}

      {si === total - 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">{TPL.map(([k, l]) => <button key={k} onClick={() => onChange((c) => ({ ...c, theme: { ...c.theme, template: k } }))} className={`px-3 py-2 rounded-lg text-sm border ${cv.theme.template === k ? 'bg-emerald-600 text-white border-emerald-600' : dk ? 'border-zinc-700' : 'border-zinc-300'}`}>{l}</button>)}</div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!cv.theme.showPhoto} onChange={(e) => onChange((c) => ({ ...c, theme: { ...c.theme, showPhoto: e.target.checked } }))} />Afficher la photo</label>
          <div className={`rounded-lg border p-3 text-sm space-y-1.5 ${dk ? 'border-zinc-700' : 'border-zinc-200'}`}>
            {[['Informations personnelles', `${cv.personal.firstName} ${cv.personal.lastName} · ${cv.personal.email || cv.personal.phone}`, 0], ['Profil', cv.personal.summary ? 'Résumé renseigné' : 'Non renseigné', 1], ['Expériences', `${cv.projects.length}`, 2], ['Formations', `${cv.education.length}`, 3], ['Compétences', `${cv.skills.length} catégorie(s), ${cv.languages.length} langue(s)`, 4], ['Projets', `${items.length || (cv.customSections.find((s) => s.id === 'g-proj')?.items.length ?? 0)}`, 5], ["Centres d'intérêt", fromCv(cv, 6).hobbies || 'Aucun', 6]].map(([t, v, s]) => (
              <div key={String(t)} className="flex items-center justify-between gap-2"><span><b>{t}</b> <span className={dk ? 'text-zinc-400' : 'text-zinc-500'}>{v}</span></span><button className="text-emerald-500 text-xs" onClick={() => go(Number(s))}>Modifier</button></div>))}
            {!cv.projects.length && !cv.education.length && <p className="text-xs text-amber-500">Conseil : ajoutez au moins une expérience ou une formation.</p>}
          </div>
          <label className="block text-sm font-medium">Nom du fichier<input className={input + ' mt-1'} value={fname} onChange={(e) => setFname(e.target.value.replace(/[^\w\- ]/g, ''))} /></label>
          <div className="flex flex-wrap gap-2"><button className={btn(true)} disabled={busy} onClick={() => exp('pdf')}><Download className="w-4 h-4" />Exporter en PDF</button><button className={btn(false)} disabled={busy} onClick={() => exp('png')}><Download className="w-4 h-4" />Exporter en PNG</button><button className={btn(false)} onClick={() => go(si - 1)}><ArrowLeft className="w-4 h-4" />Retour</button></div>
          <button className="text-xs text-rose-500 underline" onClick={onClear}>Effacer toutes les données</button>
        </div>)}
      <p className={`text-[11px] ${dk ? 'text-zinc-500' : 'text-zinc-400'}`}><Check className="inline w-3 h-3" /> Enregistrement automatique sur cet appareil. Aucune donnée n'est envoyée ailleurs.</p>
    </div>
  );
};
