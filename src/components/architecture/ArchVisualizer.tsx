import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from '../../hooks/useAudio'

const NODES = [
  { id: 'edge',     label: 'Edge Runtime',  tech: 'Next.js / Vercel',    x: 50, y: 8,  color: '#D4FF00', latency: '4ms',    throughput: '500K req/s',    description: 'Глобальная CDN в 300+ точках присутствия. Auth-middleware, rate limiting, гео-роутинг с задержкой менее 5ms по всему миру.' },
  { id: 'gateway',  label: 'API Gateway',   tech: 'Kong / AWS API GW',   x: 50, y: 26, color: '#00F0FF', latency: '8ms',    throughput: '200K req/s',    description: 'L7-роутинг с JWT-валидацией, mTLS, circuit breaker и коалесцированием запросов.' },
  { id: 'kafka',    label: 'Event Bus',     tech: 'Apache Kafka',         x: 18, y: 50, color: '#FF6B35', latency: '2ms',    throughput: '12M событий/д', description: 'Надёжный стриминг событий, хранение 7 дней, асинхронная коммуникация между сервисами.' },
  { id: 'redis',    label: 'Cache Layer',   tech: 'Redis Cluster',        x: 50, y: 50, color: '#FF4444', latency: '0.5ms',  throughput: '1M ops/s',      description: 'Write-through кэш, TTL-инвалидация, hit rate 94%. Pub/Sub для real-time функций.' },
  { id: 'workers',  label: 'Worker Pool',   tech: 'Node.js / Bun',        x: 82, y: 50, color: '#A855F7', latency: '50ms',   throughput: '10K задач/мин', description: 'Горизонтально масштабируемые воркеры, потребляющие Kafka. Async-задачи, вебхуки, email.' },
  { id: 'postgres', label: 'Primary DB',    tech: 'PostgreSQL 16',         x: 34, y: 76, color: '#3B82F6', latency: '3ms',    throughput: '50K запросов/с', description: 'ACID-совместимая первичная БД, 2 async-реплики, RLS, JSONB, pgvector.' },
  { id: 'replica',  label: 'Read Replicas', tech: 'PG Streaming',          x: 66, y: 76, color: '#2563EB', latency: '<1ms',   throughput: '150K чтений/с', description: 'Async-репликация, лаг менее 100ms, пулинг соединений через PgBouncer.' },
  { id: 'vector',   label: 'Vector DB',     tech: 'pgvector / Pinecone',   x: 50, y: 93, color: '#10B981', latency: '15ms',   throughput: '10K поисков/с', description: 'ANN-поиск по 2.1M векторов, семантический поиск, рекомендации.' },
]

const EDGES = [
  { from: 'edge',    to: 'gateway', label: 'HTTPS/2' },
  { from: 'gateway', to: 'kafka',   label: 'Produce', dashed: true },
  { from: 'gateway', to: 'redis',   label: 'Cache' },
  { from: 'gateway', to: 'workers', label: 'Delegate', dashed: true },
  { from: 'kafka',   to: 'workers', label: 'Consume' },
  { from: 'redis',   to: 'postgres', label: 'Miss' },
  { from: 'workers', to: 'postgres', label: 'Write' },
  { from: 'postgres', to: 'replica', label: 'Replicate' },
  { from: 'postgres', to: 'vector',  label: 'Embed', dashed: true },
]

const PATHS = [
  ['edge', 'gateway', 'redis'],
  ['edge', 'gateway', 'redis', 'postgres'],
  ['edge', 'gateway', 'kafka', 'workers', 'postgres'],
]

const nodeById = (id: string) => NODES.find((n) => n.id === id)

export default function ArchVisualizer() {
  const [active, setActive] = useState<typeof NODES[0] | null>(null)
  const [sim, setSim] = useState<string[]>([])
  const [pings, setPings] = useState<Record<string, number>>({})
  const { click, sweep } = useAudio()
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const runSim = useCallback((id: string) => {
    const path = PATHS.find((p) => p.includes(id)) ?? PATHS[0]
    setSim([])
    const tids = path.map((nid, i) =>
      setTimeout(() => {
        setSim((prev) => [...prev, nid])
        sweep(100 + i * 55)
        setPings((prev) => ({ ...prev, [nid]: Math.floor(Math.random() * 10 + 2) }))
      }, i * 400),
    )
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setSim([]), path.length * 400 + 900)
    return () => tids.forEach(clearTimeout)
  }, [sweep])

  const onNode = useCallback((n: typeof NODES[0]) => {
    click()
    setActive((prev) => (prev?.id === n.id ? null : n))
    runSim(n.id)
  }, [click, runSim])

  useEffect(() => {
    const iv = setInterval(() => setPings((p) => {
      const next = { ...p }
      for (const k of Object.keys(next)) next[k] = Math.max(1, next[k] + Math.floor(Math.random() * 5 - 2))
      return next
    }), 1800)
    return () => { clearInterval(iv); if (timer.current) clearTimeout(timer.current) }
  }, [])

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(24px,6vw,96px)' }}>
      {/* Шапка */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ width: 32, height: 1, background: '#D4FF00', flexShrink: 0 }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D4FF00' }}>Архитектура</span>
        </div>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#F5F4F2', lineHeight: 1.05 }}>
          Распределённая Система
          <br /><span style={{ color: '#D4FF00' }}>Архитектура</span>
        </h2>
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, color: '#A8A6A2', maxWidth: 480, marginTop: 12 }}>
          Нажмите на любой узел, чтобы симулировать жизненный цикл запроса с телеметрией в реальном времени.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 24, alignItems: 'start' }}>
        {/* SVG граф */}
        <div style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: 16, overflow: 'hidden' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: 'auto', aspectRatio: '4/3' }}
               preserveAspectRatio="xMidYMid meet" role="img" aria-label="Диаграмма архитектуры">
            <defs>
              <pattern id="g2" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M10 0L0 0 0 10" fill="none" stroke="#191919" strokeWidth="0.15" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#g2)" />

            {EDGES.map((e, i) => {
              const f = nodeById(e.from), t = nodeById(e.to)
              if (!f || !t) return null
              const lit = sim.includes(e.from) && sim.includes(e.to)
              return (
                <g key={i}>
                  <line x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                    stroke={lit ? f.color : '#252525'} strokeWidth={lit ? '0.55' : '0.2'}
                    strokeDasharray={e.dashed ? '1.5 1' : undefined}
                    style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }} />
                  <text x={(f.x + t.x) / 2} y={(f.y + t.y) / 2 - 1.2} textAnchor="middle"
                    style={{ fontSize: '1.3px', fill: '#2E2E2E', fontFamily: 'JetBrains Mono, monospace' }}>
                    {e.label}
                  </text>
                </g>
              )
            })}

            {NODES.map((n) => {
              const isActive = active?.id === n.id
              const inSim = sim.includes(n.id)
              return (
                <g key={n.id} onClick={() => onNode(n)} style={{ cursor: 'pointer' }}
                   role="button" tabIndex={0} aria-label={`Инспектировать ${n.label}`}
                   onKeyDown={(ev) => { if (ev.key === 'Enter') onNode(n) }}>
                  {(isActive || inSim) && (
                    <circle cx={n.x} cy={n.y} r="7" fill="none"
                      stroke={n.color} strokeWidth="0.35" opacity="0.3" />
                  )}
                  <rect x={n.x - 7.8} y={n.y - 4.2} width="15.6" height="8.4" rx="1.2"
                    fill={isActive || inSim ? '#1C1C1C' : '#161616'}
                    stroke={isActive || inSim ? n.color : '#252525'}
                    strokeWidth={isActive ? '0.5' : '0.2'}
                    style={{ transition: 'all 0.3s' }} />
                  <circle cx={n.x - 6} cy={n.y} r="1" fill={inSim ? n.color : '#333'}
                    style={{ transition: 'fill 0.25s' }} />
                  <text x={n.x - 3.8} y={n.y - 1}
                    style={{ fontSize: '2.2px', fill: isActive || inSim ? '#F5F4F2' : '#A0A0A0', fontFamily: 'Space Grotesk, sans-serif', fontWeight: '600', transition: 'fill 0.3s' }}>
                    {n.label}
                  </text>
                  <text x={n.x - 3.8} y={n.y + 2}
                    style={{ fontSize: '1.6px', fill: n.color, opacity: 0.85, fontFamily: 'JetBrains Mono, monospace' }}>
                    {n.tech}
                  </text>
                  {pings[n.id] !== undefined && (
                    <text x={n.x + 6.8} y={n.y - 2} textAnchor="end"
                      style={{ fontSize: '1.5px', fill: '#D4FF00', fontFamily: 'JetBrains Mono, monospace' }}>
                      {pings[n.id]}ms
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* Панель инспектора */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div key={active.id}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.28 }}
                style={{ padding: 24, background: '#111', border: '1px solid #2A2A2A', borderRadius: 16 }}
              >
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: active.color, marginBottom: 6 }}>Инспектор узла</div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: '#F5F4F2' }}>{active.label}</h3>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#A8A6A2', marginBottom: 16 }}>{active.tech}</div>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, color: '#A8A6A2', lineHeight: 1.6, marginBottom: 20 }}>{active.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[{ l: 'P99 задержка', v: active.latency }, { l: 'Пропускная способность', v: active.throughput }].map((m) => (
                    <div key={m.l} style={{ padding: 14, background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12 }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#333', marginBottom: 6 }}>{m.l}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 700, color: active.color }}>{m.v}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ padding: 24, background: '#111', border: '1px solid #1A1A1A', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200, textAlign: 'center' }}>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, color: '#2A2A2A' }}>
                  Нажмите на узел для инспекции
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Лог жизненного цикла */}
          <div style={{ padding: 16, background: '#0D0D0D', border: '1px solid #1A1A1A', borderRadius: 16, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#252525', marginBottom: 12 }}>Жизненный цикл запроса</div>
            <AnimatePresence>
              {sim.length > 0 ? sim.map((id, i) => {
                const n = nodeById(id)
                return (
                  <motion.div key={`${id}-${i}`} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    style={{ display: 'flex', gap: 8, padding: '3px 0', color: n?.color ?? '#A8A6A2' }}>
                    <span style={{ color: '#D4FF00' }}>{String(i + 1).padStart(2, '0')}</span>
                    <span>{n?.label ?? id}</span>
                    <span style={{ marginLeft: 'auto', color: '#333' }}>{pings[id]}ms</span>
                  </motion.div>
                )
              }) : (
                <div style={{ color: '#252525' }}>{'> Ожидание симуляции...'}</div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
