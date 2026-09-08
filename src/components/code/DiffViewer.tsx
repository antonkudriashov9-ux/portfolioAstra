import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from '../../hooks/useAudio'

const BEFORE_N1 = `// BEFORE: N+1 query pattern
// 100 posts = 201 separate DB calls
async function getUserFeed(userId: string) {
  const posts = await db.query(
    'SELECT * FROM posts WHERE author_id = $1',
    [userId]
  )

  // N+1: one query PER post
  const enriched = await Promise.all(
    posts.map(async (post) => {
      const author = await db.query(
        'SELECT * FROM users WHERE id = $1',
        [post.author_id]
      )
      const likes = await db.query(
        'SELECT COUNT(*) FROM likes WHERE post_id = $1',
        [post.id]
      )
      return { ...post, author: author[0], likes: likes[0].count }
    })
  )

  return enriched
  // P99 latency: 850ms
}`

const AFTER_N1 = `// AFTER: DataLoader batching + JOIN
// 100 posts = 2 DB calls total
const userLoader = new DataLoader(async (ids: string[]) => {
  const users = await db.query(
    'SELECT * FROM users WHERE id = ANY($1)',
    [ids]
  )
  return ids.map((id) => users.find((u) => u.id === id))
})

async function getUserFeed(userId: string) {
  const posts = await db.query(
    'SELECT p.*, COUNT(l.id) AS like_count ' +
    'FROM posts p ' +
    'LEFT JOIN likes l ON l.post_id = p.id ' +
    'WHERE p.author_id = $1 ' +
    'GROUP BY p.id ORDER BY p.created_at DESC LIMIT 20',
    [userId]
  )

  // Batch: all authors resolved in 1 query
  const authors = await Promise.all(
    posts.map((p) => userLoader.load(p.author_id))
  )

  return posts.map((p, i) => ({ ...p, author: authors[i] }))
  // P99 latency: 18ms  (-98%)
}`

const BEFORE_WORKER = `// BEFORE: Main thread processing
// Blocks UI for 200-800ms on large files
async function processUpload(file: File) {
  const buffer = await file.arrayBuffer()

  // Expensive EXIF parsing - main thread freeze
  const exif = parseExifData(buffer)

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const img = new Image()

  return new Promise<Blob>((resolve) => {
    img.onload = () => {
      canvas.width = 300
      canvas.height = 300
      ctx.drawImage(img, 0, 0, 300, 300)
      canvas.toBlob((b) => resolve(b!), 'image/webp', 0.85)
    }
    img.src = URL.createObjectURL(file)
  })
  // INP impact: 800ms+ on 5MB images
}`

const AFTER_WORKER = `// AFTER: Web Worker offload
// Main thread impact: 0ms

// worker.ts - runs in background thread
self.onmessage = async ({ data: { buffer } }) => {
  const canvas = new OffscreenCanvas(300, 300)
  const ctx = canvas.getContext('2d')!
  const img = await createImageBitmap(new Blob([buffer]))

  const scale = Math.max(300 / img.width, 300 / img.height)
  const ox = (img.width * scale - 300) / 2 / scale
  const oy = (img.height * scale - 300) / 2 / scale
  ctx.drawImage(img, -ox, -oy, img.width, img.height)

  const thumbnail = await canvas.convertToBlob({
    type: 'image/webp', quality: 0.85,
  })
  self.postMessage({ thumbnail }, [await thumbnail.arrayBuffer()])
}

// main.ts - fire and forget
async function processUpload(file: File) {
  const worker = new Worker(
    new URL('./worker.ts', import.meta.url), { type: 'module' }
  )
  const buffer = await file.arrayBuffer()
  worker.postMessage({ buffer }, [buffer])
  // INP: 0ms - main thread never touched
}`

const BEFORE_WASM = `// BEFORE: Pure JS elliptic curve crypto
// Throughput: 2,400 verifications/sec
import { ec as EC } from 'elliptic'

const ec = new EC('secp256k1')

export function verifySignature(
  message: string,
  signature: string,
  publicKey: string,
): boolean {
  try {
    const key = ec.keyFromPublic(publicKey, 'hex')
    const hash = sha256(message)
    return key.verify(hash, signature)
  } catch {
    return false
  }
}

// P99: 420us  |  Throughput: 2,400 ops/sec`

const AFTER_WASM = `// AFTER: Rust compiled to WASM
// Same API - 8x throughput improvement

// lib.rs (compiled with wasm-pack)
// #[wasm_bindgen]
// pub fn verify_signature(
//   message: &str, sig: &str, pubkey: &str,
// ) -> bool {
//   let key = PublicKey::from_hex(pubkey).ok();
//   let sig = Signature::from_hex(sig).ok();
//   match (key, sig) {
//     (Some(k), Some(s)) => k.verify(&sha256(message), &s).is_ok(),
//     _ => false,
//   }
// }

import init, { verify_signature } from './pkg/crypto_wasm'

let ready = false
async function ensureInit() {
  if (!ready) { await init(); ready = true }
}

export async function verifySignature(
  message: string,
  signature: string,
  publicKey: string,
): Promise<boolean> {
  await ensureInit()
  return verify_signature(message, signature, publicKey)
}

// P99: 52us  |  Throughput: 19,200 ops/sec  (+8x)`

const DIFFS = [
  {
    id: 'n1',
    label: 'Устранение N+1',
    before: { label: 'Junior — N+1 паттерн', code: BEFORE_N1 },
    after:  { label: 'Senior — DataLoader батчинг', code: AFTER_N1 },
  },
  {
    id: 'worker',
    label: 'Web Worker перенос',
    before: { label: 'Junior — основной поток', code: BEFORE_WORKER },
    after:  { label: 'Senior — Web Worker', code: AFTER_WORKER },
  },
  {
    id: 'wasm',
    label: 'Ускорение Rust WASM',
    before: { label: 'JS — чистый JavaScript', code: BEFORE_WASM },
    after:  { label: 'Rust WASM — тот же API', code: AFTER_WASM },
  },
]

function colorLine(line: string): string {
  if (line.startsWith('// BEFORE') || line.startsWith('// N+1') || line.startsWith('// Blocks') || line.startsWith('// Throughput: 2,') || line.startsWith('// INP impact') || line.startsWith('// P99: 420')) return 'line-bad'
  if (line.startsWith('// AFTER') || line.startsWith('// Main thread impact') || line.startsWith('// P99: 52') || line.startsWith('// INP: 0ms') || line.startsWith('// Same API')) return 'line-good'
  if (line.startsWith('//')) return 'line-comment'
  return 'line-normal'
}

export default function DiffViewer() {
  const [active, setActive] = useState(0)
  const [side, setSide] = useState<'before' | 'after'>('before')
  const { click } = useAudio()
  const diff = DIFFS[active]
  const codeObj = side === 'before' ? diff.before : diff.after

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-14">
      <style>{`
        .line-bad     { color: #FF5F57; }
        .line-good    { color: #28C840; }
        .line-comment { color: #444; }
        .line-normal  { color: #C8C5BF; }
      `}</style>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="block w-8 h-px" style={{ background: '#D4FF00' }} />
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: '#D4FF00' }}>
            Качество кода
          </span>
        </div>
        <h2
          className="font-bold leading-tight mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#F5F4F2' }}
        >
          До / После
          <br />
          <span style={{ color: '#D4FF00' }}>Рефакторинга</span>
        </h2>
        <p
          className="max-w-xl"
          style={{ fontSize: 'clamp(0.875rem, 1.7vw, 1rem)', color: '#A8A6A2', lineHeight: 1.65 }}
        >
          Антипаттерны junior-уровня, трансформированные в production-ready решения
          с измеримыми улучшениями производительности.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-7">
        {DIFFS.map((d, i) => (
          <button
            key={d.id}
            onClick={() => { click(); setActive(i); setSide('before') }}
            className="font-mono text-xs tracking-wider px-4 py-2 border uppercase transition-all duration-200"
            style={{
              borderColor: i === active ? '#D4FF00' : '#252525',
              color: i === active ? '#D4FF00' : '#555',
              background: i === active ? 'rgba(212,255,0,0.05)' : 'transparent',
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: '#0D0D0D', borderColor: '#1E1E1E' }}>
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{ background: '#161616', borderColor: '#1E1E1E' }}
        >
          <div className="flex items-center gap-1">
            {(['before', 'after'] as const).map((s) => (
              <button
                key={s}
                onClick={() => { click(); setSide(s) }}
                className="font-mono text-xs tracking-wider px-4 py-1.5 capitalize transition-all duration-200"
                style={{
                  color: side === s ? (s === 'before' ? '#FF5F57' : '#28C840') : '#444',
                  borderBottom: side === s
                    ? `2px solid ${s === 'before' ? '#FF5F57' : '#28C840'}`
                    : '2px solid transparent',
                }}
              >
                {s === 'before' ? 'До' : 'После'}
              </button>
            ))}
          </div>
          <span className="font-mono text-xs" style={{ color: '#333' }}>
            {codeObj.label}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${active}-${side}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="overflow-auto p-5"
            style={{ maxHeight: '460px' }}
            data-lenis-prevent
          >
            <pre className="font-mono text-[13px] leading-relaxed">
              {codeObj.code.split('\n').map((line, i) => (
                <div key={i} className="flex">
                  <span
                    className="select-none pr-4 text-right flex-shrink-0"
                    style={{ color: '#252525', minWidth: '2.2rem', userSelect: 'none' }}
                  >
                    {i + 1}
                  </span>
                  <span className={colorLine(line)}>{line}</span>
                </div>
              ))}
            </pre>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
