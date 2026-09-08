import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { useAudio } from '../../hooks/useAudio'

export default function AudioToggle() {
  const audioEnabled = useStore((s) => s.audioEnabled)
  const setAudioEnabled = useStore((s) => s.setAudioEnabled)
  const { click, startDrone, stopDrone } = useAudio()

  const toggle = () => {
    const next = !audioEnabled
    if (next) {
      setAudioEnabled(true)
      startDrone()
    } else {
      setAudioEnabled(false)
      stopDrone()
    }
  }

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200"
      style={{
        background: audioEnabled ? 'rgba(212,255,0,0.08)' : '#111',
        borderColor: audioEnabled ? '#D4FF00' : '#2A2A2A',
      }}
      aria-label={audioEnabled ? 'Mute audio' : 'Enable audio'}
      title={audioEnabled ? 'Mute audio engine' : 'Enable audio (ambient + haptics)'}
    >
      {audioEnabled ? (
        <Volume2 size={13} color="#D4FF00" strokeWidth={1.5} />
      ) : (
        <VolumeX size={13} color="#444" strokeWidth={1.5} />
      )}
    </motion.button>
  )
}
