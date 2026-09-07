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
    category: 'Languages',
    items: [
      { name: 'JavaScript', level: 'Advanced', description: 'Modern ES2023+, async patterns, and performance-minded DOM work.' },
      { name: 'TypeScript', level: 'Advanced', description: 'Strong typing across app, API, and data layers.' },
      { name: 'Python', level: 'Proficient', description: 'Scripting, data preprocessing, and deep learning model development.' },
      { name: 'C++', level: 'Proficient', description: 'Data structures, algorithms, and systems fundamentals.' },
      { name: 'C', level: 'Proficient', description: 'Core language fundamentals and low-level programming.' },
      { name: 'HTML', level: 'Advanced', description: 'Semantic, accessible markup as the foundation of every interface.' },
      { name: 'CSS', level: 'Advanced', description: 'Layout, animation, and responsive systems without a framework crutch.' },
    ],
  },
  {
    category: 'Frontend',
    items: [
      { name: 'React', level: 'Advanced', description: 'Component architecture, hooks, and state management for production UIs.' },
      { name: 'Next.js', level: 'Advanced', description: 'Building production features for Hiremii, an AI-powered ATS, at Ellocent Labs.' },
      { name: 'Tailwind CSS', level: 'Advanced', description: 'Design-system-driven styling with a restrained, consistent scale.' },
      { name: 'Material UI', level: 'Proficient', description: 'Component-driven UI for enterprise-grade product interfaces.' },
      { name: 'Responsive UI Design', level: 'Advanced', description: 'Cross-device layouts focused on speed and usability.' },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'Node.js', level: 'Advanced', description: 'Server runtimes, tooling, and long-running services.' },
      { name: 'Express.js', level: 'Proficient', description: 'REST API design, middleware, and auth flows.' },
      { name: 'RESTful APIs', level: 'Advanced', description: 'Designing predictable, versioned, well-documented endpoints.' },
      { name: 'JWT Authentication', level: 'Proficient', description: 'Token-based auth flows for secure, stateless sessions.' },
      { name: 'Appwrite', level: 'Proficient', description: 'Backend-as-a-service for data persistence and app logic.' },
    ],
  },
  {
    category: 'Database',
    items: [
      { name: 'MongoDB', level: 'Proficient', description: 'Schema design and aggregation for document-oriented data, scaled to 10,000+ records.' },
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
      { name: 'Vercel', level: 'Proficient', description: 'CI-driven deployment pipelines for production apps.' },
      { name: 'Jupyter', level: 'Proficient', description: 'Notebook-driven experimentation for data science and ML projects.' },
    ],
  },
]
