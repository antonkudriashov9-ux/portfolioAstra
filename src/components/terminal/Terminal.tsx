import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { useAudio } from '../../hooks/useAudio'

const BANNER = `
 ___   _  _____  ____  ____   ___
/ _ \ | |/ / __||  _ \|___ \ / _ \
| |_| || ' /| |_ | |_) | __) | | | |
|  _  || . \|  _||  _ < / __/| |_| |
|_| |_||_|\_\_|  |_| \_\_____|\___/

  astra-shell v2.4.1  |  Cmd+K to toggle
  Type "help" for available commands.
`.trim()

const PROMPT = 'anton@astra:~$ '

const GIT_LOG = `* a3f82c1 (HEAD -> main) feat: add Kafka consumer lag monitoring
* 9d2e41b perf: Redis cache hit rate 94% - reduced DB round trips
* c7f19a3 fix: eliminate N+1 query in user feed aggregation
* 4b8e2f0 feat: WebGL particle system with custom GLSL shaders
* 1a9c3d7 refactor: migrate auth to Next.js edge runtime
* f2b8e5a feat: pgvector integration for semantic search
* 88e1d29 ci: zero-downtime blue/green deployment pipeline
* 3c4f910 perf: Web Worker offload for image processing pipeline
* b7a2e18 feat: OpenTelemetry distributed tracing integration
* 9f3c1a2 init: project scaffolding`.trim()

const BENCHMARKS = `BENCHMARK RESULTS  [${new Date().toISOString().split('T')[0]}]
--------------------------------------------------
API Gateway         P50:  6ms   P95: 12ms  P99:  18ms
Redis Cache         P50: 0.4ms  P95: 0.8ms P99: 1.2ms
PostgreSQL Primary  P50:  2ms   P95:  5ms  P99:   9ms
Read Replicas       P50:  1ms   P95:  3ms  P99:   6ms
Vector Search       P50: 10ms   P95: 20ms  P99:  35ms
Edge CDN (EU)       P50:  3ms   P95:  7ms  P99:  11ms
Kafka Produce       P50:  1ms   P95:  3ms  P99:   5ms
--------------------------------------------------
ALL ENDPOINTS WITHIN SLA`.trim()

const SYSTEM_CHECK = `SYSTEM HEALTH CHECK [v2.4.1]
--------------------------------------------------
[OK] Edge Runtime       ... healthy (12 active regions)
[OK] API Gateway        ... healthy (auto-scaled x4)
[OK] Kafka Cluster      ... healthy (consumer lag: 142)
[OK] Redis Primary      ... healthy (memory: 68% used)
[OK] PostgreSQL Primary ... healthy (conn: 47/200)
[OK] Read Replica 1     ... healthy (lag: 18ms)
[OK] Read Replica 2     ... healthy (lag: 22ms)
[OK] Vector DB          ... healthy (2.1M vectors indexed)
[OK] Worker Pool        ... healthy (queue depth: 23)
--------------------------------------------------
OVERALL STATUS: ALL SYSTEMS OPERATIONAL`.trim()

const BIO = `# Anton Kudriashov - Senior Full-Stack Engineer

## About
I architect and build distributed systems that handle millions of
events daily. Specializing in the intersection of high-performance
engineering and exceptional user experiences.

## Stack
- Backend:  Node.js, Bun, Go, Rust (WASM modules)
- Frontend: React 19, Next.js 15, WebGL, GSAP, Three.js
- Data:     PostgreSQL, Redis, Apache Kafka, Pinecone
- Infra:    Kubernetes, Terraform, AWS, Vercel Edge

## Highlights
- Reduced P99 API latency by 68% via Redis + edge caching
- Engineered Kafka pipeline handling 12M events/day at zero loss
- Shipped WebGL portfolio with custom GLSL shaders
- Zero-downtime blue/green deploys across 4 microservices

## Contact
Email:  anton@astra.dev
GitHub: github.com/antonkudriashov9-ux`.trim()

const CONTACT = `HTTP/1.1 200 OK
Content-Type: application/json
X-Request-Id: req_01JF4K2M8XVNP3Q7

{
  "status": "success",
  "message": "Contact request received",
  "data": {
    "email": "anton@astra.dev",
    "response_sla": "24h",
    "availability": "open_to_opportunities",
    "timezone": "UTC+3",
    "preferred": "email"
  }
}`.trim()

const HIRE_ME = `
+----------------------------------------+
|  ACCESS GRANTED: sudo hire-me          |
|                                        |
|  Checking availability ... [OPEN]      |
|  Verifying skills     ... [EXCEPTIONAL]|
|  Reference check      ... [GLOWING]    |
|                                        |
|  STATUS: Ready to ship on Day 1.       |
|  CONTACT: anton@astra.dev              |
+----------------------------------------+`.trim()

const PROJECTS = `PROJECTS --filter=distributed

[1] EventStream Platform
    Stack:  Kafka + Node.js + Redis + PostgreSQL
    Scale:  12M events/day, zero data loss
    Status: Production (18 months, 99.97% uptime)

[2] Realtime Analytics Engine
    Stack:  ClickHouse + Kafka + React + WebSockets
    Scale:  500K concurrent connections
    Status: Production (Blue/Green deployed)

[3] Distributed Job Scheduler
    Stack:  BullMQ + Redis Cluster + Kubernetes
    Scale:  10K jobs/min, cross-region failover
    Status: Open Source

[4] Edge Auth Middleware
    Stack:  Next.js Edge + JWT + mTLS + Kong
    Scale:  500K req/s at 4ms P50 globally
    Status: Production`.trim()

type LineType = 'banner' | 'input' | 'output' | 'error'
interface Line { id: number; type: LineType; content: string }

const COMMANDS: Record<string, string> = {
  help: `AVAILABLE COMMANDS:
  help                       show this help
  cat bio.md                 personal background and stack
  projects --filter=distributed  distributed systems projects
  system-check               live system health check
  curl /api/contact          contact API endpoint
  git log --graph            commit history
  benchmarks                 performance benchmark results
  sudo hire-me               initiate hire sequence
  whoami                     current user info
  clear                      clear terminal`,
  'cat bio.md': BIO,
  'projects --filter=distributed': PROJECTS,
  'system-check': SYSTEM_CHECK,
  'curl /api/contact': CONTACT,
  'git log --graph': GIT_LOG,
  benchmarks: BENCHMARKS,
  'sudo hire-me': HIRE_ME,
  whoami: 'anton - Senior Full-Stack Engineer | astra.dev',
}

const ALL_CMDS = Object.keys(COMMANDS)
let _id = 0
const uid = () => ++_id

export default function Terminal() {
  const open = useStore((s) => s.terminalOpen)
  const setOpen = useStore((s) => s.setTerminalOpen)
  const { click } = useAudio()

  const [lines, setLines] = useState<Line[]>([
    { id: uid(), type: 'banner', content: BANNER },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const [hints, setHints] = useState<string[]>([])

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const exec = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase()
      click()
      setLines((prev) => [
        ...prev,
        { id: uid(), type: 'input', content: PROMPT + raw },
      ])
      if (!cmd) return
      setHistory((h) => [raw, ...h])
      setHistIdx(-1)
      setHints([])

      if (cmd === 'clear') {
        setLines([{ id: uid(), type: 'banner', content: BANNER }])
        return
      }

      const out = COMMANDS[cmd]
      if (out !== undefined) {
        setLines((prev) => [
          ...prev,
          { id: uid(), type: 'output', content: out },
        ])
      } else {
        setLines((prev) => [
          ...prev,
          {
            id: uid(),
            type: 'error',
            content: `command not found: ${cmd}\nType "help" for available commands.`,
          },
        ])
      }
    },
    [click],
  )

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        exec(input)
        setInput('')
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const next = Math.min(histIdx + 1, history.length - 1)
        setHistIdx(next)
        setInput(history[next] ?? '')
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = Math.max(histIdx - 1, -1)
        setHistIdx(next)
        setInput(next === -1 ? '' : history[next] ?? '')
      } else if (e.key === 'Tab') {
        e.preventDefault()
        const matches = ALL_CMDS.filter((c) => c.startsWith(input.toLowerCase()))
        if (matches.length === 1) {
          setInput(matches[0])
          setHints([])
        } else {
          setHints(matches)
        }
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    },
    [exec, input, histIdx, history, setOpen],
  )

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90]"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            key="terminal"
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.19, 1, 0.22, 1] }}
            className="fixed top-0 left-0 right-0 z-[91] mx-auto"
            style={{ maxWidth: '880px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title bar */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ background: '#1A1A1A', borderColor: '#2A2A2A' }}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="w-3 h-3 rounded-full transition-opacity hover:opacity-75"
                  style={{ background: '#FF5F57' }}
                  aria-label="Close"
                />
                <div className="w-3 h-3 rounded-full" style={{ background: '#FEBC2E' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#28C840' }} />
              </div>
              <span className="font-mono text-xs" style={{ color: '#333' }}>
                astra-shell - bash
              </span>
              <button
                onClick={() => setOpen(false)}
                className="transition-colors"
                style={{ color: '#333' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#F5F4F2' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#333' }}
                aria-label="Close terminal"
              >
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div
              className="overflow-y-auto p-5 font-mono"
              style={{
                background: '#0A0A0A',
                maxHeight: '72vh',
                fontSize: '13px',
                lineHeight: '1.75',
                color: '#F5F4F2',
              }}
              data-lenis-prevent
            >
              {lines.map((line) => (
                <div key={line.id} className="whitespace-pre-wrap">
                  {line.type === 'banner' && (
                    <span style={{ color: '#D4FF00' }}>{line.content + '\n\n'}</span>
                  )}
                  {line.type === 'input' && (
                    <span style={{ color: '#555' }}>{line.content + '\n'}</span>
                  )}
                  {line.type === 'output' && (
                    <span style={{ color: '#F5F4F2' }}>{line.content + '\n\n'}</span>
                  )}
                  {line.type === 'error' && (
                    <span style={{ color: '#FF5F57' }}>{line.content + '\n\n'}</span>
                  )}
                </div>
              ))}

              {hints.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-2">
                  {hints.map((h) => (
                    <span
                      key={h}
                      className="px-2 py-0.5 rounded text-xs"
                      style={{ background: '#1A1A1A', color: '#D4FF00' }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center">
                <span style={{ color: '#D4FF00' }}>{PROMPT}</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setHints([]) }}
                  onKeyDown={onKeyDown}
                  className="flex-1 bg-transparent outline-none border-none"
                  style={{
                    color: '#F5F4F2',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    caretColor: '#D4FF00',
                  }}
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="none"
                  aria-label="Terminal command input"
                />
              </div>
              <div ref={bottomRef} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
