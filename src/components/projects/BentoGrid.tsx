import { motion } from 'framer-motion'
import { useAudio } from '../../hooks/useAudio'

const ITEMS = [
  {
    id: 'b1',
    cols: 'md:col-span-2',
    tag: 'Infrastructure',
    title: 'Blue/Green Deployment Pipeline',
    description:
      'Zero-downtime deploys across 4 microservices with automated smoke tests, canary traffic shifting via feature flags, and instant rollback in under 30 seconds.',
    metrics: ['Zero downtime', '99.97% uptime', '4 services'],
    accent: '#D4FF00',
  },
  {
    id: 'b2',
    cols: 'md:col-span-1',
    tag: 'Performance',
    title: 'N+1 Query Elimination',
    description:
      'Identified and resolved N+1 patterns across ORM layer using DataLoader batching - reducing database round-trips by 94%.',
    metrics: ['-94% DB calls', '3ms avg P50'],
    accent: '#00F0FF',
  },
  {
    id: 'b3',
    cols: 'md:col-span-1',
    tag: 'Frontend',
    title: 'Web Worker Image Pipeline',
    description:
      'Moved EXIF parsing and thumbnail generation to dedicated Web Workers. Zero main-thread jank on upload flows regardless of file size.',
    metrics: ['0ms jank', 'Worker offload'],
    accent: '#A855F7',
  },
  {
    id: 'b4',
    cols: 'md:col-span-1',
    tag: 'Observability',
    title: 'OpenTelemetry Tracing',
    description:
      'Distributed tracing across all microservices with sub-millisecond instrumentation overhead and full Jaeger visualization.',
    metrics: ['<1ms overhead', 'Full stack trace'],
    accent: '#FF6B35',
  },
  {
    id: 'b5',
    cols: 'md:col-span-2',
    tag: 'Rust / WASM',
    title: 'Rust WASM Crypto Module',
    description:
      'Replaced JS crypto with Rust compiled to WebAssembly. 8x throughput improvement on signature verification with an identical TypeScript API surface and zero breaking changes.',
    metrics: ['8x faster', 'WASM runtime', 'Same API surface'],
    accent: '#10B981',
  },
]

function Card({ item, index }: { item: typeof ITEMS[0]; index: number }) {
  const { hover } = useAudio()
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.19, 1, 0.22, 1] }}
      onMouseEnter={hover}
      className={`${item.cols} relative p-6 md:p-8 rounded-2xl border overflow-hidden group`}
      style={{ background: '#111111', borderColor: '#2A2A2A' }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 0% 0%, ${item.accent}09 0%, transparent 65%)`,
        }}
      />
      <div
        className="inline-block font-mono text-[9px] tracking-widest uppercase px-2 py-1 mb-4 border"
        style={{ borderColor: `${item.accent}35`, color: item.accent }}
      >
        {item.tag}
      </div>
      <h3 className="text-lg font-bold mb-3 leading-tight" style={{ color: '#F5F4F2' }}>
        {item.title}
      </h3>
      <p className="text-sm leading-relaxed mb-5" style={{ color: '#A8A6A2' }}>
        {item.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {item.metrics.map((m) => (
          <span
            key={m}
            className="font-mono text-xs font-semibold px-3 py-1 rounded"
            style={{ background: `${item.accent}14`, color: item.accent }}
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
    <section className="py-32 px-6 md:px-14" style={{ background: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-8 h-px" style={{ background: '#D4FF00' }} />
            <span className="font-mono text-xs tracking-widest uppercase" style={{ color: '#D4FF00' }}>
              Proof of Work
            </span>
          </div>
          <h2
            className="font-bold leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#F5F4F2' }}
          >
            Engineering
            <br />
            <span style={{ color: '#D4FF00' }}>Deep Cuts</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {ITEMS.map((item, i) => (
            <Card key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
