import { useEffect, useState } from 'react'

export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)')
    const update = () => setIsTouch(coarse.matches || 'ontouchstart' in window)
    update()
    coarse.addEventListener('change', update)
    return () => coarse.removeEventListener('change', update)
  }, [])

  return isTouch
}

export function useIsSmallScreen(breakpoint = 768): boolean {
  const [isSmall, setIsSmall] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const update = () => setIsSmall(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [breakpoint])

  return isSmall
}
