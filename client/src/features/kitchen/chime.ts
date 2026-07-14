// Short two-tone chime for new orders — synthesised, so there's no audio asset
// to ship. Browsers allow this after the user has interacted (i.e. logged in).
let ctx: AudioContext | null = null

export function playChime(): void {
  try {
    ctx ??= new AudioContext()
    const now = ctx.currentTime
    for (const [i, freq] of [880, 1175].entries()) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const start = now + i * 0.15
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.3, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14)
      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.15)
    }
  } catch {
    // Audio not available — silently ignore.
  }
}
