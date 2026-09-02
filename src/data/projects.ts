export interface Project {
  slug: string
  title: string
  description: string
  longDescription: string
  problem: string
  solution: string
  features: string[]
  architecture: string
  challenges: string
  results: string
  category: string
  year: string
  technologies: string[]
  image: string
  github: string
  live: string
  featured: boolean
}

export const projects: Project[] = [
  {
    slug: 'project-one',
    title: '[Project Name One]',
    description: '[One-line summary of what this product does and who it is for.]',
    longDescription:
      '[A fuller description of the product — what it does, the core workflow, and why it exists. Replace with your real project details.]',
    problem: '[The specific problem or friction this project set out to solve.]',
    solution: '[How the product solves it — the key approach or architecture decision.]',
    features: [
      '[Key feature one]',
      '[Key feature two]',
      '[Key feature three]',
      '[Key feature four]',
    ],
    architecture: '[Brief note on the system architecture — client, API, database, deployment.]',
    challenges: '[The hardest technical problem you solved while building this.]',
    results: '[Outcome, adoption, or what shipping this taught you.]',
    category: 'Full Stack',
    year: '2026',
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    image: '/projects/project-one.svg',
    github: 'https://github.com/your-username/project-one',
    live: 'https://project-one.example.com',
    featured: true,
  },
  {
    slug: 'project-two',
    title: '[Project Name Two]',
    description: '[One-line summary of what this product does and who it is for.]',
    longDescription:
      '[A fuller description of the product — what it does, the core workflow, and why it exists. Replace with your real project details.]',
    problem: '[The specific problem or friction this project set out to solve.]',
    solution: '[How the product solves it — the key approach or architecture decision.]',
    features: [
      '[Key feature one]',
      '[Key feature two]',
      '[Key feature three]',
    ],
    architecture: '[Brief note on the system architecture — client, API, database, deployment.]',
    challenges: '[The hardest technical problem you solved while building this.]',
    results: '[Outcome, adoption, or what shipping this taught you.]',
    category: 'Web App',
    year: '2025',
    technologies: ['React', 'Express', 'MySQL', 'Tailwind CSS'],
    image: '/projects/project-two.svg',
    github: 'https://github.com/your-username/project-two',
    live: 'https://project-two.example.com',
    featured: true,
  },
  {
    slug: 'project-three',
    title: '[Project Name Three]',
    description: '[One-line summary of what this product does and who it is for.]',
    longDescription:
      '[A fuller description of the product — what it does, the core workflow, and why it exists. Replace with your real project details.]',
    problem: '[The specific problem or friction this project set out to solve.]',
    solution: '[How the product solves it — the key approach or architecture decision.]',
    features: [
      '[Key feature one]',
      '[Key feature two]',
      '[Key feature three]',
    ],
    architecture: '[Brief note on the system architecture — client, API, database, deployment.]',
    challenges: '[The hardest technical problem you solved while building this.]',
    results: '[Outcome, adoption, or what shipping this taught you.]',
    category: 'API / Tooling',
    year: '2025',
    technologies: ['Node.js', 'Express', 'REST APIs', 'MongoDB'],
    image: '/projects/project-three.svg',
    github: 'https://github.com/your-username/project-three',
    live: 'https://project-three.example.com',
    featured: false,
  },
]
