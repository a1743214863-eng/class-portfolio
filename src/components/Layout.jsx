import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { YEARS } from '../data/curriculum'
import DynamicBackground from './DynamicBackground'
import PageLoader from './PageLoader'
import ScrollToTop from './ScrollToTop'
import SiteSearch from './SiteSearch'
import './Layout.css'

function isYearActive(pathname, year) {
  return pathname === `/year/${year}`
}

export default function Layout({ children }) {
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()
  const { isLoggedIn, user, favoriteCount } = useAuth()
  const peopleActive =
    location.pathname === '/people' || location.pathname.startsWith('/people/')

  return (
    <PageLoader>
      <div className="layout">
        <DynamicBackground />
        <div className="layout__overlay" aria-hidden="true" />
        <nav className="layout__nav">
          <div className="layout__brand-wrap">
            <Link to="/" className="layout__brand" aria-label="数字孪生教研室 Digital Twin Studio">
              <span className="layout__brand-mark" aria-hidden="true" />
              <span className="layout__brand-text">
                <span className="layout__brand-cn">数字孪生教研室</span>
                <span className="layout__brand-en">Digital Twin Studio</span>
              </span>
            </Link>
          </div>

          <div className="layout__search-wrap">
            <SiteSearch nav />
          </div>

          <div className="layout__nav-side layout__nav-side--right">
            <div className="layout__links">
              <div className="layout__links-group layout__links-group--nav">
                <Link
                  to="/"
                  className={`layout__link${location.pathname === '/' ? ' layout__link--active' : ''}`}
                >
                  首页
                </Link>

                <div className="layout__year-links">
                  {YEARS.map((year) => (
                    <Link
                      key={year}
                      to={`/year/${year}`}
                      className={`layout__link layout__link--year${isYearActive(location.pathname, year) ? ' layout__link--active' : ''}`}
                    >
                      {year}
                    </Link>
                  ))}
                </div>

                <Link
                  to="/people"
                  className={`layout__link${peopleActive ? ' layout__link--active' : ''}`}
                >
                  同学
                </Link>

                <Link
                  to="/about"
                  className={`layout__link${location.pathname === '/about' ? ' layout__link--active' : ''}`}
                >
                  关于
                </Link>

                <Link
                  to="/contact"
                  className={`layout__link${location.pathname === '/contact' ? ' layout__link--active' : ''}`}
                >
                  联系
                </Link>
              </div>

              <Link
                to="/upload"
                className={`layout__link layout__link--cta btn-neon${location.pathname === '/upload' ? ' layout__link--active' : ''}`}
              >
                上传作品
              </Link>

              <div className="layout__links-divider" aria-hidden="true" />

              <div className="layout__links-group layout__links-group--icons">
                <button
                  type="button"
                  className="layout__icon-btn"
                  onClick={toggleTheme}
                  aria-label={isDark ? '切换到浅色模式' : '切换到暗色模式'}
                >
                  {isDark ? '☀️' : '🌙'}
                </button>
                {isLoggedIn ? (
                  <Link
                    to="/profile"
                    className={`layout__icon-btn layout__icon-btn--profile${location.pathname === '/profile' ? ' layout__icon-btn--active' : ''}`}
                    aria-label={`个人中心：${user.name}`}
                  >
                    <span className="layout__icon-btn-emoji" aria-hidden="true">
                      👤
                    </span>
                    {favoriteCount > 0 && (
                      <span className="layout__icon-badge">{favoriteCount}</span>
                    )}
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className={`layout__icon-btn${location.pathname === '/login' ? ' layout__icon-btn--active' : ''}`}
                    aria-label="登录"
                  >
                    👤
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main className="layout__main">{children}</main>
        <ScrollToTop />
      </div>
    </PageLoader>
  )
}
