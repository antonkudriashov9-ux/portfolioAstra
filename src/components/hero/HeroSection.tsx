import { useCallback } from 'react'
import { motion } from 'framer-motion'
import HeroCanvas from './HeroCanvas'
import KineticText from './KineticText'
import { useAudio } from '../../hooks/useAudio'
import { useStore } from '../../store/useStore'

export default function HeroSection() {
  // Single useAudio call - destructure everything needed
  const { sweep, click } = useAudio()
  const setTerminalOpen = useStore((s) => s.setTerminalOpen)

  const handleShockwave = useCallback(() => sweep(110), [sweep])

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[640px] flex flex-col justify-center overflow-hidden"
      style={{ background: '#0A0A0A' }}
    >
      <HeroCanvas onShockwave={handleShockwave} />

      {/* Depth grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,255,0,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(212,255,0,0.022) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
        aria-hidden="true"
      />

      {/* Gradient vignette bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0A0A0A)' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 px-6 md:px-14 lg:px-24 max-w-[1400px]">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          className="flex items-center gap-3 mb-7"
        >
          <span className="block w-8 h-px" style={{ background: '#D4FF00' }} />
          <span
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: '#D4FF00' }}
          >
            Senior Full-Stack Engineer
          </span>
        </motion.div>

        {/* Headline */}
        <h1
          className="font-bold tracking-tight mb-8"
          style={{
            fontSize: 'clamp(3.5rem, 10vw, 8.5rem)',
            lineHeight: 0.92,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          <span className="block overflow-hidden" style={{ color: '#F5F4F2' }}>
            <KineticText text="Systems" delay={0.2} />
          </span>
          <span className="block overflow-hidden" style={{ color: '#D4FF00' }}>
            <KineticText text="That Scale." delay={0.38} />
          </span>
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-[460px] mb-10"
          style={{
            fontSize: 'clamp(0.95rem, 1.9vw, 1.1rem)',
            color: '#A8A6A2',
            lineHeight: 1.65,
          }}
        >
          Building distributed systems and WebGL experiences at 60fps.
          Click the canvas to fire shockwaves.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-wrap gap-4"
        >
          <button
            onClick={() => { click(); setTerminalOpen(true) }}
            className="font-mono text-sm tracking-wider px-8 py-4 font-semibold transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              background: '#D4FF00',
              color: '#0A0A0A',
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
            }}
            aria-label="Open terminal"
          >
            Open Terminal_
          </button>
          <a
            href="#projects"
            className="font-mono text-sm tracking-wider px-8 py-4 border transition-all duration-200 focus:outline-none focus-visible:ring-2"
            style={{ borderColor: '#2A2A2A', color: '#F5F4F2' }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = '#D4FF00'
              el.style.color = '#D4FF00'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = '#2A2A2A'
              el.style.color = '#F5F4F2'
            }}
            onClick={click}
          >
            View Projects
          </a>
        </motion.div>
      </div>

      {/* Live telemetry strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.4 }}
        className="absolute bottom-8 left-6 md:left-14 lg:left-24 flex items-center gap-8 z-10"
        aria-label="Live telemetry"
      >
        {[
          { label: 'Uptime', value: '99.97%' },
          { label: 'P99 Latency', value: '12ms' },
          { label: 'Daily Events', value: '12M+' },
        ].map((m) => (
          <div key={m.label} className="flex flex-col">
            <span
              className="font-mono uppercase tracking-widest select-none"
              style={{ fontSize: '9px', color: '#2A2A2A' }}
            >
              {m.label}
            </span>
            <span className="font-mono font-bold text-sm" style={{ color: '#D4FF00' }}>
              {m.value}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
