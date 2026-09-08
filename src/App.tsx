import { lazy, Suspense } from 'react'
import RootLayout from './components/layout/RootLayout'
import HeroSection from './components/hero/HeroSection'
import ProjectsTrack from './components/projects/ProjectsTrack'
import BentoGrid from './components/projects/BentoGrid'
import ArchVisualizer from './components/architecture/ArchVisualizer'
import DiffViewer from './components/code/DiffViewer'
import Terminal from './components/terminal/Terminal'
import { useLenis } from './hooks/useLenis'

// Lazy-load section wrappers so initial bundle stays lean
const SectionArch = () => (
  <section
    id="architecture"
    className="relative py-32"
    style={{ background: '#0A0A0A' }}
  >
    <ArchVisualizer />
  </section>
)

const SectionCode = () => (
  <section
    id="code"
    className="relative py-32"
    style={{ background: '#0A0A0A' }}
  >
    <DiffViewer />
  </section>
)

const ContactSection = () => (
  <section
    id="contact"
    className="relative py-32 px-6 md:px-16"
    style={{ background: '#0A0A0A' }}
  >
    <div className="max-w-7xl mx-auto">
      <div
        className="rounded-3xl border p-12 md:p-20 text-center relative overflow-hidden"
        style={{ background: '#111111', borderColor: '#2A2A2A' }}
      >
        {/* Background accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(212,255,0,0.06) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="block w-8 h-px" style={{ background: '#D4FF00' }} />
            <span
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: '#D4FF00' }}
            >
              Available for Work
            </span>
            <span className="block w-8 h-px" style={{ background: '#D4FF00' }} />
          </div>

          <h2
            className="font-bold leading-tight mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: '#F5F4F2',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Open to
            <br />
            <span style={{ color: '#D4FF00' }}>Opportunities</span>
          </h2>

          <p
            className="max-w-md mx-auto mb-10"
            style={{
              fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)',
              color: '#A8A6A2',
              lineHeight: 1.7,
            }}
          >
            Building distributed systems and exceptional interfaces.
            Available for senior and staff engineering roles.
          </p>

          <div className="flex flex-wrap gap-4 items-center justify-center">
            <a
              href="mailto:anton@astra.dev"
              className="inline-block font-mono text-sm tracking-wider px-10 py-4 font-semibold transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2"
              style={{
                background: '#D4FF00',
                color: '#0A0A0A',
                clipPath:
                  'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
              }}
            >
              Get In Touch
            </a>
            <a
              href="https://github.com/antonkudriashov9-ux"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-sm tracking-wider px-8 py-4 border transition-all duration-200"
              style={{ borderColor: '#2A2A2A', color: '#A8A6A2' }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = '#D4FF00'
                el.style.color = '#D4FF00'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = '#2A2A2A'
                el.style.color = '#A8A6A2'
              }}
            >
              GitHub Profile
            </a>
          </div>

          {/* Live status badge */}
          <div className="mt-10 flex items-center justify-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#28C840' }}
            />
            <span className="font-mono text-xs" style={{ color: '#555' }}>
              Open to new roles - response within 24h
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 flex items-center justify-between border-t pt-8" style={{ borderColor: '#1A1A1A' }}>
        <span className="font-mono text-xs" style={{ color: '#2A2A2A' }}>
          AK.dev &copy; 2026
        </span>
        <span className="font-mono text-xs" style={{ color: '#2A2A2A' }}>
          React 18 + Three.js + GSAP + Vercel
        </span>
      </div>
    </div>
  </section>
)

export default function App() {
  useLenis()

  return (
    <RootLayout>
      {/* Global terminal overlay - always mounted so Cmd+K works from anywhere */}
      <Terminal />

      <main id="main-content">
        <HeroSection />
        <ProjectsTrack />
        <BentoGrid />
        <SectionArch />
        <SectionCode />
        <ContactSection />
      </main>
    </RootLayout>
  )
}
