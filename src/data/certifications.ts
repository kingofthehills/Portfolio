export interface Certification {
  id: string
  title: string
  organization: string
  year: string
}

export const certifications: Certification[] = [
  {
    id: 'cert-1',
    title: 'Accelerating End-to-End Data Science',
    organization: 'NVIDIA',
    year: '2024',
  },
  {
    id: 'cert-2',
    title: 'Data Structures & Algorithms Mastery',
    organization: 'Vamsi Bhavani',
    year: '2024',
  },
  {
    id: 'cert-3',
    title: 'Full Stack Web Development Program',
    organization: 'Amaravathi Institute',
    year: '2023',
  },
]
