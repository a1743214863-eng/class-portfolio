import { Fragment, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWorksContext } from '../context/WorksContext'
import { CLASSMATES } from '../data/classmates'
import { YEARS } from '../data/curriculum'
import { matchSearch } from '../utils/matchSearch'
import FeaturedWork from '../components/FeaturedWork'
import HeroParallax from '../components/HeroParallax'
import IntroTicker from '../components/IntroTicker'
import RecentUploads from '../components/RecentUploads'
import ScrollReveal from '../components/ScrollReveal'
import SectionCards from '../components/SectionCards'
import TypewriterSlogan from '../components/TypewriterSlogan'
import './Home.css'

export default function Home() {
  const { works, searchQuery, openWork } = useWorksContext()
  const { isLoggedIn } = useAuth()
  const [subtitleVisible, setSubtitleVisible] = useState(false)
  const currentYear = new Date().getFullYear()

  const filteredWorks = useMemo(() => {
    if (!searchQuery.trim()) return works
    return works.filter((work) => matchSearch(work, searchQuery))
  }, [works, searchQuery])

  const stats = useMemo(() => {
    const source = filteredWorks
    const authors = new Set(source.map((w) => w.author))
    const activeCategories = new Set(source.map((w) => w.category)).size
    return {
      works: source.length,
      authors: authors.size,
      categories: activeCategories,
      classmates: CLASSMATES.length,
    }
  }, [filteredWorks])

  const featuredWorks = useMemo(() => {
    const source = searchQuery.trim() ? filteredWorks : works
    return [...source]
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
      .slice(0, 5)
  }, [works, filteredWorks, searchQuery])

  const statItems = [
    { icon: '🎨', value: stats.works, label: '件作品' },
    { icon: '✍️', value: stats.authors, label: '位作者' },
    { icon: '🗂️', value: stats.categories, label: '个分类' },
    { icon: '👥', value: stats.classmates, label: '位同学' },
  ]

  return (
    <div className="home">
      <HeroParallax>
        <header className="home__header home__hero">
          <p className="home__label">Class Portfolio</p>
          <h1 className="home__title">智慧设计</h1>

          <TypewriterSlogan onComplete={() => setSubtitleVisible(true)} />

          <p className={`home__subtitle${subtitleVisible ? ' home__subtitle--visible' : ''}`}>
            班级建筑与物品作品展示 · 记录每一次设计探索
          </p>

          <div className="home__stats">
            {statItems.map((item, index) => (
              <Fragment key={item.label}>
                {index > 0 && <div className="home__stat-divider" aria-hidden="true" />}
                <div className="home__stat">
                  <div className="home__stat-top">
                    <span className="home__stat-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="home__stat-num">{item.value}</span>
                  </div>
                  <span className="home__stat-glow-line" aria-hidden="true" />
                  <span className="home__stat-label">{item.label}</span>
                </div>
              </Fragment>
            ))}
          </div>
        </header>
      </HeroParallax>

      <div className="home__body">
        <div className="home__main">
          {searchQuery.trim() && (
            <p className="home__search-hint">
              找到 <strong>{filteredWorks.length}</strong> 件相关作品
            </p>
          )}

      <ScrollReveal>
        <IntroTicker />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <SectionCards />
      </ScrollReveal>

      {featuredWorks.length > 0 && (
        <ScrollReveal delay={0.15}>
          <div className="home__featured-wrap">
            <h2 className="home__featured-title">最新推荐</h2>
            <FeaturedWork works={featuredWorks} onOpen={openWork} />
          </div>
        </ScrollReveal>
      )}

      {works.length > 0 && (
        <ScrollReveal delay={0.2}>
          <RecentUploads works={filteredWorks} onOpen={openWork} />
        </ScrollReveal>
      )}

        </div>
      </div>

      <footer className="home-footer">
        <div className="home-footer__cta">
          <div className="home-footer__cta-inner">
            <span className="home-footer__eyebrow">Digital Twin Studio</span>
            <h2 className="home-footer__cta-title">记录每一次设计探索</h2>
            <p className="home-footer__cta-desc">
              上传课程作业或 DIY 创作，作品将同步展示在学年板块与你的个人页
            </p>
            <div className="home-footer__cta-actions">
              <Link to="/upload" className="btn-neon btn-neon--filled home-footer__cta-btn">
                上传你的作品
              </Link>
              <Link to="/people" className="btn-neon home-footer__cta-btn home-footer__cta-btn--ghost">
                浏览同学作品
              </Link>
            </div>
          </div>
        </div>

        <div className="home-footer__main">
          <div className="home-footer__brand">
            <Link to="/" className="home-footer__brand-link">
              <span className="home-footer__brand-mark" aria-hidden="true" />
              <span className="home-footer__brand-text">
                <span className="home-footer__brand-cn">数字孪生教研室</span>
                <span className="home-footer__brand-en">Digital Twin Studio</span>
              </span>
            </Link>
            <p className="home-footer__brand-desc">
              班级建筑与物件作品库，聚合课程作业、DIY 创作与数字孪生设计探索。
            </p>
            <ul className="home-footer__tags" aria-label="作品类型">
              {['建筑设计', '物件设计', '城市设计', 'DIY 创作'].map((tag) => (
                <li key={tag} className="home-footer__tag">
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <nav className="home-footer__nav" aria-label="探索板块">
            <h3 className="home-footer__nav-title">探索板块</h3>
            <ul className="home-footer__nav-list">
              {YEARS.map((year) => (
                <li key={year}>
                  <Link to={`/year/${year}`}>{year} 学年</Link>
                </li>
              ))}
              <li>
                <Link to="/people">同学个人页</Link>
              </li>
            </ul>
          </nav>

          <nav className="home-footer__nav" aria-label="站点导航">
            <h3 className="home-footer__nav-title">站点</h3>
            <ul className="home-footer__nav-list">
              <li>
                <Link to="/about">关于我们</Link>
              </li>
              <li>
                <Link to="/contact">联系</Link>
              </li>
              <li>
                <Link to="/upload">上传作品</Link>
              </li>
              <li>
                <Link to={isLoggedIn ? '/profile' : '/login'}>
                  {isLoggedIn ? '个人中心' : '同学登录'}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="home-footer__bottom">
          <p className="home-footer__copy">
            © {currentYear} 数字孪生教研室 · 与 {CLASSMATES.length} 位同学一起分享每一次创作
          </p>
        </div>
      </footer>
    </div>
  )
}
