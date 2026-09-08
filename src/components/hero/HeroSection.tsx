import { useCallback } from 'react'
import { motion } from 'framer-motion'
import HeroCanvas from './HeroCanvas'
import KineticText from './KineticText'
import { useAudio } from '../../hooks/useAudio'
import { useStore } from '../../store/useStore'

export default function HeroSection() {
  const { sweep, click } = useAudio()
  const setTerminalOpen = useStore((s) => s.setTerminalOpen)
  const handleShockwave = useCallback(() => sweep(110), [sweep])

  return (
    <section
      id="hero"
      style={{
        position: 'relative', width: '100%', height: '100vh', minHeight: 640,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        overflow: 'hidden', background: '#0A0A0A',
      }}
    >
      <HeroCanvas onShockwave={handleShockwave} />

      {/* Сетка-оверлей */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage:
          'linear-gradient(rgba(212,255,0,0.018) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(212,255,0,0.018) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      {/* Нижний градиент */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, transparent, #0A0A0A)',
      }} />

      {/* Контент */}
      <div style={{
        position: 'relative', zIndex: 10,
        padding: '0 clamp(24px, 6vw, 96px)',
        maxWidth: 1200,
      }}>
        {/* Надпись-метка */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}
        >
          <span style={{ display: 'block', width: 32, height: 1, background: '#D4FF00', flexShrink: 0 }} />
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D4FF00',
          }}>
            Senior Full-Stack Инженер
          </span>
        </motion.div>

        {/* Заголовок */}
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 'clamp(3.2rem, 10vw, 8.5rem)',
          lineHeight: 0.92,
          letterSpacing: '-0.02em',
          marginBottom: 36,
          overflow: 'hidden',
        }}>
          <span style={{ display: 'block', color: '#F5F4F2', overflow: 'hidden' }}>
            <KineticText text="Системы" delay={0.2} />
          </span>
          <span style={{ display: 'block', color: '#D4FF00', overflow: 'hidden' }}>
            <KineticText text="Которые Масштабируются." delay={0.38} />
          </span>
        </h1>

        {/* Описание */}
        <motion.p
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: [0.19, 1, 0.22, 1] }}
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(0.95rem, 1.8vw, 1.08rem)',
            color: '#A8A6A2', lineHeight: 1.7,
            maxWidth: 460, marginBottom: 44,
          }}
        >
          Строю распределённые системы и WebGL-интерфейсы при 60fps.<br />
          Кликните на холст — запустите ударную волну.
        </motion.p>

        {/* Кнопки */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95, ease: [0.19, 1, 0.22, 1] }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}
        >
          <button
            onClick={() => { click(); setTerminalOpen(true) }}
            style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
              letterSpacing: '0.08em', padding: '16px 32px', fontWeight: 600,
              background: '#D4FF00', color: '#0A0A0A', border: 'none', cursor: 'pointer',
              clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
            aria-label="Открыть терминал (Cmd+K)"
          >
            Открыть терминал_
          </button>
          <a
            href="#projects"
            onClick={click}
            style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
              letterSpacing: '0.08em', padding: '16px 32px',
              border: '1px solid #2A2A2A', color: '#F5F4F2',
              textDecoration: 'none', transition: 'border-color 0.2s, color 0.2s',
              display: 'inline-flex', alignItems: 'center',
            }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = '#D4FF00'; el.style.color = '#D4FF00' }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = '#2A2A2A'; el.style.color = '#F5F4F2' }}
          >
            Посмотреть работы
          </a>
        </motion.div>
      </div>

      {/* Метрики */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.4 }}
        style={{
          position: 'absolute', bottom: 36, left: 'clamp(24px, 6vw, 96px)',
          display: 'flex', gap: 40, zIndex: 10,
        }}
      >
        {[
          { l: 'Аптайм', v: '99.97%' },
          { l: 'P99 задержка', v: '12ms' },
          { l: 'Событий в день', v: '12M+' },
        ].map((m) => (
          <div key={m.l}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3A3A3A',
            }}>{m.l}</div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 14,
              fontWeight: 700, color: '#D4FF00', marginTop: 4,
            }}>{m.v}</div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
