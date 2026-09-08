import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import SplitType from 'split-type'

interface KineticTextProps {
  text: string
  className?: string
  delay?: number
}

/**
 * Kinetic text reveal: chars slide up + deskew via GSAP SplitType.
 * Wraps content in a <span> with overflow-hidden to clip the animation.
 * prefers-reduced-motion safe.
 */
export default function KineticText({ text, className = '', delay = 0 }: KineticTextProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const split = new SplitType(el, { types: 'chars,words' })
    const chars = split.chars
    if (!chars?.length) return

    gsap.set(chars, { yPercent: 115, skewX: 14, opacity: 0 })

    const tl = gsap.timeline({ delay })
    tl.to(chars, {
      yPercent: 0,
      skewX: 0,
      opacity: 1,
      duration: 0.85,
      ease: 'expo.out',
      stagger: 0.022,
    })

    return () => {
      tl.kill()
      split.revert()
    }
  }, [delay, text])

  return (
    <span
      ref={ref}
      className={`inline-block overflow-hidden ${className}`}
      aria-label={text}
    >
      {text}
    </span>
  )
}
