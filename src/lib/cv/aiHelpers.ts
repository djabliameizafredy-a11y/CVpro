import { CVData } from './types';

export interface AtsCheckResult {
  score: number; // 0 to 100
  level: 'excellent' | 'good' | 'average' | 'needs_work';
  checks: {
    id: string;
    label: string;
    passed: boolean;
    recommendation: string;
    points: number;
  }[];
}

export function evaluateAtsScore(cv: CVData): AtsCheckResult {
  const checks: AtsCheckResult['checks'] = [];

  // 1. Name & Contact Info
  const hasName = Boolean(cv.personal.firstName.trim() && cv.personal.lastName.trim());
  checks.push({
    id: 'contact_name',
    label: cv.lang === 'fr' ? 'Nom et prénom renseignés' : 'Full name specified',
    passed: hasName,
    recommendation: cv.lang === 'fr' 
      ? 'Ajoutez votre nom et votre prénom complets.' 
      : 'Provide your full first and last name.',
    points: 15
  });

  const hasEmailPhone = Boolean(cv.personal.email.trim() && cv.personal.phone.trim());
  checks.push({
    id: 'contact_details',
    label: cv.lang === 'fr' ? 'Email et téléphone valides' : 'Valid email and phone number',
    passed: hasEmailPhone,
    recommendation: cv.lang === 'fr'
      ? 'Assurez-vous de fournir un email professionnel et un numéro de téléphone joignable.'
      : 'Ensure you provide a professional email and reachable phone number.',
    points: 15
  });

  // 2. Job Title
  const hasJobTitle = Boolean(cv.personal.jobTitle.trim());
  checks.push({
    id: 'job_title',
    label: cv.lang === 'fr' ? 'Titre de poste clair' : 'Clear job title',
    passed: hasJobTitle,
    recommendation: cv.lang === 'fr'
      ? 'Indiquez un titre de poste explicite pour que les algorithmes de recrutement (ATS) catégorisent votre profil.'
      : 'Include a target job title so ATS algorithms can index your application correctly.',
    points: 15
  });

  // 3. Summary length
  const summaryWords = cv.personal.summary.trim().split(/\s+/).filter(Boolean).length;
  const hasGoodSummary = summaryWords >= 20;
  checks.push({
    id: 'summary_length',
    label: cv.lang === 'fr' ? 'Accroche / Profil professionnel (min. 20 mots)' : 'Professional summary (min. 20 words)',
    passed: hasGoodSummary,
    recommendation: cv.lang === 'fr'
      ? 'Rédigez un résumé professionnel d\'au moins 2 à 3 phrases (20-50 mots) résumant vos points forts.'
      : 'Write a 2-3 sentence summary (20-50 words) highlighting your core strengths.',
    points: 15
  });

  // 4. Skills count
  const totalSkillTags = cv.skills.reduce((acc, s) => {
    return acc + s.tags.split(',').filter(t => t.trim().length > 0).length;
  }, 0);
  const hasEnoughSkills = totalSkillTags >= 6;
  checks.push({
    id: 'skills_count',
    label: cv.lang === 'fr' ? 'Au moins 6 mots-clés de compétences' : 'At least 6 skill keywords',
    passed: hasEnoughSkills,
    recommendation: cv.lang === 'fr'
      ? 'Listez au moins 6 technologies, outils ou compétences clés pour matcher avec les fiches de poste.'
      : 'List at least 6 key tools or skills matching job descriptions.',
    points: 15
  });

  // 5. Projects or Experience
  const hasProjects = cv.projects.length >= 1;
  checks.push({
    id: 'projects_experience',
    label: cv.lang === 'fr' ? 'Au moins 1 expérience ou projet détaillé' : 'At least 1 project or experience',
    passed: hasProjects,
    recommendation: cv.lang === 'fr'
      ? 'Ajoutez au moins une expérience ou réalisation pertinente.'
      : 'Add at least one relevant work experience or project.',
    points: 15
  });

  // 6. Education
  const hasEducation = cv.education.length >= 1;
  checks.push({
    id: 'education_history',
    label: cv.lang === 'fr' ? 'Diplôme ou formation renseignée' : 'Education history included',
    passed: hasEducation,
    recommendation: cv.lang === 'fr'
      ? 'Mentionnez vos diplômes ou certifications professionnelles.'
      : 'Mention your degree, diploma, or certification background.',
    points: 10
  });

  const totalPoints = checks.reduce((sum, c) => sum + (c.passed ? c.points : 0), 0);

  let level: 'excellent' | 'good' | 'average' | 'needs_work' = 'needs_work';
  if (totalPoints >= 90) level = 'excellent';
  else if (totalPoints >= 75) level = 'good';
  else if (totalPoints >= 50) level = 'average';

  return {
    score: totalPoints,
    level,
    checks
  };
}

export const actionVerbsFr = [
  'Développé', 'Conçu', 'Implémenté', 'Optimisé', 'Déployé',
  'Dirigé', 'Géré', 'Automatisé', 'Restructuré', 'Lancé',
  'Collaboré', 'Rédigé', 'Coordonné', 'Analysé', 'Résolu'
];

export const actionVerbsEn = [
  'Engineered', 'Designed', 'Implemented', 'Optimized', 'Deployed',
  'Led', 'Managed', 'Automated', 'Architected', 'Launched',
  'Collaborated', 'Spearheaded', 'Coordinated', 'Analyzed', 'Resolved'
];
