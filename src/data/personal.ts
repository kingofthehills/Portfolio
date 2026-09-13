export const personal = {
  name: 'Kishore Nidamanuri',
  initials: 'KN',
  role: 'Full Stack Developer',
  tagline: 'I build digital experiences where technology meets design.',
  location: 'Rajamahendravaram, Andhra Pradesh, India',
  timezone: 'UTC+5:30',
  availability: {
    status: 'available' as const,
    label: 'Available for opportunities',
    detail:
      'Currently available for internships, freelance projects and software engineering opportunities.',
  },
  resumeUrl: '/resume.pdf',
  about: {
    intro:
      "I'm a developer who cares as much about how software feels as how it works. I build full-stack products end to end — from a rough idea and a blank editor to something fast, reliable, and genuinely pleasant to use, with the same attention on the API underneath as the interface on top.",
    philosophy:
      'Good engineering is invisible. I aim for interfaces that are fast, predictable, and quietly confident — never louder than the problem they solve.',
    focus:
      "Right now I'm focused on full-stack product engineering — building AI-powered features, scalable APIs, and interactive web experiences with React, Next.js, and Node.js.",
    enjoys: [
      'Turning complex flows into simple interfaces',
      'Systems that stay fast under real load',
      'The last-mile motion and detail work',
      'Learning tools deeply instead of collecting them',
    ],
  },
  stats: [
    { label: 'Projects shipped', value: 5, suffix: '+' },
    { label: 'Technologies used', value: 15, suffix: '+' },
    { label: 'Years learning & building', value: 3, suffix: '+' },
    { label: 'Focus on the details', value: 100, suffix: '%' },
  ],
} as const
