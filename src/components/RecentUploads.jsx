import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { YEARS } from '../data/curriculum'
import ProjectCard from './ProjectCard'
import './RecentUploads.css'

const RECENT_LIMIT = 9

export default function RecentUploads({ works, onOpen }) {
  const recentWorks = useMemo(() => {
    return [...works]
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
      .slice(0, RECENT_LIMIT)
  }, [works])

  const viewAllPath = useMemo(() => {
    const newestYear = recentWorks[0]?.year
    const year = YEARS.includes(newestYear) ? newestYear : YEARS[YEARS.length - 1]
    return `/year/${year}`
  }, [recentWorks])

  if (recentWorks.length === 0) return null

  return (
    <section className="recent-uploads" aria-label="最近上传">
      <div className="recent-uploads__head">
        <h2 className="recent-uploads__title">最近上传</h2>
        <Link to={viewAllPath} className="recent-uploads__more">
          查看全部 →
        </Link>
      </div>
      <div className="recent-uploads__grid">
        {recentWorks.map((work, index) => (
          <ProjectCard key={work.id} work={work} index={index} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}
