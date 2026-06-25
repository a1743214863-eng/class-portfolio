import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWorkById } from '../utils/storage'
import { formatCategory } from '../data/categories'
import { getSemesterLabel, getWorkTypeLabel } from '../data/curriculum'
import { useAuth } from '../context/AuthContext'
import CategoryTag from './CategoryTag'
import './WorkDetailContent.css'

export default function WorkDetailContent({ workId, variant = 'modal' }) {
  const navigate = useNavigate()
  const { isLoggedIn, toggleFavorite, isFavorited } = useAuth()
  const work = getWorkById(workId)
  const [slideIndex, setSlideIndex] = useState(0)
  const favorited = isFavorited(workId)

  useEffect(() => {
    setSlideIndex(0)
  }, [workId])

  if (!work) {
    return <p className="work-detail__missing">未找到该作品</p>
  }

  const images = work.images?.length ? work.images : work.image ? [work.image] : []
  const hasMultiple = images.length > 1

  function goPrev() {
    setSlideIndex((i) => (i - 1 + images.length) % images.length)
  }

  function goNext() {
    setSlideIndex((i) => (i + 1) % images.length)
  }

  function handleFavorite() {
    const result = toggleFavorite(work.id)
    if (result.needLogin) {
      navigate('/login')
    }
  }

  return (
    <div className={`work-detail work-detail--${variant}`}>
      <div className="work-detail__gallery">
        {images.length > 0 ? (
          <>
            <img
              src={images[slideIndex]}
              alt={`${work.title} - ${slideIndex + 1}`}
              className="work-detail__image"
            />
            {hasMultiple && (
              <>
                <button type="button" className="work-detail__nav work-detail__nav--prev" onClick={goPrev} aria-label="上一张">
                  ‹
                </button>
                <button type="button" className="work-detail__nav work-detail__nav--next" onClick={goNext} aria-label="下一张">
                  ›
                </button>
                <div className="work-detail__dots">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`work-detail__dot${i === slideIndex ? ' work-detail__dot--active' : ''}`}
                      onClick={() => setSlideIndex(i)}
                      aria-label={`第 ${i + 1} 张`}
                    />
                  ))}
                </div>
                <span className="work-detail__counter">
                  {slideIndex + 1} / {images.length}
                </span>
              </>
            )}
          </>
        ) : (
          <div className="work-detail__no-image">暂无图片</div>
        )}
      </div>

      <div className="work-detail__body">
        <div className="work-detail__actions">
          <CategoryTag category={work.category} variant="pill" />
          <button
            type="button"
            className={`work-detail__favorite-btn${favorited ? ' work-detail__favorite-btn--active' : ''}`}
            onClick={handleFavorite}
          >
            {favorited ? '⭐ 已收藏' : '☆ 加入收藏'}
          </button>
        </div>

        <h2 className="work-detail__title">{work.title}</h2>

        <dl className="work-detail__meta-list">
          <div className="work-detail__meta-row">
            <dt>作者</dt>
            <dd>{work.author}</dd>
          </div>
          {work.advisor && (
            <div className="work-detail__meta-row">
              <dt>指导老师</dt>
              <dd>{work.advisor}</dd>
            </div>
          )}
          <div className="work-detail__meta-row">
            <dt>分类</dt>
            <dd>{formatCategory(work.category)}</dd>
          </div>
          {work.year && (
            <div className="work-detail__meta-row">
              <dt>学年</dt>
              <dd>{work.year}</dd>
            </div>
          )}
          {work.semester && (
            <div className="work-detail__meta-row">
              <dt>学期</dt>
              <dd>{getSemesterLabel(work.semester)}</dd>
            </div>
          )}
          {work.course && (
            <div className="work-detail__meta-row">
              <dt>课程</dt>
              <dd>{work.course}</dd>
            </div>
          )}
          <div className="work-detail__meta-row">
            <dt>类型</dt>
            <dd>{getWorkTypeLabel(work.workType)}</dd>
          </div>
          {work.created_at && (
            <div className="work-detail__meta-row">
              <dt>上传日期</dt>
              <dd>{work.created_at}</dd>
            </div>
          )}
          <div className="work-detail__meta-row">
            <dt>点赞</dt>
            <dd>{work.likes || 0} 次</dd>
          </div>
        </dl>

        {work.description && (
          <section className="work-detail__desc">
            <h3 className="work-detail__desc-title">设计说明</h3>
            <p className="work-detail__desc-text">{work.description}</p>
          </section>
        )}

        {!isLoggedIn && (
          <p className="work-detail__login-hint">
            <button type="button" className="work-detail__login-link" onClick={() => navigate('/login')}>
              登录
            </button>
            后可收藏作品，在个人中心查看
          </p>
        )}
      </div>
    </div>
  )
}
