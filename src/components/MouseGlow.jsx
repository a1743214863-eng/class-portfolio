import { useEffect, useRef } from 'react'
import './MouseGlow.css'

/**
 * 鼠标跟随光效 — 柔和青色径向渐变光晕
 */
export default function MouseGlow() {
  const glowRef = useRef(null)
  const posRef = useRef({ x: -500, y: -500 })
  const rafRef = useRef(null)

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return undefined

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return undefined

    function onMove(e) {
      posRef.current = { x: e.clientX, y: e.clientY }
    }

    function tick() {
      const { x, y } = posRef.current
      glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return <div ref={glowRef} className="mouse-glow" aria-hidden="true" />
}
