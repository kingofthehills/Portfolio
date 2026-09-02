export const social = {
  email: 'your.email@example.com',
  github: 'https://github.com/your-username',
  linkedin: 'https://linkedin.com/in/your-username',
  twitter: 'https://x.com/your-username',
  instagram: '',
} as const

export const socialLinks = [
  { label: 'GitHub', href: social.github, key: 'github' },
  { label: 'LinkedIn', href: social.linkedin, key: 'linkedin' },
  { label: 'X / Twitter', href: social.twitter, key: 'twitter' },
  { label: 'Email', href: `mailto:${social.email}`, key: 'email' },
].filter((link) => Boolean(link.href))
