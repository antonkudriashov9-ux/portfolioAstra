import { motion } from 'framer-motion'
import { useAudio } from '../../hooks/useAudio'

const ITEMS = [
  {
    id: 'b1', span: 2,
    tag: 'Infrastructure', accent: '#D4FF00',
    title: 'Blue/Green Deployment Pipeline',
    description: 'Zero-downtime deploys across 4 microservices with automated smoke tests, canary traffic shifting via feature flags, and instant rollback in under 30 seconds.',
    metrics: ['Zero downtime', '99.97% uptime', '4 services'],
  },
  {
    id: 'b2', span: 1,
    tag: 'Performance', accent: '#00F0FF',
    title: 'N+1 Query Elimination',
    description: 'Resolved N+1 patterns via DataLoader batching, cutting database round-trips by 94% and dropping P50 to 3ms.',
    metrics: ['-94% DB calls', '3ms P50'],
  },
  {
    id: 'b3', span: 1,
    tag: 'Frontend', accent: '#A855F7',
    title: 'Web Worker Image Pipeline',
    description: 'EXIF parsing and thumbnail generation moved to Web Workers. Zero main-thread jank on upload flows regardless of file size.',
    metrics: ['0ms jank', 'Worker offload'],
  },
  {
    id: 'b4', span: 1,
    tag: 'Observability', accent: '#FF6B35',
    title: 'OpenTelemetry Tracing',
    description: 'Distributed tracing across all microservices with sub-millisecond overhead and full Jaeger visualization.',
    metrics: ['<1ms overhead', 'Full stack trace'],
  },
  {
    id: 'b5', span: 2,
    tag: 'Rust / WASM', accent: '#10B981',
    title: 'Rust WASM Crypto Module',
    description: 'Replaced JS crypto with Rust compiled to WebAssembly. 8x throughput improvement on signature verification with an identical TypeScript API surface.',
    metrics: ['8x faster', 'WASM runtime', 'Same API'],
  },
] as const

function Card({ item, index }: { item: typeof ITEMS[number]; index: number }) {
  const { hover } = useAudio()
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{ duration: 0.65, delay: index * 0.07, ease: [0.19, 1, 0.22, 1] }}
      onMouseEnter={hover}
      style={{
        gridColumn: `span ${item.span}`,
        background: '#111111',
        borderColor: '#222222',
      }}
      className="relative p-6 md:p-7 rounded-2xl border overflow-hidden group"
    >
      {/* Hover glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 0% 0%,${item.accent}09 0%,transparent 65%)` }}
      />

      <div
        className="inline-flex items-center font-mono tracking-widest uppercase mb-4 px-2 py-0.5 border"
        style={{ fontSize: '9px', borderColor: `${item.accent}40`, color: item.accent }}
      >
        {item.tag}
      </div>

      <h3 className="font-bold mb-2.5 leading-snug" style={{ fontSize: 'clamp(0.95rem,1.4vw,1.1rem)', color: '#F5F4F2' }}>
        {item.title}
      </h3>
      <p className="text-sm leading-relaxed mb-5" style={{ color: '#787672' }}>
        {item.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {item.metrics.map((m) => (
          <span
            key={m}
            className="font-mono text-xs font-semibold px-2.5 py-1 rounded"
            style={{ background: `${item.accent}15`, color: item.accent }}
          >
            {m}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function BentoGrid() {
  return (
    <section className="py-28 px-6 md:px-14" style={{ background: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-8 h-px flex-shrink-0" style={{ background: '#D4FF00' }} />
            <span className="font-mono text-xs tracking-widest uppercase" style={{ color: '#D4FF00' }}>Proof of Work</span>
          </div>
          <h2 className="font-bold leading-tight" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#F5F4F2' }}>
            Engineering
            <br />
            <span style={{ color: '#D4FF00' }}>Deep Cuts</span>
          </h2>
        </div>

        {/* Asymmetric 3-col bento */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
          }}
        >
          {ITEMS.map((item, i) => <Card key={item.id} item={item} index={i} />)}
        </div>
      </div>
    </section>
  )
}
