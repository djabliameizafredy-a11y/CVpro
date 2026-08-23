export type TemplateStyle = 'modern' | 'minimalist' | 'executive' | 'creative';
export type FontStyle = 'sans' | 'serif' | 'mono' | 'display';
export type SpacingDensity = 'compact' | 'normal' | 'spacious';

export interface SkillCategory {
  id: string;
  category: string;
  tags: string; // comma separated or tags array
}

export interface ProjectItem {
  id: string;
  title: string;
  companyOrClient?: string;
  subtitle?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  tag?: string;
  desc: string;
  bullets?: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location?: string;
  details?: string;
  period: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string; // e.g. "Courant", "Maternelle", "B2", "Notions"
}

export interface CustomItem {
  id: string;
  title: string;
  subtitle?: string;
  period?: string;
  description?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomItem[];
}

export interface ThemeConfig {
  template: TemplateStyle;
  primaryColor: string;
  accentColor: string;
  fontFamily: FontStyle;
  density: SpacingDensity;
  showPhoto: boolean;
  showIcons: boolean;
  paperSize: 'A4' | 'Letter';
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  jobTitle: string;
  subTitle: string;
  nationality: string;
  drivingLicense?: string;
  photoUrl: string;
  address: string;
  phone: string;
  email: string;
  github: string;
  linkedin?: string;
  website?: string;
  summary: string;
  qualities: string;
  availability: string;
}

export interface CVData {
  lang: 'fr' | 'en';
  personal: PersonalInfo;
  skills: SkillCategory[];
  projects: ProjectItem[];
  education: EducationItem[];
  languages: LanguageItem[];
  customSections: CustomSection[];
  theme: ThemeConfig;
}

export interface SavedCvMeta {
  id: string;
  name: string;
  lang: string;
  updatedAt: string;
  createdAt: string;
}
