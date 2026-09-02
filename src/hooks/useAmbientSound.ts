import { useCallback, useEffect, useRef, useState } from 'react'

const AUDIO_SRC = '/audio/ambient.mp3'

/**
 * Ambient sound is OFF by default and never autoplays. If no audio file has
 * been added at /public/audio/ambient.mp3 this silently becomes a no-op —
 * the toggle just won't produce sound until a real file is provided.
 */
export function useAmbientSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const audio = new Audio(AUDIO_SRC)
    audio.loop = true
    audio.volume = 0.35
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  const toggle = useCallback(() => {
    setEnabled((current) => {
      const next = !current
      const audio = audioRef.current
      if (audio) {
        if (next) {
          void audio.play().catch(() => {
            // no audio file configured yet — fail silently
          })
        } else {
          audio.pause()
        }
      }
      return next
    })
  }, [])

  return { enabled, toggle }
}
