import { Link } from 'react-router-dom'
import { CLASSMATES } from '../data/classmates'
import { useWorksContext } from '../context/WorksContext'
import './PeopleDirectory.css'

function getInitial(name) {
  return name?.trim().charAt(0) || '?'
}

export default function PeopleDirectory() {
  const { works } = useWorksContext()

  return (
    <div className="people-dir">
      <header className="people-dir__header">
        <p className="people-dir__label">Classmates</p>
        <h1 className="people-dir__title">同学个人页</h1>
        <p className="people-dir__subtitle">浏览每位同学的课程作品与 DIY 创作</p>
      </header>

      <div className="people-dir__grid">
        {CLASSMATES.map((name) => {
          const workCount = works.filter((w) => w.author === name).length
          const diyCount = works.filter((w) => w.author === name && w.workType === 'diy').length

          return (
            <Link
              key={name}
              to={`/people/${encodeURIComponent(name)}`}
              className="people-dir__card"
            >
              <span className="people-dir__avatar">{getInitial(name)}</span>
              <span className="people-dir__name">{name}</span>
              <span className="people-dir__meta">
                {workCount} 件作品
                {diyCount > 0 && ` · ${diyCount} 件 DIY`}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
