import { useEffect } from 'react'
import RootLayout from './components/layout/RootLayout'
import HeroSection from './components/hero/HeroSection'
import ProjectsTrack from './components/projects/ProjectsTrack'
import BentoGrid from './components/projects/BentoGrid'
import ArchVisualizer from './components/architecture/ArchVisualizer'
import DiffViewer from './components/code/DiffViewer'
import { useLenis } from './hooks/useLenis'

export default function App() {
  useLenis()

  return (
    <RootLayout>
      <main>
        <HeroSection />
        <ProjectsTrack />
        <BentoGrid />
        <section
          id="architecture"
          className="relative py-32"
          style={{ background: '#0A0A0A' }}
        >
          <ArchVisualizer />
        </section>
        <section
          id="code"
          className="relative py-32"
          style={{ background: '#0A0A0A' }}
        >
          <DiffViewer />
        </section>
        <section
          id="contact"
          className="relative py-32 px-6 md:px-16 max-w-7xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="block w-8 h-px bg-[#D4FF00]" />
            <span className="font-mono text-xs tracking-widest uppercase text-[#D4FF00]">
              Let's Build
            </span>
            <span className="block w-8 h-px bg-[#D4FF00]" />
          </div>
          <h2
            className="font-bold leading-tight mb-6 text-[#F5F4F2]"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            Open to
            <br />
            <span className="text-[#D4FF00]">Opportunities</span>
          </h2>
          <p className="text-[#A8A6A2] max-w-md mx-auto mb-10" style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)' }}>
            Building distributed systems and exceptional interfaces.
            Available for senior and staff engineering roles.
          </p>
          <a
            href="mailto:anton@astra.dev"
            className="inline-block font-mono text-sm tracking-wider px-10 py-4 bg-[#D4FF00] text-[#0A0A0A] font-semibold hover:scale-105 transition-transform duration-200 active:scale-95"
            style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
          >
            Get In Touch
          </a>
          <div className="mt-24 pt-8 border-t border-[#1A1A1A] flex items-center justify-between">
            <span className="font-mono text-xs text-[#3A3A3A]">AK.dev &copy; 2026</span>
            <span className="font-mono text-xs text-[#3A3A3A]">
              Built with React 19 + Three.js + GSAP
            </span>
          </div>
        </section>
      </main>
    </RootLayout>
  )
}
