import { useRef, useCallback } from 'react'
import { useStore } from '../store/useStore'

interface AudioEngine {
  click: () => void
  hover: () => void
  sweep: (freq?: number) => void
  startDrone: () => void
  stopDrone: () => void
}

export function useAudio(): AudioEngine {
  const audioEnabled = useStore((s) => s.audioEnabled)
  const ctxRef = useRef<AudioContext | null>(null)
  const droneOscRef = useRef<OscillatorNode | null>(null)
  const droneGainRef = useRef<GainNode | null>(null)

  const getCtx = useCallback((): AudioContext | null => {
    if (!audioEnabled) return null
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    if (ctxRef.current.state === 'suspended') {
      void ctxRef.current.resume()
    }
    return ctxRef.current
  }, [audioEnabled])

  const click = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 900
    osc.type = 'square'
    osc.frequency.setValueAtTime(1400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.05)
    gain.gain.setValueAtTime(0.07, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07)
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.07)
  }, [getCtx])

  const hover = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(520, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(960, ctx.currentTime + 0.06)
    gain.gain.setValueAtTime(0.018, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.09)
  }, [getCtx])

  const sweep = useCallback((freq = 220) => {
    const ctx = getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(freq * 2.2, ctx.currentTime + 0.18)
    gain.gain.setValueAtTime(0.028, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.22)
  }, [getCtx])

  const startDrone = useCallback(() => {
    const ctx = getCtx()
    if (!ctx || droneOscRef.current) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.25
    lfoGain.gain.value = 2
    lfo.connect(lfoGain)
    lfoGain.connect(osc.frequency)
    osc.type = 'sine'
    osc.frequency.value = 55
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 2.5)
    osc.connect(gain)
    gain.connect(ctx.destination)
    lfo.start()
    osc.start()
    droneOscRef.current = osc
    droneGainRef.current = gain
  }, [getCtx])

  const stopDrone = useCallback(() => {
    const ctx = ctxRef.current
    if (!ctx || !droneOscRef.current || !droneGainRef.current) return
    const t = ctx.currentTime
    droneGainRef.current.gain.linearRampToValueAtTime(0, t + 1.2)
    droneOscRef.current.stop(t + 1.2)
    droneOscRef.current = null
    droneGainRef.current = null
  }, [])

  return { click, hover, sweep, startDrone, stopDrone }
}
