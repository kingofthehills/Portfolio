export type SkillLevel = 'Familiar' | 'Proficient' | 'Advanced'

export interface Skill {
  name: string
  level: SkillLevel
  description: string
}

export interface SkillCategory {
  category: string
  items: Skill[]
}

export const skillCategories: SkillCategory[] = [
  {
    category: 'Frontend',
    items: [
      { name: 'React', level: 'Advanced', description: 'Component architecture, hooks, and state management for production UIs.' },
      { name: 'TypeScript', level: 'Advanced', description: 'Strong typing across app, API, and data layers.' },
      { name: 'JavaScript', level: 'Advanced', description: 'Modern ES2023+, async patterns, and performance-minded DOM work.' },
      { name: 'Tailwind CSS', level: 'Advanced', description: 'Design-system-driven styling with a restrained, consistent scale.' },
      { name: 'HTML', level: 'Advanced', description: 'Semantic, accessible markup as the foundation of every interface.' },
      { name: 'CSS', level: 'Advanced', description: 'Layout, animation, and responsive systems without a framework crutch.' },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'Node.js', level: 'Advanced', description: 'Server runtimes, tooling, and long-running services.' },
      { name: 'Express', level: 'Proficient', description: 'REST API design, middleware, and auth flows.' },
      { name: 'REST APIs', level: 'Advanced', description: 'Designing predictable, versioned, well-documented endpoints.' },
    ],
  },
  {
    category: 'Database',
    items: [
      { name: 'MongoDB', level: 'Proficient', description: 'Schema design and aggregation for document-oriented data.' },
      { name: 'MySQL', level: 'Proficient', description: 'Relational modeling, indexing, and query optimization.' },
    ],
  },
  {
    category: 'Tools',
    items: [
      { name: 'Git', level: 'Advanced', description: 'Branching strategy, rebasing, and clean commit history.' },
      { name: 'GitHub', level: 'Advanced', description: 'PR workflows, actions, and project collaboration.' },
      { name: 'VS Code', level: 'Advanced', description: 'Daily driver, tuned with a fast, minimal workflow.' },
      { name: 'Postman', level: 'Proficient', description: 'API testing, mocking, and documentation.' },
    ],
  },
]
