import { useEffect, useRef, useState } from 'react'
import { buildBallWaypoints, buildCameraKeyframes } from '@/journey/buildWaypoints'
import type { JourneySectionId, JourneySectionRange } from '@/three/utils/journeyStore'
import { JOURNEY_SECTION_IDS, setJourneyProgress } from '@/three/utils/journeyStore'

/**
 * Measures the real DOM position of each journey section (About through
 * Contact) and converts scroll position into a single 0-1 "journey
 * progress" value plus per-section [start, end] ranges — driven by actual
 * rendered content height rather than guessed percentages, so the ranges
 * stay correct regardless of how much copy/how many projects exist.
 *
 * Writes into the module-level journeyStore every scroll/resize tick (for
 * the 3D layer to read per-frame) and only updates React state when the
 * active section actually changes (for UI like the chapter indicator).
 * Rebuilding the ball/camera waypoint arrays here — bound to actual scroll
 * events, rAF-throttled to at most once per display frame — rather than
 * inside the R3F render loop (which ticks continuously at 60fps regardless
 * of scrolling) avoids allocating fresh arrays every single frame, which
 * was visibly stuttering on slower devices.
 */
export function useJourneyScroll() {
  const [activeSection, setActiveSection] = useState<JourneySectionId | null>(null)
  const lastActiveRef = useRef<JourneySectionId | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    function measure() {
      rafRef.current = null

      const elements = JOURNEY_SECTION_IDS.map((id) => document.getElementById(id)).filter(
        (el): el is HTMLElement => el !== null,
      )
      if (elements.length === 0) return

      const first = elements[0]
      const lastEl = elements[elements.length - 1]
      const journeyTop = window.scrollY + first.getBoundingClientRect().top
      const journeyBottom = window.scrollY + lastEl.getBoundingClientRect().bottom
      // Max distance actually scrollable within the journey: scrolling stops
      // once the last section's bottom reaches the viewport's bottom, not
      // when it reaches the viewport's top.
      const scrollable = Math.max(1, journeyBottom - journeyTop - window.innerHeight)
      const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

      // A section's "entry" point is when its top first enters the bottom
      // of the viewport (not when its top reaches the viewport's top) —
      // the latter is geometrically unreachable for any trailing section
      // shorter than the viewport, which collapsed Contact's whole range
      // to a single point at progress 1.
      const entries = elements.map((el) => {
        const top = window.scrollY + el.getBoundingClientRect().top
        return clamp01((top - window.innerHeight - journeyTop) / scrollable)
      })

      const ranges: JourneySectionRange[] = JOURNEY_SECTION_IDS.map((id, i) => ({
        id,
        start: i === 0 ? 0 : entries[i],
        end: i === entries.length - 1 ? 1 : entries[i + 1],
      }))

      const overall = clamp01((window.scrollY - journeyTop) / scrollable)
      setJourneyProgress(overall, ranges, buildBallWaypoints(ranges), buildCameraKeyframes(ranges))

      const active = ranges.find((r) => overall >= r.start && overall <= r.end)?.id ?? null
      if (active !== lastActiveRef.current) {
        lastActiveRef.current = active
        setActiveSection(active)
      }
    }

    function onScrollOrResize() {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)

    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { activeSection }
}
