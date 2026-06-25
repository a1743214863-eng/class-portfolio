import { useCallback, useEffect, useRef, useState } from 'react'
import './DynamicBackground.css'

const STORAGE_KEY = 'zhihui-design-dynamic-bg'
const PARTICLE_COUNT = 100
const CONNECT_DISTANCE = 130
const PARTICLE_SPEED = 0.18
const GRID_SCROLL_SPEED = 0.00022
const BG_COLOR_LIGHT = '#ffffff'
const BG_COLOR_DARK = '#0a0a0a'

const PARTICLE_PALETTE_LIGHT = [
  { r: 208, g: 208, b: 208 },
  { r: 195, g: 200, b: 210 },
  { r: 200, g: 205, b: 215 },
]

const PARTICLE_PALETTE_DARK = [
  { r: 0, g: 212, b: 255 },
  { r: 255, g: 255, b: 255 },
  { r: 200, g: 160, b: 255 },
]

function isDarkTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark'
}

function getParticlePalette() {
  return isDarkTheme() ? PARTICLE_PALETTE_DARK : PARTICLE_PALETTE_LIGHT
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

function readEnabledPreference() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'off') return false
  if (saved === 'on') return true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (shouldUseFallback()) return false
  return true
}

function shouldUseFallback() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 4
  return cores < 2 || memory < 2
}

function createParticle(width, height) {
  const palette = getParticlePalette()
  const color = palette[Math.floor(Math.random() * palette.length)]
  const dark = isDarkTheme()
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: randomBetween(-PARTICLE_SPEED, PARTICLE_SPEED),
    vy: randomBetween(-PARTICLE_SPEED, PARTICLE_SPEED),
    radius: randomBetween(2, 6),
    ...color,
    alpha: dark ? randomBetween(0.5, 0.95) : randomBetween(0.15, 0.35),
    glow: dark ? randomBetween(4, 12) : randomBetween(2, 5),
  }
}

function drawParticles(ctx, particles) {
  particles.forEach((p) => {
    const color = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha})`
    ctx.save()
    ctx.shadowBlur = p.glow
    ctx.shadowColor = color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.restore()
  })
}

function drawConnections(ctx, particles) {
  const dark = isDarkTheme()
  const lineRgb = dark ? '0, 212, 255' : '208, 208, 208'
  const lineScale = dark ? 0.18 : 0.06

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i]
      const b = particles[j]
      const dist = Math.hypot(a.x - b.x, a.y - b.y)
      if (dist < CONNECT_DISTANCE) {
        const opacity = (1 - dist / CONNECT_DISTANCE) * lineScale
        ctx.beginPath()
        ctx.strokeStyle = `rgba(${lineRgb}, ${opacity})`
        ctx.lineWidth = 0.5
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
  }
}

/** 赛博朋克透视霓虹网格 — 向前飞行感 */
function drawNeonGrid(ctx, width, height, time) {
  const dark = isDarkTheme()
  const cx = width / 2
  const horizon = height * 0.38
  const scroll = (time * GRID_SCROLL_SPEED) % 1

  ctx.save()
  ctx.strokeStyle = dark ? 'rgba(0, 212, 255, 0.22)' : 'rgba(208, 208, 208, 0.1)'
  ctx.lineWidth = 1

  const verticalLines = 24
  for (let i = -verticalLines; i <= verticalLines; i += 1) {
    const spread = (i / verticalLines) * width * 1.4
    ctx.beginPath()
    ctx.moveTo(cx, horizon)
    ctx.lineTo(cx + spread, height + 20)
    ctx.stroke()
  }

  const horizontalLines = 18
  for (let i = 0; i < horizontalLines; i += 1) {
    const t = ((i / horizontalLines + scroll) % 1)
    const eased = t * t
    const y = horizon + (height - horizon + 40) * eased
    const halfWidth = eased * width * 0.95
    const alpha = dark ? 0.15 + eased * 0.15 : 0.04 + eased * 0.08
    ctx.strokeStyle = dark
      ? `rgba(0, 212, 255, ${alpha})`
      : `rgba(208, 208, 208, ${alpha})`
    ctx.beginPath()
    ctx.moveTo(cx - halfWidth, y)
    ctx.lineTo(cx + halfWidth, y)
    ctx.stroke()
  }

  ctx.restore()
}

/**
 * 组合动态背景：粒子星空 + 霓虹网格 + 鼠标光晕
 * z-index: canvas 0 → 光晕 1 → 页面内容 2
 */
export default function DynamicBackground() {
  const canvasRef = useRef(null)
  const glowRef = useRef(null)
  const particlesRef = useRef([])
  const rafRef = useRef(null)
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 })
  const mouseRef = useRef({ x: -800, y: -800 })
  const glowPosRef = useRef({ x: -800, y: -800 })
  const timeRef = useRef(0)
  const runningRef = useRef(true)

  const [enabled, setEnabled] = useState(() => readEnabledPreference())

  const toggleEnabled = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off')
      return next
    })
  }, [])

  useEffect(() => {
    function onPreferenceChange(e) {
      if (e.key === STORAGE_KEY) {
        setEnabled(readEnabledPreference())
      }
    }
    window.addEventListener('storage', onPreferenceChange)
    return () => window.removeEventListener('storage', onPreferenceChange)
  }, [])

  useEffect(() => {
    if (!enabled) return undefined

    const canvas = canvasRef.current
    const glow = glowRef.current
    if (!canvas || !glow) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = window.innerWidth
      const height = window.innerHeight
      sizeRef.current = { width, height, dpr }

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (particlesRef.current.length === 0) {
        particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
          createParticle(width, height),
        )
      }
    }

    function onMouseMove(e) {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    function onVisibilityChange() {
      runningRef.current = document.visibilityState === 'visible'
      if (runningRef.current) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    function updateGlow() {
      const target = mouseRef.current
      const pos = glowPosRef.current
      pos.x += (target.x - pos.x) * 0.07
      pos.y += (target.y - pos.y) * 0.07
      glow.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`
    }

    function tick(timestamp) {
      if (!runningRef.current) return

      const { width, height } = sizeRef.current
      timeRef.current = timestamp

      ctx.fillStyle = isDarkTheme() ? BG_COLOR_DARK : BG_COLOR_LIGHT
      ctx.fillRect(0, 0, width, height)

      drawNeonGrid(ctx, width, height, timestamp)
      drawConnections(ctx, particlesRef.current)

      particlesRef.current.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) {
          p.vx *= -1
          p.x = Math.max(0, Math.min(width, p.x))
        }
        if (p.y < 0 || p.y > height) {
          p.vy *= -1
          p.y = Math.max(0, Math.min(height, p.y))
        }
      })

      drawParticles(ctx, particlesRef.current)
      updateGlow()

      rafRef.current = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [enabled])

  const showEffects = enabled

  return (
    <>
      <div className="dynamic-bg" aria-hidden="true">
        {showEffects ? (
          <>
            <canvas ref={canvasRef} className="dynamic-bg__canvas" />
            <div ref={glowRef} className="dynamic-bg__glow" />
          </>
        ) : (
          <div className="dynamic-bg__fallback" />
        )}
      </div>

      <button
        type="button"
        className="dynamic-bg__toggle"
        onClick={toggleEnabled}
        aria-label={enabled ? '关闭动态背景' : '开启动态背景'}
        title={enabled ? '关闭动态背景' : '开启动态背景'}
      >
        {enabled ? '◉' : '○'}
      </button>
    </>
  )
}

export function isDynamicBackgroundEnabled() {
  return readEnabledPreference()
}
