export type MilestoneType = 'education' | 'work' | 'project' | 'certification'

export interface Milestone {
  id: string
  type: MilestoneType
  year: string
  title: string
  organization: string
  description: string
}

export const experience: Milestone[] = [
  {
    id: 'edu-1',
    type: 'education',
    year: '2020 – 2022',
    title: 'Senior Secondary Education (10+2)',
    organization: 'Tirumala Junior College, Katheru, Andhra Pradesh',
    description: 'Completed higher secondary schooling with 96.7%, building the foundation for engineering study.',
  },
  {
    id: 'edu-2',
    type: 'education',
    year: '2022 – 2026',
    title: 'B.E. in Computer Engineering',
    organization: 'Thapar Institute of Engineering and Technology, Patiala',
    description: 'CGPA 8.24/10. Coursework in Data Structures & Algorithms, OOP, Operating Systems, DBMS, and Computer Networks.',
  },
  {
    id: 'proj-1',
    type: 'project',
    year: 'Jan 2025',
    title: 'Movie Discovery App',
    organization: 'Personal project — React, TMDB API, Appwrite',
    description: 'Built a movie search platform with real-time TMDB results, a live trending-movies leaderboard powered by Appwrite-backed search analytics, and a fully responsive UI.',
  },
  {
    id: 'proj-2',
    type: 'project',
    year: 'Mar 2025',
    title: 'Plant Disease Detection (Deep Learning)',
    organization: 'Personal project — TensorFlow, Keras, ResNet101',
    description: 'Developed a ResNet101 transfer-learning model to classify diseases across four crop types, reaching over 98% classification accuracy on a curated, augmented leaf-image dataset.',
  },
  {
    id: 'proj-3',
    type: 'project',
    year: 'Jul 2025',
    title: 'Blogit — Full-Stack Blogging Platform',
    organization: 'Personal project — React, Node.js, Express, MongoDB',
    description: 'Built a JWT-authenticated blogging platform with full CRUD, Google Gemini-powered draft generation, ImageKit-based image delivery, and a Vercel CI deployment pipeline.',
  },
  {
    id: 'work-1',
    type: 'work',
    year: 'Feb 2026 – Jul 2026',
    title: 'Web Developer Intern',
    organization: 'Ellocent Labs IT Solutions Pvt. Ltd., Mohali, Punjab',
    description: 'Built features for Hiremii, an AI-powered ATS, including an AI-driven Talent Pool module, a bulk resume import system handling 5,000+ resumes per batch, and an audit-ready Activity Logs module — while resolving 50+ frontend bugs and cutting page load time by 25%.',
  },
  {
    id: 'cert-1',
    type: 'certification',
    year: '2024',
    title: 'Accelerating End-to-End Data Science',
    organization: 'NVIDIA',
    description: 'Covered end-to-end data science workflows accelerated with GPU computing.',
  },
  {
    id: 'cert-2',
    type: 'certification',
    year: '2024',
    title: 'Data Structures & Algorithms Mastery',
    organization: 'Vamsi Bhavani',
    description: 'In-depth coverage of core data structures, algorithm design, and problem-solving techniques.',
  },
  {
    id: 'cert-3',
    type: 'certification',
    year: '2023',
    title: 'Full Stack Web Development Program',
    organization: 'Amaravathi Institute',
    description: 'Hands-on training across frontend, backend, and database technologies for full-stack development.',
  },
]
