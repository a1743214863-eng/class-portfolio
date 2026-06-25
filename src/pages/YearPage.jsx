import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useWorksContext } from '../context/WorksContext'
import { COURSES, SEMESTERS, isValidYear } from '../data/curriculum'
import { matchSearch } from '../utils/matchSearch'
import CourseFilter from '../components/CourseFilter'
import ProjectCard from '../components/ProjectCard'
import './YearPage.css'

export default function YearPage() {
  const { year } = useParams()
  const { works, searchQuery, openWork } = useWorksContext()
  const [semester, setSemester] = useState('1')
  const [courseFilter, setCourseFilter] = useState('全部')

  const validYear = isValidYear(year)

  const yearWorks = useMemo(() => {
    if (!validYear) return []
    return works.filter(
      (work) =>
        work.year === year &&
        work.workType === 'course' &&
        work.semester === semester &&
        matchSearch(work, searchQuery),
    )
  }, [works, year, semester, searchQuery, validYear])

  const courseCounts = useMemo(() => {
    const result = Object.fromEntries(COURSES.map((c) => [c, 0]))
    yearWorks.forEach((work) => {
      if (result[work.course] !== undefined) {
        result[work.course] += 1
      }
    })
    return result
  }, [yearWorks])

  const filteredWorks = useMemo(() => {
    let list = yearWorks
    if (courseFilter !== '全部') {
      list = list.filter((w) => w.course === courseFilter)
    }
    return [...list].sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
  }, [yearWorks, courseFilter])

  if (!validYear) {
    return (
      <div className="year-page">
        <div className="year-page__invalid">
          <p className="year-page__invalid-icon">📅</p>
          <h1 className="year-page__invalid-title">未找到该学年</h1>
          <p className="year-page__invalid-text">请从 2024、2025、2026 学年中选择</p>
          <Link to="/" className="year-page__invalid-link">
            返回首页 →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="year-page">
      <header className="year-page__header">
        <p className="year-page__label">Course Archive</p>
        <h1 className="year-page__title">{year} 学年课程作业</h1>
        <p className="year-page__subtitle">按学期与专业课浏览班级课程作品</p>
      </header>

      <div className="year-page__semesters">
        {SEMESTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`year-page__semester${semester === item.id ? ' year-page__semester--active' : ''}`}
            onClick={() => {
              setSemester(item.id)
              setCourseFilter('全部')
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <CourseFilter active={courseFilter} counts={courseCounts} onChange={setCourseFilter} />

      <div className="year-page__section-head">
        <h2 className="year-page__section-title">
          {SEMESTERS.find((s) => s.id === semester)?.label}
          {courseFilter !== '全部' ? ` · ${courseFilter}` : ''}
        </h2>
        <span className="year-page__section-count">{filteredWorks.length} 件</span>
      </div>

      <section className="year-page__grid">
        {filteredWorks.map((work, index) => (
          <ProjectCard key={work.id} work={work} index={index} onOpen={openWork} />
        ))}
      </section>

      {filteredWorks.length === 0 && (
        <div className="year-page__empty">
          <p className="year-page__empty-icon">📭</p>
          <p className="year-page__empty-text">
            {searchQuery.trim() ? '没有找到匹配的作品' : '该学期暂无课程作业'}
          </p>
          <Link to="/upload" className="year-page__empty-link">
            去上传作品 →
          </Link>
        </div>
      )}
    </div>
  )
}
