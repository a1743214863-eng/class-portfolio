import { Link } from 'react-router-dom'
import { YEARS } from '../data/curriculum'
import './SectionCards.css'

const PEOPLE_CARD = {
  to: '/people',
  year: null,
  title: '同学个人页',
  desc: '浏览每位同学的课程作品与 DIY 创作',
  icon: '👥',
}

export default function SectionCards() {
  const cards = [
    ...YEARS.map((year) => ({
      to: `/year/${year}`,
      year,
      title: `${year} 学年`,
      desc: '按学期与专业课浏览课程作业',
      icon: '📚',
    })),
    PEOPLE_CARD,
  ]

  return (
    <section className="section-cards" aria-label="板块入口">
      <h2 className="section-cards__title">探索板块</h2>
      <div className="section-cards__grid">
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className="section-cards__card">
            <span className="section-cards__icon" aria-hidden="true">
              {card.icon}
            </span>
            <span className="section-cards__card-title">{card.title}</span>
            <span className="section-cards__card-desc">{card.desc}</span>
            <span className="section-cards__arrow">→</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
