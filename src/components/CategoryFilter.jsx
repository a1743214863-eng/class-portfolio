import { CATEGORIES } from '../data/categories'
import './CategoryFilter.css'

export default function CategoryFilter({ active, counts, onChange }) {
  const allCount = Object.values(counts).reduce((sum, n) => sum + n, 0)

  return (
    <div className="category-filter">
      <div className="category-filter__scroll">
        <button
          type="button"
          className={`category-filter__pill${active === '全部' ? ' category-filter__pill--active' : ''}`}
          onClick={() => onChange('全部')}
        >
          全部 ({allCount})
        </button>

        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`category-filter__pill${active === category.id ? ' category-filter__pill--active' : ''}`}
            onClick={() => onChange(category.id)}
          >
            {category.icon} {category.label} ({counts[category.id] || 0})
          </button>
        ))}
      </div>
    </div>
  )
}
