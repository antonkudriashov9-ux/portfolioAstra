import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import SplitType from 'split-type'

interface KineticTextProps {
  text: string
  className?: string
  delay?: number
  as?: keyof React.JSX.IntrinsicElements
}

import React from 'react'

export default function KineticText({
  text,
  className = '',
  delay = 0,
  as: Tag = 'span',
}: KineticTextProps) {
  const elRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReducedMotion) return

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
    // @ts-expect-error dynamic tag
    <Tag ref={elRef} className={`overflow-hidden inline-block ${className}`}>
      {text}
    </Tag>
  )
}
