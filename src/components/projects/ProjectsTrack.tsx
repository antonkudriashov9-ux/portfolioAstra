import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useAudio } from '../../hooks/useAudio'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    id: 'p1', index: '01', title: 'EventStream Platform',
    description: 'Пайплайн обработки событий в реальном времени — 12M событий/день без потерь данных. Построен на Apache Kafka с мониторингом задержки потребителей и восстановлением через dead-letter queue.',
    tech: ['Kafka', 'Node.js', 'Redis', 'PostgreSQL', 'K8s'],
    metric: '12M', metricLabel: 'Событий / день', accent: '#D4FF00',
  },
  {
    id: 'p2', index: '02', title: 'Edge Auth System',
    description: 'Глобальный auth-middleware на 300+ edge-локациях. JWT-валидация, mTLS и rate limiting с P50 менее 5ms по всему миру. Zero-config откат через feature flags без даунтайма.',
    tech: ['Next.js Edge', 'JWT', 'Kong', 'Redis'],
    metric: '-68%', metricLabel: 'Снижение P99', accent: '#00F0FF',
  },
  {
    id: 'p3', index: '03', title: 'WebGL Portfolio Engine',
    description: 'Кастомная система частиц на GLSL с ударными волнами от движения курсора и кинетическим анимированием текста. Стабильные 60fps на среднем мобильном устройстве с плавной деградацией.',
    tech: ['Three.js', 'R3F', 'GLSL', 'GSAP'],
    metric: '60fps', metricLabel: 'Цель на мобайл', accent: '#A855F7',
  },
  {
    id: 'p4', index: '04', title: 'Semantic Search Engine',
    description: 'Гибридный поиск (ключевые слова + векторы) по 2.1M документам. pgvector с IVFFlat-индексами, P50 менее 15ms и контекстная переранжировка через cross-encoder модели.',
    tech: ['pgvector', 'PostgreSQL', 'Python', 'FAISS'],
    metric: '2.1M', metricLabel: 'Векторов в индексе', accent: '#10B981',
  },
]

function Card({ p }: { p: typeof PROJECTS[0] }) {
  const { hover } = useAudio()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 300, damping: 28 })
  const sry = useSpring(ry, { stiffness: 300, damping: 28 })

  return (
    <motion.article
      style={{
        rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d',
        flexShrink: 0, width: 'clamp(320px, 38vw, 440px)',
        background: '#111111', border: '1px solid #2A2A2A',
        borderRadius: 16, padding: '32px',
        position: 'relative', overflow: 'hidden', cursor: 'default',
      }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        rx.set(((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -6)
        ry.set(((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 6)
      }}
      onMouseLeave={() => { rx.set(0); ry.set(0) }}
      onMouseEnter={hover}
    >
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, right: 0, width: 160, height: 160,
        borderRadius: '50%', filter: 'blur(48px)',
        background: p.accent, opacity: 0.07, pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.18em', color: p.accent }}>{p.index}</span>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 28, fontWeight: 700, lineHeight: 1, color: p.accent }}>{p.metric}</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#444', marginTop: 4 }}>{p.metricLabel}</div>
        </div>
      </div>

      <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: '#F5F4F2', marginBottom: 12, lineHeight: 1.25 }}>{p.title}</h3>
      <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, color: '#A8A6A2', lineHeight: 1.7, marginBottom: 24 }}>{p.description}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {p.tech.map((t) => (
          <span key={t} style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '4px 8px', border: '1px solid #2A2A2A', color: '#555',
          }}>{t}</span>
        ))}
      </div>
    </motion.article>
  )
}

export default function ProjectsTrack() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const gap = track.scrollWidth - section.clientWidth
      gsap.to(track, {
        x: -gap, ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${gap}`,
          scrub: 1.0,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section id="projects" ref={sectionRef} style={{ background: '#0A0A0A', overflow: 'hidden' }}>
      {/* Шапка */}
      <div style={{ padding: 'clamp(60px,8vw,96px) clamp(24px,6vw,96px) 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ width: 32, height: 1, background: '#D4FF00', flexShrink: 0 }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D4FF00' }}>
            Избранные работы
          </span>
        </div>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#F5F4F2', lineHeight: 1.05 }}>
          Проекты
        </h2>
      </div>

      {/* Трек карточек */}
      <div
        ref={trackRef}
        style={{
          display: 'flex', gap: 20,
          padding: '16px clamp(24px,6vw,96px) clamp(60px,8vw,96px)',
          width: 'max-content', willChange: 'transform',
        }}
      >
        {PROJECTS.map((p) => <Card key={p.id} p={p} />)}
      </div>
    </section>
  )
}
