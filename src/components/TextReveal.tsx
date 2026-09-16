import type { CSSProperties, ElementType, MouseEvent as ReactMouseEvent } from 'react'
import { memo, useMemo, useState } from 'react'

export interface TextRevealProps {
  text: string
  as?: ElementType
  href?: string
  target?: string
  className?: string
  style?: CSSProperties
  fontSize?: string
  staggerDelay?: number
  duration?: number
  easing?: string
  color?: string
  hoverColor?: string
  direction?: 'up' | 'down'
  onClick?: (e: ReactMouseEvent) => void
}

export const TextReveal = memo(function TextReveal({
  text,
  as: Component = 'a',
  href,
  target,
  className = '',
  style,
  fontSize = '3rem',
  staggerDelay = 25,
  duration = 250,
  easing = 'ease-in-out',
  color = 'inherit',
  hoverColor = '#b2c73a',
  direction = 'up',
  onClick,
}: TextRevealProps) {
  const [hovered, setHovered] = useState(false)

  // Split into words so the text can wrap between them on narrow screens;
  // each char keeps its position in the whole string for the stagger delay.
  const words = useMemo(() => {
    const segmenter =
      typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('en', { granularity: 'grapheme' }) : null
    let index = 0
    return text
      .split(' ')
      .filter(Boolean)
      .map((word) => {
        const chars = segmenter ? Array.from(segmenter.segment(word), (s) => s.segment) : [...word]
        const start = index
        index += chars.length + 1
        return { word, chars, start }
      })
  }, [text])

  const sign = direction === 'up' ? 1 : -1

  const rootProps: Record<string, unknown> = {
    className:
      `inline-block relative no-underline font-extrabold uppercase tracking-tight overflow-hidden cursor-pointer select-none ${className}`.trim(),
    style: {
      fontSize,
      color: hovered ? hoverColor : color,
      transition: 'color 0.35s ease',
      padding: '0.15em 0.4em',
      lineHeight: 1,
      maxWidth: '100%',
      ...style,
    },
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onClick,
    'aria-label': text,
  }

  if (Component === 'a') {
    rootProps.href = href ?? '#'
    if (target) rootProps.target = target
    if (target === '_blank') rootProps.rel = 'noopener noreferrer'
  }

  // TS can't validate arbitrary spread props (or infer a correct
  // children signature) against a dynamic ElementType — casting the
  // tag itself to `any` is the standard escape hatch for this class of
  // polymorphic-component pattern.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = Component as any

  return (
    <Tag {...rootProps}>
      <span className="inline-flex flex-wrap" style={{ columnGap: '0.25em', rowGap: '0.15em' }} aria-hidden="true">
        {words.map(({ word, chars, start }, w) => (
          <span key={`${word}-${w}`} className="inline-flex overflow-hidden relative" style={{ height: '1em' }}>
            {chars.map((char, i) => (
              <span
                key={i}
                className="inline-block relative will-change-transform"
                style={{
                  textShadow: `0 ${sign}em currentColor`,
                  transition: `transform ${duration}ms ${easing}`,
                  transitionDelay: `${(start + i) * staggerDelay}ms`,
                  transform: hovered ? `translateY(${-sign}em)` : 'translateY(0)',
                }}
              >
                {char}
              </span>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  )
})

TextReveal.displayName = 'TextReveal'
