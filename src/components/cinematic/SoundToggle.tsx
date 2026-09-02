import { Volume2, VolumeX } from 'lucide-react'

interface SoundToggleProps {
  enabled: boolean
  onToggle: () => void
}

export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      data-cursor="TOGGLE"
      aria-pressed={enabled}
      aria-label={`Turn ambient sound ${enabled ? 'off' : 'on'}`}
      className="fixed bottom-8 right-6 z-40 hidden items-center gap-2 rounded-full border border-border/40 bg-surface/60 px-3.5 py-2 font-mono text-[10px] uppercase tracking-widest text-muted backdrop-blur transition-colors hover:text-ink sm:flex"
    >
      {enabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
      Sound: {enabled ? 'On' : 'Off'}
    </button>
  )
}
