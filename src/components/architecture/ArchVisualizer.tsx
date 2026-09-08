import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from '../../hooks/useAudio'

interface ArchNode { id:string; label:string; tech:string; x:number; y:number; color:string; description:string; latency:string; throughput:string }
interface ArchEdge { from:string; to:string; label:string; dashed?:boolean }

const NODES: ArchNode[] = [
  { id:'edge',    label:'Edge Runtime',  tech:'Next.js / Vercel',    x:50, y:9,  color:'#D4FF00', description:'Global CDN at 300+ PoPs. Auth middleware, rate limiting, geo-routing at sub-5ms globally.',                                latency:'4ms',    throughput:'500K req/s' },
  { id:'gateway', label:'API Gateway',   tech:'Kong / AWS API GW',   x:50, y:25, color:'#00F0FF', description:'L7 routing with JWT validation, mTLS, circuit breaker, and request coalescing for downstream protection.',            latency:'8ms',    throughput:'200K req/s' },
  { id:'kafka',   label:'Event Bus',     tech:'Apache Kafka',         x:18, y:50, color:'#FF6B35', description:'Durable event streaming with 7-day retention. Powers async microservice comms and event sourcing.',                     latency:'2ms',    throughput:'12M events/day' },
  { id:'redis',   label:'Cache Layer',   tech:'Redis Cluster',        x:50, y:50, color:'#FF4444', description:'Write-through cache with TTL-based invalidation. 94% hit rate. Pub/Sub for real-time features.',                       latency:'0.5ms',  throughput:'1M ops/s' },
  { id:'workers', label:'Worker Pool',   tech:'Node.js / Bun',        x:82, y:50, color:'#A855F7', description:'Horizontally scaled workers consuming Kafka topics. Handles async jobs, webhooks, email, background tasks.',            latency:'50ms',   throughput:'10K jobs/min' },
  { id:'postgres',label:'Primary DB',    tech:'PostgreSQL 16',         x:34, y:75, color:'#3B82F6', description:'ACID-compliant primary with 2 async replicas. Row-level security, JSONB, pgvector for vector embeddings.',              latency:'3ms',    throughput:'50K queries/s' },
  { id:'replica', label:'Read Replicas', tech:'PG Streaming',          x:66, y:75, color:'#2563EB', description:'Async streaming replication with <100ms lag. Load-balanced via PgBouncer connection pooling.',                         latency:'<1ms lag',throughput:'150K reads/s' },
  { id:'vector',  label:'Vector DB',     tech:'Pinecone / pgvector',   x:50, y:92, color:'#10B981', description:'ANN search over 2.1M vectors. Powers semantic search, recommendations, and hybrid queries.',                           latency:'15ms',   throughput:'10K searches/s' },
]

const EDGES: ArchEdge[] = [
  { from:'edge',    to:'gateway',  label:'HTTPS/2' },
  { from:'gateway', to:'kafka',    label:'Produce',   dashed:true },
  { from:'gateway', to:'redis',    label:'Cache' },
  { from:'gateway', to:'workers',  label:'Delegate',  dashed:true },
  { from:'kafka',   to:'workers',  label:'Consume' },
  { from:'redis',   to:'postgres', label:'Miss' },
  { from:'workers', to:'postgres', label:'Write' },
  { from:'postgres',to:'replica',  label:'Replicate' },
  { from:'postgres',to:'vector',   label:'Embed',     dashed:true },
]

const SIM_PATHS = [
  ['edge','gateway','redis'],
  ['edge','gateway','redis','postgres'],
  ['edge','gateway','kafka','workers','postgres'],
]

const nodeById = (id: string) => NODES.find((n) => n.id === id)

export default function ArchVisualizer() {
  const [activeNode, setActiveNode] = useState<ArchNode | null>(null)
  const [simPath, setSimPath]       = useState<string[]>([])
  const [pingMap, setPingMap]       = useState<Record<string,number>>({})
  const { click, sweep } = useAudio()
  const simTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const runSim = useCallback((clickedId: string) => {
    const path = SIM_PATHS.find((p) => p.includes(clickedId)) ?? SIM_PATHS[Math.floor(Math.random() * SIM_PATHS.length)]
    setSimPath([])
    path.forEach((nodeId, i) => {
      setTimeout(() => {
        setSimPath((prev) => [...prev, nodeId])
        sweep(100 + i * 60)
        setPingMap((prev) => ({ ...prev, [nodeId]: Math.floor(Math.random() * 10 + 2) }))
      }, i * 400)
    })
    if (simTimerRef.current) clearTimeout(simTimerRef.current)
    simTimerRef.current = setTimeout(() => setSimPath([]), path.length * 400 + 700)
  }, [sweep])

  const handleNodeClick = useCallback((node: ArchNode) => {
    click()
    setActiveNode((prev) => prev?.id === node.id ? null : node)
    runSim(node.id)
  }, [click, runSim])

  useEffect(() => {
    const iv = setInterval(() => {
      setPingMap((prev) => {
        const next = { ...prev }
        for (const k of Object.keys(next)) next[k] = Math.max(1, next[k] + Math.floor(Math.random() * 5 - 2))
        return next
      })
    }, 1800)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => () => { if (simTimerRef.current) clearTimeout(simTimerRef.current) }, [])

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-14">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="block w-8 h-px flex-shrink-0" style={{ background:'#D4FF00' }} />
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color:'#D4FF00' }}>Architecture</span>
        </div>
        <h2 className="font-bold leading-tight mb-4" style={{ fontSize:'clamp(2rem,5vw,3.5rem)', color:'#F5F4F2' }}>
          Distributed System <span style={{ color:'#D4FF00' }}>Architecture</span>
        </h2>
        <p style={{ fontSize:'clamp(0.875rem,1.6vw,1rem)', color:'#A8A6A2', maxWidth:'36rem' }}>
          Click any node to inspect its role and trigger a live request lifecycle simulation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* SVG Graph */}
        <div
          className="rounded-2xl overflow-hidden border"
          style={{ background:'#0E0E0E', borderColor:'#242424' }}
        >
          <svg
            viewBox="0 0 100 100"
            style={{ width:'100%', height:'auto', aspectRatio:'1.4/1' }}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="System architecture diagram — click nodes to interact"
          >
            <defs>
              <pattern id="ag" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M10 0L0 0 0 10" fill="none" stroke="#1A1A1A" strokeWidth="0.15"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#ag)"/>

            {EDGES.map((edge, i) => {
              const fn = nodeById(edge.from); const tn = nodeById(edge.to)
              if (!fn || !tn) return null
              const isActive = simPath.includes(edge.from) && simPath.includes(edge.to)
              const mx = (fn.x + tn.x) / 2; const my = (fn.y + tn.y) / 2
              return (
                <g key={i}>
                  <line x1={fn.x} y1={fn.y} x2={tn.x} y2={tn.y}
                    stroke={isActive ? fn.color : '#2A2A2A'}
                    strokeWidth={isActive ? '0.55' : '0.22'}
                    strokeDasharray={edge.dashed ? '1.8 1' : undefined}
                    style={{ transition:'stroke 0.28s,stroke-width 0.28s' }}
                  />
                  <text x={mx} y={my - 1.2} textAnchor="middle"
                    style={{ fontSize:'1.6px', fill:'#383838', fontFamily:'JetBrains Mono,monospace' }}
                  >{edge.label}</text>
                </g>
              )
            })}

            {NODES.map((node) => {
              const isActive = activeNode?.id === node.id
              const inPath   = simPath.includes(node.id)
              return (
                <g key={node.id} onClick={() => handleNodeClick(node)}
                  style={{ cursor:'pointer' }} role="button" tabIndex={0}
                  aria-label={`Inspect ${node.label}`}
                  onKeyDown={(e) => { if (e.key==='Enter'||e.key===' ') handleNodeClick(node) }}
                >
                  {(isActive || inPath) && (
                    <circle cx={node.x} cy={node.y} r="7.2"
                      fill="none" stroke={node.color} strokeWidth="0.35" opacity="0.28"
                    />
                  )}
                  <rect
                    x={node.x-8} y={node.y-4.5} width="16" height="9" rx="1.2"
                    fill={isActive||inPath ? '#1E1E1E' : '#171717'}
                    stroke={isActive||inPath ? node.color : '#282828'}
                    strokeWidth={isActive ? '0.55' : '0.22'}
                    style={{ transition:'all 0.28s' }}
                  />
                  <circle cx={node.x-6} cy={node.y} r="1"
                    fill={inPath ? node.color : '#383838'}
                    style={{ transition:'fill 0.22s' }}
                  />
                  <text x={node.x-3.8} y={node.y-0.8}
                    style={{ fontSize:'2.4px', fill:isActive||inPath?'#F5F4F2':'#A8A6A2', fontFamily:"Space Grotesk,sans-serif", fontWeight:'600', transition:'fill 0.28s' }}
                  >{node.label}</text>
                  <text x={node.x-3.8} y={node.y+2}
                    style={{ fontSize:'1.7px', fill:node.color, fontFamily:'JetBrains Mono,monospace', opacity:0.82 }}
                  >{node.tech}</text>
                  {pingMap[node.id] !== undefined && (
                    <text x={node.x+7.5} y={node.y-2.5} textAnchor="end"
                      style={{ fontSize:'1.6px', fill:'#D4FF00', fontFamily:'JetBrains Mono,monospace' }}
                    >{pingMap[node.id]}ms</text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* Inspector + lifecycle log */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {activeNode ? (
              <motion.div key={activeNode.id}
                initial={{ opacity:0, x:14 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:14 }}
                transition={{ duration:0.28, ease:[0.19,1,0.22,1] }}
                className="p-5 rounded-2xl border"
                style={{ background:'#111111', borderColor:'#222222' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-mono tracking-widest uppercase mb-1" style={{ fontSize:'9px', color:activeNode.color }}>Node Inspector</div>
                    <h3 className="text-xl font-bold" style={{ color:'#F5F4F2' }}>{activeNode.label}</h3>
                    <div className="font-mono text-sm mt-0.5" style={{ color:'#787672' }}>{activeNode.tech}</div>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ background:activeNode.color }} />
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color:'#A8A6A2' }}>{activeNode.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  {[{label:'P99 Latency',value:activeNode.latency},{label:'Throughput',value:activeNode.throughput}].map((m) => (
                    <div key={m.label} className="p-3 rounded-xl border" style={{ background:'#181818', borderColor:'#222222' }}>
                      <div className="font-mono tracking-widest uppercase mb-1" style={{ fontSize:'8px', color:'#383838' }}>{m.label}</div>
                      <div className="font-mono font-bold text-base" style={{ color:activeNode.color }}>{m.value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="idle" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="p-5 rounded-2xl border flex items-center justify-center text-center"
                style={{ background:'#111111', borderColor:'#1A1A1A', minHeight:'180px' }}
              >
                <div>
                  <div className="font-mono tracking-widest uppercase mb-2" style={{ fontSize:'9px', color:'#2A2A2A' }}>Node Inspector</div>
                  <p style={{ fontSize:'13px', color:'#2A2A2A' }}>Click any node to inspect and simulate a request lifecycle.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-4 rounded-2xl border font-mono" style={{ background:'#0D0D0D', borderColor:'#1A1A1A', fontSize:'12px' }}>
            <div className="tracking-widest uppercase mb-3" style={{ fontSize:'8px', color:'#272727' }}>Request Lifecycle</div>
            <AnimatePresence>
              {simPath.length > 0 ? simPath.map((id, i) => {
                const n = nodeById(id)
                return (
                  <motion.div key={`${id}-${i}`}
                    initial={{ opacity:0, x:-5 }} animate={{ opacity:1, x:0 }}
                    className="flex items-center gap-2 py-[3px]"
                    style={{ color:n?.color??'#A8A6A2' }}
                  >
                    <span style={{ color:'#D4FF00' }}>{String(i+1).padStart(2,'0')}</span>
                    <span>{n?.label??id}</span>
                    <span className="ml-auto" style={{ color:'#333' }}>{pingMap[id]}ms</span>
                  </motion.div>
                )
              }) : <div style={{ color:'#252525' }}>{'> Awaiting simulation...'}</div>}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
