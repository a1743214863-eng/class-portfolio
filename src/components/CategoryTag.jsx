import { getCategoryInfo } from '../data/categories'
import './CategoryTag.css'

export default function CategoryTag({ category, variant = 'default' }) {
  const info = getCategoryInfo(category)

  return (
    <span className={`category-tag category-tag--${variant}`}>
      <span className="category-tag__icon" aria-hidden="true">
        {info.icon}
      </span>
      <span className="category-tag__label">{info.label}</span>
    </span>
  )
}
