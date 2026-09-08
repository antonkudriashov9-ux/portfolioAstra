import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null

export function getLenis() {
  return lenisInstance
}

export function useLenis() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    lenisInstance = new Lenis({
      duration: reduced ? 0 : 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !reduced,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    // Keep GSAP ScrollTrigger in sync with Lenis scroll position
    lenisInstance.on('scroll', () => ScrollTrigger.update())

    const tick = (time: number) => lenisInstance?.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenisInstance?.destroy()
      lenisInstance = null
    }
  }, [])
}
