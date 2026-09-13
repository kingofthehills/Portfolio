import type { MotionValue } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface ScrollFrameHeroProps {
  /** 0..1 scroll progress of the whole section. */
  progress: MotionValue<number>
  /** The fraction of `progress` (0..scrollEnd) over which the frames play out. */
  scrollEnd: number
  frameUrls: string[]
  className?: string
}

/**
 * Draws a preloaded image sequence to a canvas, picking the frame
 * directly from live scroll position every animation frame. Unlike
 * seeking a compressed <video>, drawing an already-decoded image is
 * effectively instant, so the frame can track scroll 1:1 with no
 * smoothing/easing needed to hide seek latency.
 */
export function ScrollFrameHero({ progress, scrollEnd, frameUrls, className }: ScrollFrameHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])

  useEffect(() => {
    imagesRef.current = frameUrls.map((src) => {
      const img = new Image()
      img.src = src
      return img
    })
  }, [frameUrls])

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const rect = parent!.getBoundingClientRect()
      canvas!.width = rect.width * dpr
      canvas!.height = rect.height * dpr
    }
    resize()
    window.addEventListener('resize', resize)

    function drawFrame(index: number): boolean {
      const img = imagesRef.current[index]
      if (!img || !img.complete || img.naturalWidth === 0) return false
      const canvasW = canvas!.width
      const canvasH = canvas!.height
      const canvasRatio = canvasW / canvasH
      const imgRatio = img.naturalWidth / img.naturalHeight
      let drawW: number
      let drawH: number
      if (imgRatio > canvasRatio) {
        drawH = canvasH
        drawW = img.naturalWidth * (canvasH / img.naturalHeight)
      } else {
        drawW = canvasW
        drawH = img.naturalHeight * (canvasW / img.naturalWidth)
      }
      ctx!.drawImage(img, (canvasW - drawW) / 2, (canvasH - drawH) / 2, drawW, drawH)
      return true
    }

    let rafId: number | null = null
    // Only -1 until a draw actually succeeds — if the target frame's
    // image hasn't finished loading yet, this stays -1 so the very
    // next tick retries the same index instead of silently giving up
    // on it forever (which is what let the canvas start blank until
    // scrolling happened to land on an already-loaded frame).
    let lastDrawnIndex = -1
    function tick() {
      const frameCount = imagesRef.current.length
      if (frameCount > 0) {
        const t = Math.min(1, Math.max(0, progress.get() / scrollEnd))
        const index = Math.round(t * (frameCount - 1))
        if (index !== lastDrawnIndex && drawFrame(index)) {
          lastDrawnIndex = index
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    // This section is at the very top of the page, so once scrolled
    // past it there's no reason for its own rAF loop to keep polling
    // scroll progress forever — pause it while off-screen.
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && rafId === null) {
          rafId = requestAnimationFrame(tick)
        } else if (!entry.isIntersecting && rafId !== null) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
      },
      { rootMargin: '200px' },
    )
    intersectionObserver.observe(parent)

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      intersectionObserver.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [progress, scrollEnd])

  return <canvas ref={canvasRef} className={className} />
}
