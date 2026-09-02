import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { personal } from '@/data/personal'

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest).toString())

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, value, { duration: 1.4, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [inView, value, count])

  return (
    <span ref={ref} className="font-feature-tnum">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}

export function Stats() {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {personal.stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-border/30 bg-surface/40 p-5"
        >
          <div className="font-display text-3xl text-ink sm:text-4xl">
            <Counter value={stat.value} suffix={stat.suffix} />
          </div>
          <div className="mt-2 text-xs uppercase tracking-wide text-muted">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  )
}
