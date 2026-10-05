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
      // Decoding off the main thread keeps a late-arriving frame from
      // stalling the scroll on the first drawImage of that frame.
      img.decoding = 'async'
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

    let inView = true
    // Assigning canvas.width/height resets the bitmap to transparent
    // black, so any size sync has to be followed by a redraw. Both flags
    // are consumed inside the rAF tick rather than acted on immediately,
    // which coalesces bursts of resize/ResizeObserver events down to one
    // sync per frame.
    let pendingSizeSync = true
    let needsRedraw = true

    function syncCanvasSize() {
      // Capped at 2: a 3x phone would otherwise allocate a backing store
      // ~2.25x larger for no visible gain, on top of the 64 decoded
      // frames this already keeps in memory.
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = parent!.getBoundingClientRect()
      const width = Math.max(1, Math.round(rect.width * dpr))
      const height = Math.max(1, Math.round(rect.height * dpr))
      // The guard is the point: mobile browsers fire `resize` every time
      // the URL bar slides in or out while scrolling, but the sticky
      // container is sized in svh so its box doesn't actually change.
      // Reassigning width/height unconditionally blanked the canvas on
      // every one of those events, and nothing redrew until scroll
      // happened to land on a *different* frame index — which is what
      // showed as the hero flashing to a black background mid-scroll.
      if (canvas!.width !== width || canvas!.height !== height) {
        canvas!.width = width
        canvas!.height = height
        needsRedraw = true
      }
    }

    function isReady(index: number): boolean {
      const img = imagesRef.current[index]
      return Boolean(img && img.complete && img.naturalWidth > 0)
    }

    function drawFrame(index: number): boolean {
      const img = imagesRef.current[index]
      if (!isReady(index)) return false
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

    /**
     * The loaded frame closest to `index`, searching outward in both
     * directions. On a slow connection a fast scroll can run ahead of
     * what has downloaded; showing the nearest neighbour is a slightly
     * stale door position, whereas drawing nothing shows the container's
     * black background through the canvas.
     */
    function nearestReadyFrame(index: number): number {
      const frameCount = imagesRef.current.length
      for (let offset = 1; offset < frameCount; offset++) {
        if (index - offset >= 0 && isReady(index - offset)) return index - offset
        if (index + offset < frameCount && isReady(index + offset)) return index + offset
      }
      return -1
    }

    let rafId: number | null = null
    // Only -1 until a draw actually succeeds — if the target frame's
    // image hasn't finished loading yet, this stays -1 so the very
    // next tick retries the same index instead of silently giving up
    // on it forever (which is what let the canvas start blank until
    // scrolling happened to land on an already-loaded frame).
    let lastDrawnIndex = -1
    function tick() {
      if (pendingSizeSync) {
        pendingSizeSync = false
        syncCanvasSize()
      }
      const frameCount = imagesRef.current.length
      if (frameCount > 0) {
        const t = Math.min(1, Math.max(0, progress.get() / scrollEnd))
        const index = Math.round(t * (frameCount - 1))
        if (needsRedraw || index !== lastDrawnIndex) {
          if (drawFrame(index)) {
            lastDrawnIndex = index
            needsRedraw = false
          } else {
            const fallback = nearestReadyFrame(index)
            if (fallback !== -1) {
              drawFrame(fallback)
              // Something real is on screen, but keep retrying the frame
              // actually being asked for until it has downloaded.
              needsRedraw = false
              lastDrawnIndex = -1
            }
          }
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    function startLoop() {
      if (inView && rafId === null) rafId = requestAnimationFrame(tick)
    }

    function stopLoop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }

    const onViewportChange = () => {
      pendingSizeSync = true
      startLoop()
    }
    window.addEventListener('resize', onViewportChange)
    window.addEventListener('orientationchange', onViewportChange)
    // Catches layout changes the window `resize` event doesn't report,
    // e.g. the sticky container's own box changing.
    const resizeObserver = new ResizeObserver(onViewportChange)
    resizeObserver.observe(parent)

    // This section is at the very top of the page, so once scrolled
    // past it there's no reason for its own rAF loop to keep polling
    // scroll progress forever — pause it while off-screen.
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? true
        if (inView) {
          // The bitmap may have been resized (and so blanked) while the
          // loop was paused.
          needsRedraw = true
          startLoop()
        } else {
          stopLoop()
        }
      },
      { rootMargin: '200px' },
    )
    intersectionObserver.observe(parent)

    return () => {
      stopLoop()
      intersectionObserver.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('resize', onViewportChange)
      window.removeEventListener('orientationchange', onViewportChange)
    }
  }, [progress, scrollEnd])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      // Last-resort backstop: the first frame painted behind the canvas,
      // so if the bitmap is ever empty (very first paint, a tab restored
      // from the background with its canvas dropped) the hero shows the
      // closed door rather than a black rectangle.
      style={
        frameUrls[0]
          ? {
              backgroundImage: `url(${frameUrls[0]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    />
  )
}
