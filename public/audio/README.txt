Drop an ambient loop here as ambient.mp3 to power the Sound toggle
(src/hooks/useAmbientSound.ts). Keep it short, seamless-looping, and quiet —
this is background room tone, not music. Until a file exists here the
toggle still works in the UI but produces no sound.
