import { motion } from 'framer-motion'
import { useAudio } from '../../hooks/useAudio'

const ITEMS = [
  {
    id: 'b1', span: 2, tag: 'Инфраструктура',
    title: 'Blue/Green пайплайн деплоя',
    description: 'Zero-downtime деплой для 4 микросервисов с автоматическими smoke-тестами, canary-шифтингом трафика через feature flags и мгновенным откатом за менее 30 секунд.',
    metrics: ['Zero downtime', '99.97% аптайм', '4 сервиса'], accent: '#D4FF00',
  },
  {
    id: 'b2', span: 1, tag: 'Производительность',
    title: 'Устранение N+1 запросов',
    description: 'Обнаружены и устранены N+1 паттерны на уровне ORM через DataLoader-батчинг — количество обращений к БД снизилось на 94%.',
    metrics: ['-94% запросов к БД', '3ms avg P50'], accent: '#00F0FF',
  },
  {
    id: 'b3', span: 1, tag: 'Фронтенд',
    title: 'Web Worker для изображений',
    description: 'Парсинг EXIF и генерация превью вынесены в Web Worker. Нулевой фриз основного потока при загрузке файлов любого размера.',
    metrics: ['0ms заморозки', 'Перенос в Worker'], accent: '#A855F7',
  },
  {
    id: 'b4', span: 1, tag: 'Наблюдаемость',
    title: 'Трассировка OpenTelemetry',
    description: 'Распределённая трассировка всех микросервисов с инструментальными накладными расходами менее 1ms и полной визуализацией в Jaeger.',
    metrics: ['<1ms накладные', 'Полный стек трейсов'], accent: '#FF6B35',
  },
  {
    id: 'b5', span: 2, tag: 'Rust / WASM',
    title: 'Rust WASM Crypto модуль',
    description: 'Заменил JS-крипто на Rust, скомпилированный в WebAssembly. Рост пропускной способности в 8x при верификации подписей с идентичным TypeScript API.',
    metrics: ['8x быстрее', 'WASM runtime', 'Тот же API'], accent: '#10B981',
  },
]

export default function BentoGrid() {
  const { hover } = useAudio()
  return (
    <section style={{ background: '#0A0A0A', padding: 'clamp(60px,8vw,96px) clamp(24px,6vw,96px)' }}>
      <style>{`
        @media (max-width: 768px) {
          .bento-item-span2 { grid-column: span 1 !important; }
          .bento-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Шапка */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ width: 32, height: 1, background: '#D4FF00', flexShrink: 0 }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D4FF00' }}>
              Доказательство компетентности
            </span>
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#F5F4F2', lineHeight: 1.05 }}>
            Инженерные
            <br /><span style={{ color: '#D4FF00' }}>Решения</span>
          </h2>
        </div>

        {/* Сетка */}
        <div
          className="bento-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
        >
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              className={item.span === 2 ? 'bento-item-span2' : undefined}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.19, 1, 0.22, 1] }}
              onMouseEnter={hover}
              style={{
                gridColumn: `span ${item.span}`,
                position: 'relative', padding: '28px 28px 24px',
                background: '#111111', border: '1px solid #2A2A2A',
                borderRadius: 16, overflow: 'hidden',
              }}
            >
              {/* Тег */}
              <div style={{
                display: 'inline-block', fontFamily: 'JetBrains Mono, monospace',
                fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
                padding: '3px 8px', border: `1px solid ${item.accent}30`,
                color: item.accent, marginBottom: 16,
              }}>{item.tag}</div>

              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 700, color: '#F5F4F2', marginBottom: 10, lineHeight: 1.3 }}>{item.title}</h3>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, color: '#A8A6A2', lineHeight: 1.65, marginBottom: 20 }}>
                {item.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {item.metrics.map((m) => (
                  <span key={m} style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600,
                    padding: '4px 10px', borderRadius: 4,
                    background: `${item.accent}18`, color: item.accent,
                  }}>{m}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
