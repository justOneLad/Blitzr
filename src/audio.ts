function noiseBuffer(ctx: AudioContext, dur: number, shapeFn: (t: number) => number): AudioBuffer {
  const buf = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * dur)), ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) {
    const t = i / d.length
    d[i] = (Math.random() * 2 - 1) * shapeFn(t)
  }
  return buf
}

function playCrack(ctx: AudioContext, dest: AudioNode, gainPeak: number) {
  const n = ctx.createBufferSource()
  n.buffer = noiseBuffer(ctx, 0.02, (t) => Math.pow(1 - t, 6))
  n.playbackRate.value = 0.85 + Math.random() * 0.35
  const g = ctx.createGain()
  g.gain.value = gainPeak
  n.connect(g)
  g.connect(dest)
  n.start()

  const n2 = ctx.createBufferSource()
  n2.buffer = noiseBuffer(ctx, 0.012, (t) => Math.pow(1 - t, 5))
  n2.playbackRate.value = 1.1 + Math.random() * 0.4
  const g2 = ctx.createGain()
  g2.gain.value = gainPeak * 0.4
  const hp2 = ctx.createBiquadFilter()
  hp2.type = 'highpass'
  hp2.frequency.value = 3000
  n2.connect(hp2)
  hp2.connect(g2)
  g2.connect(dest)
  setTimeout(() => {
    try {
      n2.start()
    } catch {
      /* noop */
    }
  }, 22)
}

function playSizzle(ctx: AudioContext, dest: AudioNode, dur: number, gainPeak: number, startFreq: number, endFreq: number) {
  const now = ctx.currentTime
  const n = ctx.createBufferSource()
  n.buffer = noiseBuffer(ctx, dur, (t) => Math.pow(1 - t, 1.6))
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.Q.value = 6
  bp.frequency.setValueAtTime(startFreq, now)
  bp.frequency.exponentialRampToValueAtTime(endFreq, now + dur)
  const g = ctx.createGain()
  g.gain.value = gainPeak
  n.connect(bp)
  bp.connect(g)
  g.connect(dest)
  n.start()
}

function playRumble(ctx: AudioContext, dest: AudioNode, dur: number, gainPeak: number) {
  const now = ctx.currentTime
  const n = ctx.createBufferSource()
  n.buffer = noiseBuffer(ctx, dur, () => 1)
  n.loop = false
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 180
  lp.Q.value = 1.2
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, now)
  g.gain.linearRampToValueAtTime(gainPeak, now + 0.05)
  g.gain.linearRampToValueAtTime(gainPeak * 0.55, now + dur * 0.4)
  g.gain.linearRampToValueAtTime(gainPeak * 0.8, now + dur * 0.6)
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur)
  n.connect(lp)
  lp.connect(g)
  g.connect(dest)
  n.start()
}

type AudioContextCtor = typeof AudioContext
declare global {
  interface Window {
    webkitAudioContext?: AudioContextCtor
  }
}

export function playBlitz() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    playCrack(ctx, ctx.destination, 0.6)
    playSizzle(ctx, ctx.destination, 0.18, 0.24, 6000, 1200)
    setTimeout(() => {
      try {
        playSizzle(ctx, ctx.destination, 0.08, 0.1, 3200, 2400)
      } catch {
        /* noop */
      }
    }, 20)
    setTimeout(() => {
      try {
        playRumble(ctx, ctx.destination, 0.95, 0.42)
      } catch {
        /* noop */
      }
    }, 45)
    setTimeout(() => ctx.close(), 1150)
  } catch {
    /* noop */
  }
}

export function playSpark() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    playCrack(ctx, ctx.destination, 0.24)
    playSizzle(ctx, ctx.destination, 0.05, 0.11, 7000, 2600)
    setTimeout(() => ctx.close(), 180)
  } catch {
    /* noop */
  }
}
