import { useEffect, useState } from 'react'
import './PageLoader.css'

const LOAD_DURATION_MS = 1500

/**
 * 页面加载动画 — 1.5 秒后内容淡入
 */
export default function PageLoader({ children }) {
  const [phase, setPhase] = useState('loading')

  useEffect(() => {
    const timer = setTimeout(() => setPhase('done'), LOAD_DURATION_MS)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {phase === 'loading' && (
        <div className="page-loader" aria-live="polite" aria-label="页面加载中">
          <div className="page-loader__ring" />
          <p className="page-loader__text">智慧设计</p>
        </div>
      )}
      <div className={`page-content${phase === 'done' ? ' page-content--visible' : ''}`}>
        {children}
      </div>
    </>
  )
}
