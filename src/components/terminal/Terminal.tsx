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

  astra-shell v2.4.1  |  Cmd+K — переключить
  Введите «help» для списка команд.
`.trim()

const PROMPT = 'anton@astra:~$ '

const GIT_LOG = `* a3f82c1 (HEAD -> main) feat: мониторинг задержки Kafka consumers
* 9d2e41b perf: Redis hit rate 94% — сокращены обращения к БД
* c7f19a3 fix: устранён N+1 в агрегации user feed
* 4b8e2f0 feat: WebGL частицы с кастомными GLSL шейдерами
* 1a9c3d7 refactor: миграция auth на Next.js edge runtime
* f2b8e5a feat: интеграция pgvector для семантического поиска
* 88e1d29 ci: zero-downtime blue/green деплой пайплайн
* 3c4f910 perf: Web Worker для пайплайна обработки изображений
* b7a2e18 feat: распределённая трассировка OpenTelemetry
* 9f3c1a2 init: инициализация проекта`.trim()

const BENCHMARKS = `РЕЗУЛЬТАТЫ БЕНЧМАРКОВ  [${new Date().toISOString().split('T')[0]}]
--------------------------------------------------
API Gateway         P50:  6ms   P95: 12ms  P99:  18ms
Redis Cache         P50: 0.4ms  P95: 0.8ms P99: 1.2ms
PostgreSQL Primary  P50:  2ms   P95:  5ms  P99:   9ms
Read Replicas       P50:  1ms   P95:  3ms  P99:   6ms
Vector Search       P50: 10ms   P95: 20ms  P99:  35ms
Edge CDN (EU)       P50:  3ms   P95:  7ms  P99:  11ms
Kafka Produce       P50:  1ms   P95:  3ms  P99:   5ms
--------------------------------------------------
ВСЕ ЭНДПОИНТЫ В РАМКАХ SLA`.trim()

const SYSTEM_CHECK = `ПРОВЕРКА СОСТОЯНИЯ СИСТЕМ [v2.4.1]
--------------------------------------------------
[OK] Edge Runtime       ... исправен (12 регионов)
[OK] API Gateway        ... исправен (auto-scaled x4)
[OK] Kafka Cluster      ... исправен (consumer lag: 142)
[OK] Redis Primary      ... исправен (memory: 68%)
[OK] PostgreSQL Primary ... исправен (conn: 47/200)
[OK] Read Replica 1     ... исправен (lag: 18ms)
[OK] Read Replica 2     ... исправен (lag: 22ms)
[OK] Vector DB          ... исправен (2.1M векторов)
[OK] Worker Pool        ... исправен (queue depth: 23)
--------------------------------------------------
ОБЩИЙ СТАТУС: ВСЕ СИСТЕМЫ РАБОТАЮТ`.trim()

const BIO = `# Антон Кудряшов — Senior Full-Stack Engineer

## О себе
Проектирую и создаю распределённые системы, обрабатывающие
миллионы событий ежедневно. Специализируюсь на пересечении
высокопроизводительной инженерии и исключительного UX.

## Стек
- Backend:  Node.js, Bun, Go, Rust (WASM модули)
- Frontend: React 19, Next.js 15, WebGL, GSAP, Three.js
- Data:     PostgreSQL, Redis, Apache Kafka, Pinecone
- Infra:    Kubernetes, Terraform, AWS, Vercel Edge

## Достижения
- Снизил P99 задержку API на 68% через Redis + edge кэширование
- Создал Kafka-пайплайн на 12M событий/день без потерь данных
- Запустил WebGL портфолио с кастомными GLSL шейдерами
- Zero-downtime blue/green деплой для 4 микросервисов

## Контакты
Email:  anton@astra.dev
GitHub: github.com/antonkudriashov9-ux`.trim()

const CONTACT = `HTTP/1.1 200 OK
Content-Type: application/json
X-Request-Id: req_01JF4K2M8XVNP3Q7

{
  "status": "success",
  "message": "Запрос на контакт получен",
  "data": {
    "email": "anton@astra.dev",
    "response_sla": "24h",
    "availability": "open_to_opportunities",
    "timezone": "UTC+3",
    "preferred": "email"
  }
}`.trim()

const HIRE_ME = `
+------------------------------------------+
|  ДОСТУП РАЗРЕШЁН: sudo hire-me           |
|                                          |
|  Проверка занятости    ... [СВОБОДЕН]    |
|  Проверка навыков      ... [ОТЛИЧНЫЕ]    |
|  Проверка рекомендаций ... [БЛЕСТЯЩИЕ]   |
|                                          |
|  СТАТУС: Готов к работе с первого дня.   |
|  КОНТАКТ: anton@astra.dev                |
+------------------------------------------+`.trim()

const PROJECTS = `ПРОЕКТЫ --filter=distributed

[1] EventStream Platform
    Stack:   Kafka + Node.js + Redis + PostgreSQL
    Масштаб: 12M событий/день, без потерь данных
    Статус:  Production (18 мес., 99.97% аптайм)

[2] Realtime Analytics Engine
    Stack:   ClickHouse + Kafka + React + WebSockets
    Масштаб: 500K одновременных соединений
    Статус:  Production (Blue/Green деплой)

[3] Distributed Job Scheduler
    Stack:   BullMQ + Redis Cluster + Kubernetes
    Масштаб: 10K задач/мин, кросс-региональный failover
    Статус:  Open Source

[4] Edge Auth Middleware
    Stack:   Next.js Edge + JWT + mTLS + Kong
    Масштаб: 500K req/s, 4ms P50 глобально
    Статус:  Production`.trim()

type LineType = 'banner' | 'input' | 'output' | 'error'
interface Line { id: number; type: LineType; content: string }

const COMMANDS: Record<string, string> = {
  help: `ДОСТУПНЫЕ КОМАНДЫ:
  help                           показать эту справку
  cat bio.md                     биография и стек технологий
  projects --filter=distributed  проекты с распределёнными системами
  system-check                   проверка состояния систем
  curl /api/contact              API эндпоинт для связи
  git log --graph                история коммитов
  benchmarks                     результаты бенчмарков производительности
  sudo hire-me                   инициировать процесс найма
  whoami                         информация о пользователе
  clear                          очистить терминал`,
  'cat bio.md': BIO,
  'projects --filter=distributed': PROJECTS,
  'system-check': SYSTEM_CHECK,
  'curl /api/contact': CONTACT,
  'git log --graph': GIT_LOG,
  benchmarks: BENCHMARKS,
  'sudo hire-me': HIRE_ME,
  whoami: 'anton — Senior Full-Stack Engineer | astra.dev',
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
            content: `команда не найдена: ${cmd}\nВведите «help» для списка доступных команд.`,
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
            {/* Заголовок окна */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ background: '#1A1A1A', borderColor: '#2A2A2A' }}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="w-3 h-3 rounded-full transition-opacity hover:opacity-75"
                  style={{ background: '#FF5F57' }}
                  aria-label="Закрыть"
                />
                <div className="w-3 h-3 rounded-full" style={{ background: '#FEBC2E' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#28C840' }} />
              </div>
              <span className="font-mono text-xs" style={{ color: '#333' }}>
                astra-shell — bash
              </span>
              <button
                onClick={() => setOpen(false)}
                className="transition-colors"
                style={{ color: '#333' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#F5F4F2' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#333' }}
                aria-label="Закрыть терминал"
              >
                <X size={14} />
              </button>
            </div>

            {/* Тело терминала */}
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
                  aria-label="Ввод команды терминала"
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
