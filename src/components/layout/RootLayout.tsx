import { useEffect, type ReactNode } from 'react'
import { useStore } from '../../store/useStore'
import Nav from './Nav'
import AudioToggle from '../ui/AudioToggle'
import WireframeToggle from '../ui/WireframeToggle'

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const wireframeMode = useStore((s) => s.wireframeMode)

  useEffect(() => {
    if (wireframeMode) {
      document.body.classList.add('wireframe-mode')
    } else {
      document.body.classList.remove('wireframe-mode')
    }
  }, [wireframeMode])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const s = useStore.getState()
        s.setTerminalOpen(!s.terminalOpen)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="relative min-h-screen" style={{ background: '#0A0A0A' }}>
      <Nav />
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <WireframeToggle />
        <AudioToggle />
      </div>
    </div>
  )
}
