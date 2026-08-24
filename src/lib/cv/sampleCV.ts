import { CVData } from './types';

export const sampleCVFr: CVData = {
  lang: 'fr',
  personal: {
    firstName: 'Alexandre',
    lastName: 'KOFFI',
    jobTitle: 'Développeur Full-Stack & Mobile',
    subTitle: 'Spécialiste React, Node.js & Mobile Native',
    nationality: 'Togolaise',
    drivingLicense: 'Permis B',
    photoUrl: '',
    address: 'Lomé, Togo',
    phone: '+228 90 12 34 56',
    email: 'alex.koffi@example.com',
    github: 'github.com/alex-koffi',
    linkedin: 'linkedin.com/in/alex-koffi',
    website: 'alexkoffi.dev',
    summary: 'Développeur Full-Stack passionné avec plus de 4 ans d\'expérience dans la conception d\'applications web et mobiles haute performance. Spécialisé dans l\'écosystème React/Next.js et Node.js, je privilégie le code propre, l\'optimisation UX et la scalabilité des systèmes.',
    qualities: 'Rigueur, Esprit d\'équipe, Autonomie, Agilité, Résolution de problèmes',
    availability: 'Disponible immédiatement pour CDI / Stage'
  },
  skills: [
    { id: '1', category: 'Développement Web', tags: 'React 19, Next.js, TypeScript, Tailwind CSS, Redux, REST API, GraphQL' },
    { id: '2', category: 'Mobile & Multi-plateforme', tags: 'Kotlin, Jetpack Compose, React Native, Android Studio, iOS' },
    { id: '3', category: 'Back-End & Cloud', tags: 'Node.js, Express, PostgreSQL, MongoDB, Firebase, Docker, CI/CD' },
    { id: '4', category: 'Outils & Méthodes', tags: 'Git, GitHub Actions, Jest, Figma, Agile / Scrum, Vite' }
  ],
  projects: [
    {
      id: 'p1',
      title: 'Marketplace Mobile Géolocalisée',
      companyOrClient: 'TechPro Solutions',
      subtitle: 'Application e-commerce temps réel',
      location: 'Lomé',
      startDate: '2024',
      endDate: '2025',
      isCurrent: false,
      tag: 'Android / Kotlin',
      desc: 'Conception et déploiement d\'une application mobile complète de mise en relation acheteurs-vendeurs locaux avec géolocalisation et paiement sécurisé.',
      bullets: [
        'Mise en place d\'un système de géolocalisation temps réel pour les livreurs',
        'Intégration de Mobile Money (Flooz & T-Money) pour des transactions instantanées',
        'Réduction du temps de chargement des catalogues de 40% via le caching local'
      ]
    },
    {
      id: 'p2',
      title: 'Plateforme SaaS de Visioconférence',
      companyOrClient: 'Innov\'Afrique',
      subtitle: 'Outil de communication d\'entreprise',
      location: 'En ligne',
      startDate: '2023',
      endDate: '2024',
      isCurrent: false,
      tag: 'WebRTC / React',
      desc: 'Développement du front-end d\'une plateforme de visioconférence WebRTC haute définition supportant jusqu\'à 50 participants simultanés.',
      bullets: [
        'Implémentation du partage d\'écran, du chat interactif et du tableau blanc collaboratif',
        'Optimisation de la consommation de bande passante sur réseaux mobiles à faible débit'
      ]
    }
  ],
  education: [
    {
      id: 'e1',
      degree: 'Master en Génie Logiciel & Systèmes d\'Information',
      school: 'Université de Lomé',
      location: 'Togo',
      details: 'Mention Très Bien — Spécialité Architecture Systèmes Web & Sécurité',
      period: '2023 - 2025'
    },
    {
      id: 'e2',
      degree: 'Licence en Informatique de Gestion',
      school: 'Institut Supérieur de Technologie',
      location: 'Togo',
      details: 'Major de promotion — Projets d\'études axés sur les bases de données relationnelles',
      period: '2020 - 2023'
    }
  ],
  languages: [
    { id: 'l1', name: 'Français', level: 'Langue maternelle / Courant' },
    { id: 'l2', name: 'Anglais', level: 'Professionnel (B2 / C1 - Technique)' },
    { id: 'l3', name: 'Éwé / Kabyè', level: 'Langues locales' }
  ],
  customSections: [
    {
      id: 'cs1',
      title: 'Certifications',
      items: [
        { id: 'ci1', title: 'AWS Certified Developer - Associate', subtitle: 'Amazon Web Services', period: '2024' },
        { id: 'ci2', title: 'Meta Front-End Developer Professional Certificate', subtitle: 'Coursera', period: '2023' }
      ]
    }
  ],
  theme: {
    template: 'modern',
    primaryColor: '#0f172a',
    accentColor: '#0284c7',
    fontFamily: 'sans',
    density: 'normal',
    showPhoto: true,
    showIcons: true,
    paperSize: 'A4'
  }
};

export const sampleCVEn: CVData = {
  lang: 'en',
  personal: {
    firstName: 'Alexandre',
    lastName: 'KOFFI',
    jobTitle: 'Full-Stack & Mobile Developer',
    subTitle: 'React, Node.js & Native Mobile Specialist',
    nationality: 'Togolese',
    drivingLicense: 'Driver License',
    photoUrl: '',
    address: 'Lomé, Togo',
    phone: '+228 90 12 34 56',
    email: 'alex.koffi@example.com',
    github: 'github.com/alex-koffi',
    linkedin: 'linkedin.com/in/alex-koffi',
    website: 'alexkoffi.dev',
    summary: 'Passionate Full-Stack Developer with 4+ years of experience building high-performance web and mobile applications. Specialized in the React/Next.js and Node.js ecosystems, emphasizing clean code, intuitive UX, and scalable architecture.',
    qualities: 'Rigor, Team Spirit, Autonomy, Agility, Problem Solving',
    availability: 'Available immediately for full-time / contract roles'
  },
  skills: [
    { id: '1', category: 'Web Development', tags: 'React 19, Next.js, TypeScript, Tailwind CSS, Redux, REST APIs, GraphQL' },
    { id: '2', category: 'Mobile & Cross-Platform', tags: 'Kotlin, Jetpack Compose, React Native, Android Studio, iOS' },
    { id: '3', category: 'Back-End & Cloud', tags: 'Node.js, Express, PostgreSQL, MongoDB, Firebase, Docker, CI/CD' },
    { id: '4', category: 'Tools & Workflows', tags: 'Git, GitHub Actions, Jest, Figma, Agile / Scrum, Vite' }
  ],
  projects: [
    {
      id: 'p1',
      title: 'Geolocalized Mobile Marketplace',
      companyOrClient: 'TechPro Solutions',
      subtitle: 'Real-time e-commerce app',
      location: 'Lomé',
      startDate: '2024',
      endDate: '2025',
      isCurrent: false,
      tag: 'Android / Kotlin',
      desc: 'Designed and launched a full mobile app connecting local buyers and sellers with real-time location tracking and secure mobile payments.',
      bullets: [
        'Built real-time GPS tracking for delivery drivers',
        'Integrated Mobile Money (Flooz & T-Money) for instant checkout',
        'Reduced catalog load times by 40% through intelligent client-side caching'
      ]
    },
    {
      id: 'p2',
      title: 'SaaS Video Conferencing Platform',
      companyOrClient: 'Innov\'Afrique',
      subtitle: 'Enterprise communications tool',
      location: 'Remote',
      startDate: '2023',
      endDate: '2024',
      isCurrent: false,
      tag: 'WebRTC / React',
      desc: 'Developed the frontend for a WebRTC high-definition video conferencing platform supporting up to 50 concurrent participants.',
      bullets: [
        'Implemented screen sharing, interactive live chat, and collaborative whiteboard',
        'Optimized bandwidth usage for low-speed mobile networks'
      ]
    }
  ],
  education: [
    {
      id: 'e1',
      degree: 'Master of Science in Software Engineering',
      school: 'University of Lomé',
      location: 'Togo',
      details: 'With Honors — Specialization in Web System Architecture & Security',
      period: '2023 - 2025'
    },
    {
      id: 'e2',
      degree: 'Bachelor of Science in Computer Science',
      school: 'Higher Institute of Technology',
      location: 'Togo',
      details: 'Valedictorian — Capstone projects focused on relational databases',
      period: '2020 - 2023'
    }
  ],
  languages: [
    { id: 'l1', name: 'French', level: 'Native / Fluent' },
    { id: 'l2', name: 'English', level: 'Professional (B2 / C1 - Technical)' },
    { id: 'l3', name: 'Ewe / Kabiye', level: 'Local Languages' }
  ],
  customSections: [
    {
      id: 'cs1',
      title: 'Certifications',
      items: [
        { id: 'ci1', title: 'AWS Certified Developer - Associate', subtitle: 'Amazon Web Services', period: '2024' },
        { id: 'ci2', title: 'Meta Front-End Developer Professional Certificate', subtitle: 'Coursera', period: '2023' }
      ]
    }
  ],
  theme: {
    template: 'modern',
    primaryColor: '#0f172a',
    accentColor: '#0284c7',
    fontFamily: 'sans',
    density: 'normal',
    showPhoto: true,
    showIcons: true,
    paperSize: 'A4'
  }
};

export const emptyCVState: CVData = {
  lang: 'fr',
  personal: {
    firstName: '',
    lastName: '',
    jobTitle: '',
    subTitle: '',
    nationality: '',
    drivingLicense: '',
    photoUrl: '',
    address: '',
    phone: '',
    email: '',
    github: '',
    linkedin: '',
    website: '',
    summary: '',
    qualities: '',
    availability: ''
  },
  skills: [],
  projects: [],
  education: [],
  languages: [],
  customSections: [],
  theme: {
    template: 'modern',
    primaryColor: '#0f172a',
    accentColor: '#0284c7',
    fontFamily: 'sans',
    density: 'normal',
    showPhoto: true,
    showIcons: true,
    paperSize: 'A4'
  }
};
