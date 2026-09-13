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
    id: 'work-1',
    type: 'work',
    year: 'Feb 2026 – Jul 2026',
    title: 'Web Developer Intern',
    organization: 'Ellocent Labs IT Solutions Pvt. Ltd., Mohali, Punjab',
    description: 'Built features for Hiremii, an AI-powered ATS, including an AI-driven Talent Pool module, a bulk resume import system handling 5,000+ resumes per batch, and an audit-ready Activity Logs module — while resolving 50+ frontend bugs and cutting page load time by 25%.',
  },
]
