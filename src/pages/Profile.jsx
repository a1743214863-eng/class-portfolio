import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWorksContext } from '../context/WorksContext'
import ProjectCard from '../components/ProjectCard'
import './Profile.css'

function getInitial(name) {
  return name?.trim().charAt(0) || '?'
}

export default function Profile() {
  const { user, isLoggedIn, logout, favoriteWorks, favoriteCount, refreshFavorites } = useAuth()
  const { works, openWork, removeWork } = useWorksContext()
  const [worksTab, setWorksTab] = useState('course')
  const [deletingId, setDeletingId] = useState(null)

  const myWorks = useMemo(() => {
    if (!user) return []
    return works
      .filter((work) => work.author === user.name)
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
  }, [works, user])

  const displayedWorks = useMemo(() => {
    if (worksTab === 'diy') {
      return myWorks.filter((work) => work.workType === 'diy')
    }
    return myWorks.filter((work) => work.workType !== 'diy')
  }, [myWorks, worksTab])

  const courseCount = myWorks.filter((work) => work.workType !== 'diy').length
  const diyCount = myWorks.filter((work) => work.workType === 'diy').length

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

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

  return (
    <div className="profile">
      <header className="profile__header">
        <div className="profile__user">
          <span className="profile__avatar">{getInitial(user.name)}</span>
          <div>
            <h1 className="profile__title">个人中心</h1>
            <p className="profile__name">{user.name}</p>
          </div>
        </div>
        <button type="button" className="profile__logout" onClick={logout}>
          退出登录
        </button>
      </header>

      <p className="profile__public-link-wrap">
        <Link
          to={`/people/${encodeURIComponent(user.name)}`}
          className="profile__public-link"
        >
          查看我的公开展示页 →
        </Link>
      </p>

      <section className="profile__section">
        <div className="profile__section-head">
          <h2 className="profile__section-title">我的作品</h2>
          <Link to="/upload" className="profile__add-btn btn-neon">
            + 上传作品
          </Link>
        </div>

        <div className="profile__tabs">
          <button
            type="button"
            className={`profile__tab${worksTab === 'course' ? ' profile__tab--active' : ''}`}
            onClick={() => setWorksTab('course')}
          >
            课程作品 ({courseCount})
          </button>
          <button
            type="button"
            className={`profile__tab${worksTab === 'diy' ? ' profile__tab--active' : ''}`}
            onClick={() => setWorksTab('diy')}
          >
            DIY 创作 ({diyCount})
          </button>
        </div>

        {displayedWorks.length > 0 ? (
          <div className="profile__grid">
            {displayedWorks.map((work, index) => (
              <ProjectCard
                key={work.id}
                work={work}
                index={index}
                onOpen={openWork}
                onDelete={deletingId === work.id ? undefined : handleDeleteWork}
                showFavorite={false}
              />
            ))}
          </div>
        ) : (
          <div className="profile__empty">
            <p className="profile__empty-icon">{worksTab === 'diy' ? '🛠️' : '📭'}</p>
            <p className="profile__empty-text">
              {worksTab === 'diy' ? '还没有 DIY 创作' : '还没有课程作品'}
            </p>
            <p className="profile__empty-hint">上传后会同步展示在你的公开展示页</p>
            <Link to="/upload" className="profile__empty-link">
              去上传作品 →
            </Link>
          </div>
        )}
      </section>

      <section className="profile__section">
        <div className="profile__section-head">
          <h2 className="profile__section-title">我的收藏</h2>
          <span className="profile__section-count">{favoriteCount} 件</span>
        </div>

        {favoriteWorks.length > 0 ? (
          <div className="profile__grid">
            {favoriteWorks.map((work, index) => (
              <ProjectCard key={work.id} work={work} index={index} onOpen={openWork} />
            ))}
          </div>
        ) : (
          <div className="profile__empty">
            <p className="profile__empty-icon">⭐</p>
            <p className="profile__empty-text">还没有收藏任何作品</p>
            <p className="profile__empty-hint">在作品卡片或详情页点击「收藏」即可加入</p>
            <Link to="/people" className="profile__empty-link">
              去同学目录逛逛 →
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
