import { lazy, Suspense } from 'react'
import RootLayout from './components/layout/RootLayout'
import HeroSection from './components/hero/HeroSection'
import ProjectsTrack from './components/projects/ProjectsTrack'
import BentoGrid from './components/projects/BentoGrid'
import ArchVisualizer from './components/architecture/ArchVisualizer'
import DiffViewer from './components/code/DiffViewer'
import Terminal from './components/terminal/Terminal'
import { useLenis } from './hooks/useLenis'

export default function App() {
  useLenis()

  return (
    <RootLayout>
      {/* Terminal overlay — always mounted, toggled via Cmd+K */}
      <Terminal />

      <main id="main-content">
        <HeroSection />

        <ProjectsTrack />

        <BentoGrid />

        <section id="architecture" style={{ background:'#080808', paddingTop:'7rem', paddingBottom:'7rem' }}>
          <ArchVisualizer />
        </section>

        <section id="code" style={{ background:'#0A0A0A', paddingTop:'7rem', paddingBottom:'7rem' }}>
          <DiffViewer />
        </section>

        {/* Contact */}
        <section id="contact" style={{ background:'#0A0A0A', paddingTop:'6rem', paddingBottom:'6rem' }}>
          <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 1.5rem' }}>
            <div
              style={{
                background:'#111111',
                border:'1px solid #222222',
                borderRadius:'24px',
                padding:'clamp(3rem,6vw,6rem)',
                textAlign:'center',
                position:'relative',
                overflow:'hidden',
              }}
            >
              {/* Radial accent */}
              <div
                aria-hidden="true"
                style={{
                  position:'absolute', inset:0, pointerEvents:'none',
                  background:'radial-gradient(ellipse 60% 50% at 50% 100%,rgba(212,255,0,0.055) 0%,transparent 70%)',
                }}
              />

              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.75rem', marginBottom:'1.5rem' }}>
                  <span style={{ display:'block', width:'32px', height:'1px', background:'#D4FF00', flexShrink:0 }} />
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', letterSpacing:'0.2em', textTransform:'uppercase', color:'#D4FF00' }}>
                    Available for Work
                  </span>
                  <span style={{ display:'block', width:'32px', height:'1px', background:'#D4FF00', flexShrink:0 }} />
                </div>

                <h2
                  style={{
                    fontFamily:"'Space Grotesk',sans-serif",
                    fontWeight:700,
                    fontSize:'clamp(2.2rem,5.5vw,4.5rem)',
                    lineHeight:1.08,
                    color:'#F5F4F2',
                    marginBottom:'1.25rem',
                  }}
                >
                  Open to<br />
                  <span style={{ color:'#D4FF00' }}>Opportunities</span>
                </h2>

                <p
                  style={{
                    fontSize:'clamp(0.9rem,1.5vw,1.05rem)',
                    color:'#A8A6A2',
                    lineHeight:1.7,
                    maxWidth:'420px',
                    margin:'0 auto 2.5rem',
                  }}
                >
                  Building distributed systems and exceptional interfaces.
                  Available for senior and staff engineering roles.
                </p>

                <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem', justifyContent:'center', alignItems:'center' }}>
                  <a
                    href="mailto:anton@astra.dev"
                    style={{
                      display:'inline-block',
                      fontFamily:"'JetBrains Mono',monospace",
                      fontSize:'13px',
                      letterSpacing:'0.1em',
                      fontWeight:600,
                      padding:'14px 36px',
                      background:'#D4FF00',
                      color:'#0A0A0A',
                      textDecoration:'none',
                      clipPath:'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))',
                      transition:'transform 0.15s',
                    }}
                    onMouseEnter={(e)=>(e.currentTarget.style.transform='scale(1.04)')}
                    onMouseLeave={(e)=>(e.currentTarget.style.transform='scale(1)')}
                  >
                    Get In Touch
                  </a>
                  <a
                    href="https://github.com/antonkudriashov9-ux"
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display:'inline-block',
                      fontFamily:"'JetBrains Mono',monospace",
                      fontSize:'13px',
                      letterSpacing:'0.1em',
                      padding:'13px 28px',
                      border:'1px solid #2A2A2A',
                      color:'#A8A6A2',
                      textDecoration:'none',
                      transition:'border-color 0.2s,color 0.2s',
                    }}
                    onMouseEnter={(e)=>{ const el=e.currentTarget as HTMLAnchorElement; el.style.borderColor='#D4FF00'; el.style.color='#D4FF00' }}
                    onMouseLeave={(e)=>{ const el=e.currentTarget as HTMLAnchorElement; el.style.borderColor='#2A2A2A'; el.style.color='#A8A6A2' }}
                  >
                    GitHub Profile
                  </a>
                </div>

                <div style={{ marginTop:'2.5rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                  <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#28C840', display:'inline-block', animation:'pulse 2s infinite' }} />
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', color:'#555' }}>
                    Open to new roles - response within 24h
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop:'3rem', paddingTop:'2rem', borderTop:'1px solid #1A1A1A', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem' }}>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', color:'#2A2A2A' }}>AK.dev &copy; 2026</span>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', color:'#2A2A2A' }}>React 18 + Three.js + GSAP + Vercel</span>
            </div>
          </div>
        </section>
      </main>
    </RootLayout>
  )
}
