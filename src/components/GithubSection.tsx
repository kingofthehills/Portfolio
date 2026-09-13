import { motion } from 'framer-motion'
import { GitFork, Star, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GithubIcon } from '@/components/icons/BrandIcons'
import { SectionHeading } from '@/components/SectionHeading'
import { TiltCard } from '@/components/TiltCard'
import { ShaderBackground } from '@/components/ui/shader-background'
import { social } from '@/data/social'

interface GithubProfile {
  login: string
  public_repos: number
  followers: number
}

interface GithubRepo {
  id: number
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
}

const username = social.github.split('/').filter(Boolean).pop() ?? ''

const MOCK_PROFILE = { login: username || 'your-username', public_repos: 24, followers: 42 }
const MOCK_REPOS: GithubRepo[] = [
  { id: 1, name: 'realtime-dashboard', html_url: social.github, description: 'A live analytics dashboard with websocket updates.', stargazers_count: 18, forks_count: 4, language: 'TypeScript' },
  { id: 2, name: 'api-toolkit', html_url: social.github, description: 'Reusable REST API scaffolding and middleware.', stargazers_count: 11, forks_count: 2, language: 'Node.js' },
  { id: 3, name: 'ui-components', html_url: social.github, description: 'A small library of accessible React components.', stargazers_count: 9, forks_count: 1, language: 'React' },
]

export function GithubSection() {
  const [profile, setProfile] = useState<GithubProfile>(MOCK_PROFILE)
  const [repos, setRepos] = useState<GithubRepo[]>(MOCK_REPOS)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    if (!username || username.toLowerCase().includes('your-username')) return

    let cancelled = false

    async function loadGithubData() {
      try {
        const [profileRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=3`),
        ])
        if (!profileRes.ok || !reposRes.ok) return
        const profileData = (await profileRes.json()) as GithubProfile
        const reposData = (await reposRes.json()) as GithubRepo[]
        if (!cancelled) {
          setProfile(profileData)
          setRepos(reposData)
          setIsLive(true)
        }
      } catch {
        // keep mock data on failure
      }
    }

    void loadGithubData()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="relative py-28">
      {/* z-0 (not negative), full-width shader with the max-width/padding
          moved onto the content wrapper below — same pattern as the
          Projects section, so the two feel like one continuous theme
          rather than each section having its own one-off treatment. */}
      <ShaderBackground className="pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <SectionHeading
          eyebrow="Open Source"
          title="On GitHub."
          description={isLive ? 'Live activity, pulled directly from the GitHub API.' : 'Sample activity — connect a real GitHub username to make this live.'}
        />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between gap-6 rounded-2xl border border-border/30 bg-surface/40 p-6 lg:col-span-4"
          >
            <div className="flex items-center gap-3">
              <GithubIcon size={20} className="text-ink" />
              <span className="font-display text-lg text-ink">@{profile.login}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-display text-2xl text-ink">{profile.public_repos}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-muted">Repositories</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-display text-2xl text-ink">
                  <Users size={16} className="text-accent2" /> {profile.followers}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-muted">Followers</div>
              </div>
            </div>
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="VISIT"
              className="link-underline inline-flex w-fit items-center gap-1.5 text-sm text-ink"
            >
              View full profile ↗
            </a>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
            {repos.slice(0, 3).map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard className="h-full rounded-2xl border border-border/30 bg-surface/40 p-5">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="relative z-10 flex h-full flex-col justify-between gap-4">
                    <div>
                      <span className="font-mono text-sm text-ink">{repo.name}</span>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{repo.description ?? 'No description provided.'}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-faint">
                      {repo.language ? <span>{repo.language}</span> : null}
                      <span className="inline-flex items-center gap-1">
                        <Star size={12} /> {repo.stargazers_count}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitFork size={12} /> {repo.forks_count}
                      </span>
                    </div>
                  </a>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
