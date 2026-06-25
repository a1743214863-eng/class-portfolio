import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CLASSMATES } from '../data/classmates'
import { getStudentProfile } from '../data/studentProfiles'
import { useAuth } from '../context/AuthContext'
import { useWorksContext } from '../context/WorksContext'
import ProjectCard from '../components/ProjectCard'
import './PersonPage.css'

function getInitial(name) {
  return name?.trim().charAt(0) || '?'
}

export default function PersonPage() {
  const { name: encodedName } = useParams()
  const name = decodeURIComponent(encodedName || '')
  const { works, openWork, removeWork } = useWorksContext()
  const { user, isLoggedIn, refreshFavorites } = useAuth()
  const [tab, setTab] = useState('course')
  const [deletingId, setDeletingId] = useState(null)

  const isClassmate = CLASSMATES.includes(name)
  const profile = getStudentProfile(name)
  const isOwner = isLoggedIn && user?.name === name

  const personWorks = useMemo(() => {
    if (!isClassmate) return []
    return works
      .filter((w) => w.author === name)
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
  }, [works, name, isClassmate])

  const displayedWorks = useMemo(() => {
    if (tab === 'diy') {
      return personWorks.filter((w) => w.workType === 'diy')
    }
    return personWorks.filter((w) => w.workType !== 'diy')
  }, [personWorks, tab])

  const courseCount = personWorks.filter((w) => w.workType !== 'diy').length
  const diyCount = personWorks.filter((w) => w.workType === 'diy').length

  async function handleDeleteWork(work) {
    const confirmed = window.confirm(`确定删除作品「${work.title}」吗？此操作不可恢复。`)
    if (!confirmed) return

    setDeletingId(work.id)
    const result = removeWork(work.id, user.name)
    if (result.ok) {
      refreshFavorites()
    } else {
      window.alert('删除失败，请稍后重试')
    }
    setDeletingId(null)
  }

  if (!isClassmate) {
    return (
      <div className="person-page">
        <div className="person-page__invalid">
          <p className="person-page__invalid-icon">👤</p>
          <h1 className="person-page__invalid-title">未找到该同学</h1>
          <Link to="/people" className="person-page__invalid-link">
            返回同学目录 →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="person-page">
      <header className="person-page__header">
        <Link to="/people" className="person-page__back">
          ← 全部同学
        </Link>
        <div className="person-page__profile">
          <span className="person-page__avatar">{getInitial(name)}</span>
          <div>
            <h1 className="person-page__name">{name}</h1>
            <p className="person-page__bio">{profile.bio}</p>
            {isOwner && (
              <p className="person-page__self-hint">
                这是你的公开展示页 ·{' '}
                <Link to="/profile" className="person-page__manage-link">
                  在个人中心管理作品
                </Link>
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="person-page__tabs">
        <button
          type="button"
          className={`person-page__tab${tab === 'course' ? ' person-page__tab--active' : ''}`}
          onClick={() => setTab('course')}
        >
          课程作品 ({courseCount})
        </button>
        <button
          type="button"
          className={`person-page__tab${tab === 'diy' ? ' person-page__tab--active' : ''}`}
          onClick={() => setTab('diy')}
        >
          DIY 创作 ({diyCount})
        </button>
        {isOwner && (
          <Link to="/upload" className="person-page__upload-link btn-neon">
            + 上传作品
          </Link>
        )}
      </div>

      {displayedWorks.length > 0 ? (
        <section className="person-page__grid">
          {displayedWorks.map((work, index) => (
            <ProjectCard
              key={work.id}
              work={work}
              index={index}
              onOpen={openWork}
              onDelete={isOwner && deletingId !== work.id ? handleDeleteWork : undefined}
              showFavorite={!isOwner}
            />
          ))}
        </section>
      ) : (
        <div className="person-page__empty">
          <p className="person-page__empty-icon">{tab === 'diy' ? '🛠️' : '📭'}</p>
          <p className="person-page__empty-text">
            {tab === 'diy' ? '还没有 DIY 创作' : '还没有课程作品'}
          </p>
          <Link to={isOwner ? '/upload' : '/login'} className="person-page__empty-link">
            {isOwner ? '去上传作品 →' : '登录后可上传作品 →'}
          </Link>
        </div>
      )}
    </div>
  )
}
