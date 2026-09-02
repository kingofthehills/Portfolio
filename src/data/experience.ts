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
    year: '[Year]',
    title: '[Degree / Program]',
    organization: '[Institution Name]',
    description: '[Brief description of what you studied or focused on.]',
  },
  {
    id: 'proj-1',
    type: 'project',
    year: '[Year]',
    title: '[Major project milestone]',
    organization: '[Personal / Team project]',
    description: '[What you built and what you learned shipping it.]',
  },
  {
    id: 'work-1',
    type: 'work',
    year: '[Year]',
    title: '[Role title]',
    organization: '[Company / Organization]',
    description: '[What you were responsible for and the impact of the work.]',
  },
  {
    id: 'cert-1',
    type: 'certification',
    year: '[Year]',
    title: '[Certification name]',
    organization: '[Issuing organization]',
    description: '[What the certification covered.]',
  },
]
