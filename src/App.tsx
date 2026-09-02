import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { About } from '@/components/About'
import { ChapterIndicator } from '@/components/cinematic/ChapterIndicator'
import { CinematicExperience } from '@/components/cinematic/CinematicExperience'
import { SoundToggle } from '@/components/cinematic/SoundToggle'
import { CommandPalette } from '@/components/CommandPalette'
import { Contact } from '@/components/Contact'
import { CustomCursor } from '@/components/CustomCursor'
import { EasterEggs } from '@/components/EasterEggs'
import { ExperienceTimeline } from '@/components/ExperienceTimeline'
import { Footer } from '@/components/Footer'
import { GithubSection } from '@/components/GithubSection'
import { Hero } from '@/components/Hero'
import { LoadingScreen } from '@/components/LoadingScreen'
import { Navbar } from '@/components/Navbar'
import { ProjectShowcase } from '@/components/ProjectShowcase'
import { ScrollProgress } from '@/components/ScrollProgress'
import { TechStack } from '@/components/TechStack'
import { navItems } from '@/data/navigation'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useAmbientSound } from '@/hooks/useAmbientSound'
import { useJourneyScroll } from '@/hooks/useJourneyScroll'
import { useMotionPreference } from '@/hooks/useMotionPreference'
import { useTheme } from '@/hooks/useTheme'
import { JourneyCanvas } from '@/three/journey/JourneyCanvas'

const SECTION_IDS = navItems.map((item) => item.id)

function App() {
  const [loading, setLoading] = useState(true)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const activeSection = useActiveSection(SECTION_IDS)
  const { reducedMotion, toggle: toggleMotion } = useMotionPreference()
  const { enabled: soundEnabled, toggle: toggleSound } = useAmbientSound()
  useJourneyScroll()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <AnimatePresence mode="wait">
        {loading ? <LoadingScreen key="loader" onComplete={() => setLoading(false)} /> : null}
      </AnimatePresence>

      {/* z-index 0 (not negative) — a negative z-index on a fixed element
          painted below the body's own background here, making it invisible
          regardless of what it rendered. Zero plus being first in the DOM
          keeps it behind all normal (z-index:auto) page content while
          staying above the page background. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <JourneyCanvas theme={theme} />
      </div>

      <div aria-hidden className="noise-layer" />
      <CustomCursor />
      <ScrollProgress />
      <ChapterIndicator activeChapter={activeSection} />
      <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
      <EasterEggs />

      <Navbar
        activeSection={activeSection}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <main>
        {reducedMotion ? <Hero /> : <CinematicExperience />}
        <About />
        <ProjectShowcase />
        <TechStack />
        <ExperienceTimeline />
        <GithubSection />
        <Contact />
      </main>

      <Footer />

      <AnimatePresence>
        {paletteOpen ? (
          <CommandPalette
            onClose={() => setPaletteOpen(false)}
            theme={theme}
            onToggleTheme={toggleTheme}
            reducedMotion={reducedMotion}
            onToggleMotion={toggleMotion}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
          />
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default App
