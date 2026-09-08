import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useAudio } from '../../hooks/useAudio'

interface MagneticLinkProps {
  href: string
  children: ReactNode
  strength?: number
  className?: string
}

export default function MagneticLink({
  href,
  children,
  strength = 0.35,
  className = '',
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const { hover } = useAudio()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 360, damping: 28 })
  const sy = useSpring(y, { stiffness: 360, damping: 28 })

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current!.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={hover}
      className={className}
    >
      {children}
    </motion.a>
  )
}
