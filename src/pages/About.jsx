import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import './About.css'

export default function About() {
  return (
    <div className="about-page">
      <ScrollReveal>
        <header className="about-page__hero">
          <p className="about-page__label">About Us</p>
          <h1 className="about-page__title">关于智慧设计</h1>
          <p className="about-page__lead">
            我们是一个专注于建筑、城市与物件设计的班级作品集平台，记录每一次课程探索与个人创作。
          </p>
        </header>
      </ScrollReveal>

      <div className="about-page__grid">
        <ScrollReveal delay={0.1}>
          <article className="about-page__card">
            <h2 className="about-page__card-title">我们的愿景</h2>
            <p className="about-page__card-text">
              将设计思维可视化、可分享、可沉淀。每一次模型、每一张图纸，都是通向更好空间的尝试。
            </p>
          </article>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <article className="about-page__card">
            <h2 className="about-page__card-title">平台结构</h2>
            <p className="about-page__card-text">
              按学年浏览课程作业，按同学浏览个人作品与 DIY 创作。从课堂到课外，完整呈现设计成长轨迹。
            </p>
          </article>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <article className="about-page__card">
            <h2 className="about-page__card-title">加入我们</h2>
            <p className="about-page__card-text">
              上传你的作品，与全班同学一起分享设计灵感。
            </p>
            <Link to="/upload" className="btn-neon about-page__cta">
              上传作品 →
            </Link>
          </article>
        </ScrollReveal>
      </div>
    </div>
  )
}
