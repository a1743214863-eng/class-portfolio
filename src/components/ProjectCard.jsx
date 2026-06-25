import { useNavigate } from 'react-router-dom'
import CategoryTag from './CategoryTag'
import ScrollReveal from './ScrollReveal'
import { useAuth } from '../context/AuthContext'
import { useWorksContext } from '../context/WorksContext'
import './ProjectCard.css'

function getInitial(name) {
  return name?.trim().charAt(0) || '?'
}

export default function ProjectCard({ work, index = 0, onOpen, onDelete, showFavorite = true }) {
  const navigate = useNavigate()
  const { toggleLike, isLiked } = useWorksContext()
  const { isLoggedIn, toggleFavorite, isFavorited } = useAuth()
  const cover = work.image || work.images?.[0] || ''
  const aspectVariant = Number(work.id) % 3
  const liked = isLiked(work.id)
  const favorited = isFavorited(work.id)
  const revealDelay = (index % 6) * 0.1

  function handleOpen() {
    onOpen?.(work.id)
  }

  function handleLike(event) {
    event.stopPropagation()
    toggleLike(work.id)
  }

  function handleFavorite(event) {
    event.stopPropagation()
    const result = toggleFavorite(work.id)
    if (result.needLogin) {
      navigate('/login')
    }
  }

  function handleDelete(event) {
    event.stopPropagation()
    onDelete?.(work)
  }

  return (
    <ScrollReveal className="project-card-wrap" delay={revealDelay}>
      <article className={`project-card${onDelete ? ' project-card--manageable' : ''}`}>
        <button type="button" className="project-card__main" onClick={handleOpen}>
          <div className={`project-card__image-wrap project-card__image-wrap--${aspectVariant}`}>
            {cover ? (
              <img src={cover} alt={work.title} className="project-card__image" loading="lazy" />
            ) : (
              <div className="project-card__placeholder">暂无图片</div>
            )}
            <span className="project-card__overlay">查看详情</span>
          </div>
          <div className="project-card__info">
            <CategoryTag category={work.category} />
            <h2 className="project-card__title">{work.title}</h2>
            <div className="project-card__footer">
              <div className="project-card__author-row">
                <span className="project-card__avatar">{getInitial(work.author)}</span>
                <span className="project-card__author">{work.author}</span>
              </div>
              {work.year && <span className="project-card__year">{work.year}</span>}
            </div>
          </div>
        </button>

        {onDelete && (
          <div className="project-card__manage">
            <button
              type="button"
              className="project-card__delete"
              onClick={handleDelete}
              aria-label={`删除作品：${work.title}`}
            >
              删除作品
            </button>
          </div>
        )}

        {showFavorite && (
        <button
          type="button"
          className={`project-card__favorite${favorited ? ' project-card__favorite--active' : ''}`}
          onClick={handleFavorite}
          aria-label={favorited ? '取消收藏' : '加入收藏'}
          title={isLoggedIn ? (favorited ? '取消收藏' : '加入收藏') : '登录后可收藏'}
        >
          {favorited ? '⭐' : '☆'}
        </button>
        )}

        <button
          type="button"
          className={`project-card__like${liked ? ' project-card__like--active' : ''}`}
          onClick={handleLike}
          aria-label={liked ? '取消点赞' : '点赞'}
        >
          <span className="project-card__like-icon">{liked ? '❤️' : '🤍'}</span>
          <span className="project-card__like-count">{work.likes || 0}</span>
        </button>
      </article>
    </ScrollReveal>
  )
}
