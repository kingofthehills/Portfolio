export const personal = {
  name: '[YOUR NAME]',
  initials: '[YN]',
  role: 'Full-Stack Developer & Creative Technologist',
  tagline: 'I build digital experiences where technology meets design.',
  location: '[Your City, Country]',
  timezone: '[UTC+0]',
  availability: {
    status: 'available' as const,
    label: 'Available for opportunities',
    detail:
      'Currently available for internships, freelance projects and software engineering opportunities.',
  },
  resumeUrl: '/resume.pdf',
  about: {
    intro:
      "I'm a developer who cares as much about how software feels as how it works. I like taking an idea from a rough sketch to a polished, production-ready product — writing the API, shaping the data, and tuning the last 5% of motion that makes an interface feel alive.",
    philosophy:
      'Good engineering is invisible. I aim for interfaces that are fast, predictable, and quietly confident — never louder than the problem they solve.',
    focus:
      'Right now I\'m focused on [current focus — e.g. full-stack product engineering, real-time systems, and interactive web experiences].',
    enjoys: [
      'Turning complex flows into simple interfaces',
      'Systems that stay fast under real load',
      'The last-mile motion and detail work',
      'Learning tools deeply instead of collecting them',
    ],
  },
  stats: [
    { label: 'Projects shipped', value: 20, suffix: '+' },
    { label: 'Technologies used', value: 10, suffix: '+' },
    { label: 'Years learning & building', value: 3, suffix: '+' },
    { label: 'Focus on the details', value: 100, suffix: '%' },
  ],
} as const
