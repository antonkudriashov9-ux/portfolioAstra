import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useAudio } from '../../hooks/useAudio'

gsap.registerPlugin(ScrollTrigger)

interface Project {
  id: string
  index: string
  title: string
  description: string
  tech: string[]
  metric: string
  metricLabel: string
  accent: string
}

const PROJECTS: Project[] = [
  {
    id: 'p1', index: '01', title: 'EventStream Platform',
    description: 'Real-time event processing pipeline handling 12M events/day with zero data loss. Apache Kafka with consumer lag monitoring and dead-letter queue recovery.',
    tech: ['Kafka','Node.js','Redis','PostgreSQL','K8s'],
    metric: '12M', metricLabel: 'Events / Day', accent: '#D4FF00',
  },
  {
    id: 'p2', index: '02', title: 'Edge Auth System',
    description: 'Global auth middleware at 300+ edge locations. JWT validation, mTLS, and rate limiting at sub-5ms worldwide. Zero-config rollback via feature flags.',
    tech: ['Next.js Edge','JWT','Kong','Redis'],
    metric: '-68%', metricLabel: 'P99 Latency', accent: '#00F0FF',
  },
  {
    id: 'p3', index: '03', title: 'WebGL Portfolio Engine',
    description: 'Custom GLSL particle system with 2200 physics-driven particles, cursor-velocity shockwaves, and kinetic text reveal. 60fps on mid-range mobile.',
    tech: ['Three.js','R3F','GLSL','GSAP','WebGL2'],
    metric: '60fps', metricLabel: 'Mobile Target', accent: '#A855F7',
  },
  {
    id: 'p4', index: '04', title: 'Semantic Search Engine',
    description: 'Hybrid keyword + vector search over 2.1M documents. pgvector IVFFlat indexing, sub-15ms P50, contextual re-ranking via cross-encoder models.',
    tech: ['pgvector','PostgreSQL','Python','FAISS'],
    metric: '2.1M', metricLabel: 'Vectors Indexed', accent: '#10B981',
  },
]

function ProjectCard({ project }: { project: Project }) {
  const { hover } = useAudio()
  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const sRotX = useSpring(rotX, { stiffness: 300, damping: 28 })
  const sRotY = useSpring(rotY, { stiffness: 300, damping: 28 })

  return (
    <motion.div
      style={{
        rotateX: sRotX,
        rotateY: sRotY,
        transformStyle: 'preserve-3d',
        background: '#111111',
        borderColor: '#2A2A2A',
        flexShrink: 0,
        width: 'clamp(300px, 38vw, 440px)',
      }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        rotX.set(((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -6)
        rotY.set(((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  6)
      }}
      onMouseLeave={() => { rotX.set(0); rotY.set(0) }}
      onMouseEnter={hover}
      className="p-8 rounded-2xl border relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-[0.06] pointer-events-none"
        style={{ background: project.accent }}
      />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-5">
          <span className="font-mono text-xs tracking-widest" style={{ color: project.accent }}>{project.index}</span>
          <div className="text-right">
            <div className="font-mono font-bold leading-none" style={{ fontSize: 'clamp(1.6rem,3vw,2rem)', color: project.accent }}>{project.metric}</div>
            <div className="font-mono tracking-widest uppercase mt-1" style={{ fontSize: '8px', color: '#444' }}>{project.metricLabel}</div>
          </div>
        </div>
        <h3 className="font-bold mb-3 leading-tight" style={{ fontSize: 'clamp(1rem,1.6vw,1.2rem)', color: '#F5F4F2' }}>{project.title}</h3>
        <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: '#A8A6A2' }}>{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span key={t} className="font-mono border" style={{ fontSize: '9px', letterSpacing: '0.07em', padding: '2px 6px', color: '#555', borderColor: '#252525', textTransform: 'uppercase' }}>{t}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function ProjectsTrack() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return

    const ctx = gsap.context(() => {
      // Wait one frame so layout is settled
      ScrollTrigger.refresh()
      const totalScroll = track.scrollWidth - section.clientWidth
      if (totalScroll <= 0) return

      gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalScroll}`,
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
    <section
      id="projects"
      ref={sectionRef}
      style={{ background: '#0A0A0A', overflow: 'hidden' }}
    >
      {/* Section header — outside the pinned track so it stays visible */}
      <div className="px-6 md:px-14 pt-24 pb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="block w-8 h-px flex-shrink-0" style={{ background: '#D4FF00' }} />
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: '#D4FF00' }}>Selected Work</span>
        </div>
        <h2 className="font-bold" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#F5F4F2' }}>Projects</h2>
      </div>

      {/* Scrolling track */}
      <div
        ref={trackRef}
        className="flex gap-5 px-6 md:px-14 pb-20"
        style={{ width: 'max-content', willChange: 'transform' }}
      >
        {PROJECTS.map((p) => <ProjectCard key={p.id} project={p} />)}
        {/* Trailing spacer so last card isn't flush to edge */}
        <div style={{ width: '4vw', flexShrink: 0 }} aria-hidden="true" />
      </div>
    </section>
  )
}
