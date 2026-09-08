import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { useAudio } from '../../hooks/useAudio'

const NAV_LINKS = [
  { label: 'Проекты', href: '#projects' },
  { label: 'Архитектура', href: '#architecture' },
  { label: 'Код', href: '#code' },
  { label: 'Контакты', href: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  const { click } = useAudio()
  const setTerminalOpen = useStore((s) => s.setTerminalOpen)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 60))

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.4 }}
    >
      <div
        className="mx-auto px-6 md:px-14 py-5 flex items-center justify-between transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: scrolled ? '1px solid #1A1A1A' : '1px solid transparent',
        }}
      >
        <a
          href="#"
          className="font-mono text-sm tracking-widest uppercase"
          style={{ color: '#D4FF00' }}
          onClick={click}
        >
          АК<span style={{ color: '#F5F4F2' }}>.dev</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-xs tracking-wider uppercase transition-colors duration-200"
              style={{ color: '#A8A6A2' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#F5F4F2' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#A8A6A2' }}
              onClick={click}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          onClick={() => { click(); setTerminalOpen(true) }}
          className="font-mono text-xs tracking-wider px-4 py-2 border transition-all duration-200"
          style={{ borderColor: '#2A2A2A', color: '#D4FF00' }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = '#D4FF00'
            el.style.color = '#0A0A0A'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'transparent'
            el.style.color = '#D4FF00'
          }}
          aria-label="Открыть терминал (Cmd+K)"
        >
          Терминал_
        </button>
      </div>
    </motion.header>
  )
}
