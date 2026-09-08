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
    id: 'p1',
    index: '01',
    title: 'EventStream Platform',
    description:
      'Real-time event processing pipeline handling 12M events/day with zero data loss. Built on Apache Kafka with consumer lag monitoring and dead-letter queue recovery.',
    tech: ['Kafka', 'Node.js', 'Redis', 'PostgreSQL', 'K8s'],
    metric: '12M',
    metricLabel: 'Events / Day',
    accent: '#D4FF00',
  },
  {
    id: 'p2',
    index: '02',
    title: 'Edge Auth System',
    description:
      'Global auth middleware at 300+ edge locations. JWT validation, mTLS, and rate limiting with sub-5ms response times worldwide. Zero-config rollback via feature flags.',
    tech: ['Next.js Edge', 'JWT', 'Kong', 'Redis'],
    metric: '-68%',
    metricLabel: 'P99 Latency',
    accent: '#00F0FF',
  },
  {
    id: 'p3',
    index: '03',
    title: 'WebGL Portfolio Engine',
    description:
      'Custom GLSL particle system with 2500 physics-driven particles, cursor-velocity shockwaves, and kinetic text reveal. 60fps on mid-range mobile with graceful degradation.',
    tech: ['Three.js', 'R3F', 'GLSL', 'GSAP', 'WebGL2'],
    metric: '60fps',
    metricLabel: 'Mobile Target',
    accent: '#A855F7',
  },
  {
    id: 'p4',
    index: '04',
    title: 'Semantic Search Engine',
    description:
      'Hybrid keyword + vector search over 2.1M documents. pgvector with IVFFlat indexing, sub-15ms P50, and contextual re-ranking via cross-encoder models.',
    tech: ['pgvector', 'PostgreSQL', 'Python', 'FAISS'],
    metric: '2.1M',
    metricLabel: 'Vectors Indexed',
    accent: '#10B981',
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
      }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        rotX.set(((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -7)
        rotY.set(((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 7)
      }}
      onMouseLeave={() => {
        rotX.set(0)
        rotY.set(0)
      }}
      onMouseEnter={hover}
      className="flex-shrink-0 w-[380px] md:w-[440px] p-8 rounded-2xl border relative overflow-hidden"
    >
      {/* Accent glow */}
      <div
        className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-[0.07] pointer-events-none"
        style={{ background: project.accent }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <span
            className="font-mono text-xs tracking-widest"
            style={{ color: project.accent }}
          >
            {project.index}
          </span>
          <div className="text-right">
            <div
              className="font-mono text-3xl font-bold leading-none"
              style={{ color: project.accent }}
            >
              {project.metric}
            </div>
            <div
              className="font-mono tracking-widest uppercase mt-1"
              style={{ fontSize: '9px', color: '#333' }}
            >
              {project.metricLabel}
            </div>
          </div>
        </div>

        <h3
          className="text-xl font-bold mb-3 leading-tight"
          style={{ color: '#F5F4F2' }}
        >
          {project.title}
        </h3>

        <p
          className="text-sm leading-relaxed mb-6 flex-1"
          style={{ color: '#A8A6A2' }}
        >
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="font-mono uppercase border"
              style={{
                fontSize: '10px',
                letterSpacing: '0.08em',
                padding: '3px 8px',
                color: '#555',
                borderColor: '#2A2A2A',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function ProjectsTrack() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const totalScroll = track.scrollWidth - track.clientWidth

      gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalScroll + window.innerHeight * 0.5}`,
          scrub: 1.2,
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
      className="overflow-hidden"
      style={{ background: '#0A0A0A' }}
    >
      <div className="px-6 md:px-14 pt-24 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="block w-8 h-px" style={{ background: '#D4FF00' }} />
          <span
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: '#D4FF00' }}
          >
            Selected Work
          </span>
        </div>
        <h2
          className="font-bold leading-tight"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#F5F4F2' }}
        >
          Projects
        </h2>
      </div>

      <div
        ref={trackRef}
        className="flex gap-6 px-6 md:px-14 pb-24 pt-8"
        style={{ width: 'max-content', willChange: 'transform' }}
      >
        {PROJECTS.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  )
}
