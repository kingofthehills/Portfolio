import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  baseX: number
  baseY: number
  radius: number
  label: string
  pulse: number
}

// This site's own dark-theme tokens (src/index.css :root), as literal RGB
// triples rather than `rgb(var(--x))` — canvas fillStyle needs concrete
// component values, it can't read CSS custom properties directly.
const NODE_RGB = '246, 245, 250' // --ink
const ACCENT_RGB = '138, 108, 255' // --accent

const SPACING = 55
const MAX_CONN_DIST = 75
const MAX_CONN_DIST_SQ = MAX_CONN_DIST * MAX_CONN_DIST
// How many grid cells away a connection can possibly reach — used to
// only check nearby candidates instead of every other node.
const CELL_REACH = Math.ceil(MAX_CONN_DIST / SPACING)

interface ConstellationGridProps {
  className?: string
}

/**
 * A background variant of the pasted ConstellationGrid: sized to its own
 * parent container (via ResizeObserver) instead of the viewport, mouse
 * coordinates translated into the canvas's local space instead of raw
 * viewport coordinates, painted with `clearRect` on a transparent canvas
 * instead of an opaque `fillRect` so it sits behind this site's own
 * section content, paused via IntersectionObserver while scrolled out of
 * view, and its connection search rewritten to use the nodes' own grid
 * layout instead of checking every pair (the original's nested loop over
 * all nodes is O(n²) — at a few hundred nodes that's tens of thousands of
 * distance checks every single frame, one of the most expensive things
 * running on the page).
 */
export function ConstellationGrid({ className }: ConstellationGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number | null = null
    let width = 0
    let height = 0
    let cols = 0
    let rows = 0

    // The original component was a full-screen hero — at that scale a
    // 220px interaction radius covers a small fraction of the screen.
    // Adapted into a section-sized background, that same 220px covers
    // a huge share of the visible area, lighting up a wide sprawl of
    // nodes at once instead of a tight, localized effect near the
    // cursor. Scaled down to match.
    const mouse = {
      x: -1000,
      y: -1000,
      prevX: -1000,
      prevY: -1000,
      vx: 0,
      vy: 0,
      radius: 130,
    }

    // Flat, row-major (index = i * rows + j) so a node's grid coordinate
    // can be recovered for the neighbor search below.
    let nodes: Node[] = []

    const initNodes = () => {
      nodes = []
      cols = Math.ceil(width / SPACING) + 1
      rows = Math.ceil(height / SPACING) + 1

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * SPACING
          const y = j * SPACING
          nodes.push({
            x,
            y,
            vx: 0,
            vy: 0,
            baseX: x,
            baseY: y,
            radius: Math.random() * 1.2 + 1.2,
            label: `${(i * 7).toString(16).toUpperCase()}:${(j * 11).toString(16).toUpperCase()}`,
            pulse: Math.random() * Math.PI * 2,
          })
        }
      }
    }

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = container.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initNodes()
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    handleResize()
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    let lastTime = performance.now()

    const render = (now: number) => {
      // Position integrates as `v * dt * 60` — i.e. tuned assuming a
      // ~60fps step (dt≈0.0167). Clamping dt as high as 0.05 (20fps)
      // meant a single dropped frame could overshoot the spring target
      // 3x further than intended, kicking off a visible oscillation
      // that never fully damps out — worse now that this page also
      // runs a WebGL shader background elsewhere, making occasional
      // slow frames more likely. Clamping tighter (1/30s) keeps the
      // worst case close enough to the tuned step to stay stable.
      const dt = Math.min((now - lastTime) / 1000, 1 / 30)
      lastTime = now

      mouse.vx = (mouse.x - mouse.prevX) / (dt * 1000 || 1)
      mouse.vy = (mouse.y - mouse.prevY) / (dt * 1000 || 1)
      mouse.prevX = mouse.x
      mouse.prevY = mouse.y

      const speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy)

      ctx.clearRect(0, 0, width, height)

      const SPRING_K = 14
      const DAMPING = 0.82

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        n.pulse += dt * 3

        const dx = mouse.x - n.x
        const dy = mouse.y - n.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < mouse.radius && dist > 0) {
          const power = 1 - dist / mouse.radius
          const force = power * (1500 + speed * 150)
          const angle = Math.atan2(dy, dx)
          n.vx -= Math.cos(angle) * force * dt
          n.vy -= Math.sin(angle) * force * dt
        }

        const homeDx = n.baseX - n.x
        const homeDy = n.baseY - n.y
        n.vx += homeDx * SPRING_K * dt
        n.vy += homeDy * SPRING_K * dt

        n.vx *= DAMPING
        n.vy *= DAMPING

        n.x += n.vx * dt * 60
        n.y += n.vy * dt * 60
      }

      // Nodes barely drift from their grid slot (the spring pulls them
      // back), so instead of checking every other node for a possible
      // connection, only look at the handful of grid-neighbors close
      // enough to ever be in range. `i2 > i || (i2 === i && j2 > j)`
      // keeps each pair checked exactly once.
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const n = nodes[i * rows + j]

          for (let di = 0; di <= CELL_REACH; di++) {
            const i2 = i + di
            if (i2 >= cols) continue
            const djStart = di === 0 ? 1 : -CELL_REACH
            for (let dj = djStart; dj <= CELL_REACH; dj++) {
              const j2 = j + dj
              if (j2 < 0 || j2 >= rows) continue
              if (di === 0 && j2 <= j) continue

              const n2 = nodes[i2 * rows + j2]
              const ndx = n.x - n2.x
              const ndy = n.y - n2.y
              const distSq = ndx * ndx + ndy * ndy

              if (distSq < MAX_CONN_DIST_SQ) {
                const nDist = Math.sqrt(distSq)
                const alpha = (1 - nDist / MAX_CONN_DIST) * 0.18

                ctx.strokeStyle = `rgba(${NODE_RGB}, ${alpha})`
                ctx.lineWidth = 0.7
                ctx.beginPath()
                ctx.moveTo(n.x, n.y)
                ctx.lineTo(n2.x, n2.y)
                ctx.stroke()
              }
            }
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const dx = mouse.x - n.x
        const dy = mouse.y - n.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const isNear = dist < mouse.radius

        const baseAlpha = isNear ? 0.95 : 0.25 + Math.sin(n.pulse) * 0.1

        ctx.fillStyle = isNear ? `rgba(${ACCENT_RGB}, ${baseAlpha})` : `rgba(${NODE_RGB}, ${baseAlpha})`

        const currentRadius = isNear ? n.radius * 2.2 : n.radius + Math.sin(n.pulse) * 0.3

        ctx.beginPath()
        ctx.arc(n.x, n.y, Math.max(0.5, currentRadius), 0, Math.PI * 2)
        ctx.fill()

        if (dist < 55) {
          const pulseRing = ((n.pulse * 20) % 30) + 4
          const ringAlpha = (1 - pulseRing / 34) * 0.4

          ctx.strokeStyle = `rgba(${ACCENT_RGB}, ${ringAlpha})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(n.x, n.y, pulseRing, 0, Math.PI * 2)
          ctx.stroke()

          ctx.font = '8px ui-monospace, SFMono-Regular, Consolas, monospace'
          ctx.fillStyle = `rgba(${ACCENT_RGB}, 0.85)`
          ctx.fillText(n.label, n.x + 10, n.y - 10)
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    // Paused while scrolled out of view — this loop plus its (now much
    // cheaper, but still non-trivial) connection search has no reason
    // to keep running when nothing on screen shows it.
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && animationFrameId === null) {
          lastTime = performance.now()
          animationFrameId = requestAnimationFrame(render)
        } else if (!entry.isIntersecting && animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId)
          animationFrameId = null
        }
      },
      { rootMargin: '200px' },
    )
    intersectionObserver.observe(container)

    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
      intersectionObserver.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div ref={containerRef} aria-hidden className={className}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
