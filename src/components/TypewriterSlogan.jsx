import { useEffect, useRef, useState } from 'react'
import './TypewriterSlogan.css'

const SLOGAN = '每一次设计，都是对世界的重新想象'
const CHAR_DELAY_MS = 80
const CURSOR_BLINK_AFTER_MS = 400

/**
 * Slogan 打字机效果 — 逐字打出 + 光标闪烁
 */
export default function TypewriterSlogan({ onComplete }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      index += 1
      setDisplayed(SLOGAN.slice(0, index))
      if (index >= SLOGAN.length) {
        clearInterval(interval)
        setTimeout(() => {
          setDone(true)
          onCompleteRef.current?.()
        }, CURSOR_BLINK_AFTER_MS)
      }
    }, CHAR_DELAY_MS)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!done) return undefined
    const blink = setInterval(() => setShowCursor((v) => !v), 530)
    return () => clearInterval(blink)
  }, [done])

  return (
    <h2 className="typewriter-slogan" aria-label={SLOGAN}>
      <span className="typewriter-slogan__text">{displayed}</span>
      <span
        className={`typewriter-slogan__cursor${showCursor ? ' typewriter-slogan__cursor--on' : ''}`}
        aria-hidden="true"
      >
        |
      </span>
    </h2>
  )
}
