import Terminal from './components/terminal/Terminal'
import HeroSection from './components/hero/HeroSection'
import ProjectsTrack from './components/projects/ProjectsTrack'
import BentoGrid from './components/projects/BentoGrid'
import ArchVisualizer from './components/architecture/ArchVisualizer'
import DiffViewer from './components/code/DiffViewer'
import RootLayout from './components/layout/RootLayout'
import { useLenis } from './hooks/useLenis'
import { motion } from 'framer-motion'
import { useAudio } from './hooks/useAudio'
import { useStore } from './store/useStore'

function ContactSection() {
  const { click } = useAudio()
  const setTerminalOpen = useStore((s) => s.setTerminalOpen)
  return (
    <section
      id="contact"
      style={{ background: '#0A0A0A', padding: 'clamp(60px,8vw,96px) clamp(24px,6vw,96px)' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          borderRadius: 24, border: '1px solid #1E1E1E',
          background: '#0F0F0F', padding: 'clamp(40px,6vw,80px)',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          {/* Фоновое свечение */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 70% 55% at 50% 110%, rgba(212,255,0,0.07) 0%, transparent 70%)',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Метка */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
              <span style={{ width: 32, height: 1, background: '#D4FF00', flexShrink: 0 }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D4FF00' }}>
                Открыт к предложениям
              </span>
              <span style={{ width: 32, height: 1, background: '#D4FF00', flexShrink: 0 }} />
            </div>

            {/* Заголовок */}
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
              fontSize: 'clamp(2.2rem,6vw,4.5rem)', lineHeight: 1.0,
              color: '#F5F4F2', marginBottom: 20,
            }}>
              Готов к
              <br /><span style={{ color: '#D4FF00' }}>Новым Проектам</span>
            </h2>

            {/* Описание */}
            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(0.9rem,1.8vw,1.05rem)',
              color: '#A8A6A2', lineHeight: 1.7, maxWidth: 420,
              margin: '0 auto 40px',
            }}>
              Строю распределённые системы и исключительные интерфейсы.
              Рассматриваю позиции Senior и Staff Engineer.
            </p>

            {/* Кнопки */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 32 }}
            >
              <a
                href="mailto:anton@astra.dev"
                style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
                  letterSpacing: '0.08em', padding: '16px 36px', fontWeight: 600,
                  background: '#D4FF00', color: '#0A0A0A', textDecoration: 'none',
                  clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))',
                  transition: 'transform 0.2s', display: 'inline-block',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.04)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)' }}
              >
                Написать мне
              </a>
              <a
                href="https://github.com/antonkudriashov9-ux"
                target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
                  letterSpacing: '0.08em', padding: '16px 32px',
                  border: '1px solid #2A2A2A', color: '#A8A6A2',
                  textDecoration: 'none', transition: 'border-color 0.2s, color 0.2s',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = '#D4FF00'; el.style.color = '#D4FF00' }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = '#2A2A2A'; el.style.color = '#A8A6A2' }}
              >
                GitHub
              </a>
              <button
                onClick={() => { click(); setTerminalOpen(true) }}
                style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
                  letterSpacing: '0.08em', padding: '16px 32px',
                  border: '1px solid #2A2A2A', color: '#A8A6A2', background: 'none',
                  cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = '#D4FF00'; el.style.color = '#D4FF00' }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = '#2A2A2A'; el.style.color = '#A8A6A2' }}
              >
                Открыть терминал
              </button>
            </motion.div>

            {/* Статус */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: '#28C840',
                animation: 'pulse 2s ease-in-out infinite', flexShrink: 0,
              }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#444' }}>
                Открыт к новым проектам — отвечу в течение 24 часов
              </span>
            </div>
          </div>
        </div>

        {/* Подвал */}
        <div style={{
          marginTop: 48, paddingTop: 24, borderTop: '1px solid #1A1A1A',
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#2A2A2A' }}>АК.dev 2026</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#2A2A2A' }}>React 18 · Three.js · GSAP · Vercel</span>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  useLenis()
  return (
    <RootLayout>
      <Terminal />
      <main id="main-content">
        <HeroSection />
        <ProjectsTrack />
        <BentoGrid />
        <section id="architecture" style={{ background: '#0A0A0A', padding: 'clamp(60px,8vw,96px) 0' }}>
          <ArchVisualizer />
        </section>
        <section id="code" style={{ background: '#0A0A0A', padding: 'clamp(60px,8vw,96px) 0' }}>
          <DiffViewer />
        </section>
        <ContactSection />
      </main>
    </RootLayout>
  )
}
