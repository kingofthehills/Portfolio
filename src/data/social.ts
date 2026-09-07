export const social = {
  email: 'nidamanurikishore47@gmail.com',
  phone: '+91 79897-31595',
  github: 'https://github.com/kingofthehills',
  linkedin: 'https://linkedin.com/in/kishore-nidamanuri',
  twitter: '',
  instagram: '',
} as const

export const socialLinks = [
  { label: 'GitHub', href: social.github, key: 'github' },
  { label: 'LinkedIn', href: social.linkedin, key: 'linkedin' },
  { label: 'X / Twitter', href: social.twitter, key: 'twitter' },
  { label: 'Email', href: `mailto:${social.email}`, key: 'email' },
].filter((link) => Boolean(link.href))
