import { motion } from 'framer-motion'
import { Box } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { useAudio } from '../../hooks/useAudio'

export default function WireframeToggle() {
  const wireframeMode = useStore((s) => s.wireframeMode)
  const toggleWireframe = useStore((s) => s.toggleWireframe)
  const { click } = useAudio()

  return (
    <motion.button
      onClick={() => { click(); toggleWireframe() }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200"
      style={{
        background: wireframeMode ? 'rgba(212,255,0,0.08)' : '#111',
        borderColor: wireframeMode ? '#D4FF00' : '#2A2A2A',
      }}
      aria-label={wireframeMode ? 'Disable wireframe mode' : 'Enable wireframe X-ray mode'}
      title="Toggle 3D wireframe X-ray mode"
    >
      <Box size={13} strokeWidth={1.5} color={wireframeMode ? '#D4FF00' : '#444'} />
    </motion.button>
  )
}
