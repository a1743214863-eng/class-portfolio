import { useWorksContext } from '../context/WorksContext'
import './SiteSearch.css'

function SearchIcon() {
  return (
    <svg
      className="site-search__icon-svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  )
}

export default function SiteSearch({ className = '', nav = false, compact = false }) {
  const { searchQuery, setSearchQuery } = useWorksContext()
  const isNav = nav || compact

  return (
    <div
      className={`site-search${isNav ? ' site-search--nav' : ''}${className ? ` ${className}` : ''}`}
    >
      {!isNav && <p className="site-search__label">搜索作品</p>}
      <div className="site-search__field">
        <span className="site-search__icon" aria-hidden="true">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isNav ? '搜索作品、作者、课程…' : '作品、作者、课程…'}
          className="site-search__input"
          aria-label="搜索作品"
        />
        {isNav && searchQuery && (
          <button
            type="button"
            className="site-search__clear"
            onClick={() => setSearchQuery('')}
            aria-label="清除搜索"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
