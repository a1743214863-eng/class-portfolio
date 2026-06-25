import { useCallback, useEffect, useState } from 'react'
import { formatCategory } from '../data/categories'
import './FeaturedWork.css'

const AUTOPLAY_MS = 5000
const FADE_MS = 600

function ChevronIcon({ direction }) {
  return (
    <svg className="featured__arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={direction === 'prev' ? 'M15.5 6.5L9.5 12l6 6' : 'M8.5 6.5l6 6-6 6'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FeaturedSlide({ work, isActive, onOpen }) {
  const cover = work.image || work.images?.[0] || ''

  return (
    <button
      type="button"
      className={`featured__slide${isActive ? ' featured__slide--active' : ''}`}
      onClick={() => onOpen?.(work.id)}
      tabIndex={isActive ? 0 : -1}
      aria-hidden={!isActive}
    >
      <div className="featured__image-wrap">
        {cover ? (
          <img src={cover} alt={work.title} className="featured__image" />
        ) : (
          <div className="featured__placeholder">暂无图片</div>
        )}
        <span className="featured__badge">✨ 最新推荐</span>
      </div>
      <div className="featured__content">
        <p className="featured__label">Featured Work</p>
        <h2 className="featured__title">{work.title}</h2>
        <p className="featured__meta">
          {formatCategory(work.category)} · {work.author}
          {work.year ? ` · ${work.year}` : ''}
          {work.likes ? ` · ❤️ ${work.likes}` : ''}
        </p>
        {work.description && <p className="featured__desc">{work.description}</p>}
        <span className="featured__cta">查看作品详情 →</span>
      </div>
    </button>
  )
}

export default function FeaturedWork({ works = [], onOpen }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const count = works.length

  const goTo = useCallback(
    (index) => {
      if (count === 0) return
      setActiveIndex((index + count) % count)
    },
    [count],
  )

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1)
  }, [activeIndex, goTo])

  const goNext = useCallback(() => {
    goTo(activeIndex + 1)
  }, [activeIndex, goTo])

  useEffect(() => {
    setActiveIndex(0)
  }, [works])

  useEffect(() => {
    if (count <= 1 || paused) return undefined

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) return undefined

    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % count)
    }, AUTOPLAY_MS)

    return () => window.clearInterval(timer)
  }, [count, paused, works])

  if (count === 0) return null

  return (
    <section
      className="featured"
      aria-label="最新推荐"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setPaused(false)
        }
      }}
      style={{ '--featured-fade-ms': `${FADE_MS}ms` }}
    >
      <div className="featured__viewport">
        {works.map((work, index) => (
          <FeaturedSlide
            key={work.id}
            work={work}
            isActive={index === activeIndex}
            onOpen={onOpen}
          />
        ))}

        {count > 1 && (
          <>
            <button
              type="button"
              className="featured__arrow featured__arrow--prev"
              aria-label="上一张推荐作品"
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
            >
              <ChevronIcon direction="prev" />
            </button>
            <button
              type="button"
              className="featured__arrow featured__arrow--next"
              aria-label="下一张推荐作品"
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
            >
              <ChevronIcon direction="next" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="featured__controls">
          <div className="featured__dots" role="tablist" aria-label="轮播指示器">
            {works.map((work, index) => (
              <button
                key={work.id}
                type="button"
                role="tab"
                className={`featured__dot${index === activeIndex ? ' featured__dot--active' : ''}`}
                aria-label={`第 ${index + 1} 张：${work.title}`}
                aria-selected={index === activeIndex}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
