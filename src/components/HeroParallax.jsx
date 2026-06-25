import { useEffect, useRef } from 'react'
import './HeroParallax.css'

/**
 * Hero 视差背景 — 滚动时背景移动速度慢于内容
 */
export default function HeroParallax({ children }) {
  const bgRef = useRef(null)

  useEffect(() => {
    const bg = bgRef.current
    if (!bg) return undefined

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return undefined

    function onScroll() {
      const y = window.scrollY * 0.35
      bg.style.transform = `translate3d(0, ${y}px, 0)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="hero-parallax">
      <div ref={bgRef} className="hero-parallax__bg" aria-hidden="true">
        <div className="hero-parallax__orb hero-parallax__orb--cyan" />
        <div className="hero-parallax__orb hero-parallax__orb--purple" />
        <div className="hero-parallax__grid" />
      </div>
      <div className="hero-parallax__content">{children}</div>
    </section>
  )
}
