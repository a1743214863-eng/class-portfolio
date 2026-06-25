import './CourseFilter.css'

export default function CourseFilter({ active, counts, onChange }) {
  const allCount = Object.values(counts).reduce((sum, n) => sum + n, 0)

  return (
    <div className="course-filter">
      <div className="course-filter__scroll">
        <button
          type="button"
          className={`course-filter__pill${active === '全部' ? ' course-filter__pill--active' : ''}`}
          onClick={() => onChange('全部')}
        >
          全部 ({allCount})
        </button>

        {Object.entries(counts).map(([course, count]) => (
          <button
            key={course}
            type="button"
            className={`course-filter__pill${active === course ? ' course-filter__pill--active' : ''}`}
            onClick={() => onChange(course)}
          >
            {course} ({count})
          </button>
        ))}
      </div>
    </div>
  )
}
