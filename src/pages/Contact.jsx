import ScrollReveal from '../components/ScrollReveal'
import './Contact.css'

export default function Contact() {
  return (
    <div className="contact-page">
      <ScrollReveal>
        <header className="contact-page__hero">
          <p className="contact-page__label">Contact</p>
          <h1 className="contact-page__title">联系我们</h1>
          <p className="contact-page__lead">
            有任何问题、合作意向或作品上传疑问，欢迎通过以下方式联系班级管理员。
          </p>
        </header>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="contact-page__cards">
          <article className="contact-page__card">
            <span className="contact-page__icon">📧</span>
            <h2 className="contact-page__card-title">邮箱</h2>
            <p className="contact-page__card-value">design@class-portfolio.edu</p>
          </article>

          <article className="contact-page__card">
            <span className="contact-page__icon">💬</span>
            <h2 className="contact-page__card-title">班级群</h2>
            <p className="contact-page__card-value">智慧设计 · 班级交流群</p>
          </article>

          <article className="contact-page__card">
            <span className="contact-page__icon">📍</span>
            <h2 className="contact-page__card-title">工作室</h2>
            <p className="contact-page__card-value">建筑设计学院 · 智慧设计工作室</p>
          </article>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <form className="contact-page__form" onSubmit={(e) => e.preventDefault()}>
          <h2 className="contact-page__form-title">留言</h2>
          <label className="contact-page__field">
            <span>姓名</span>
            <input type="text" placeholder="你的姓名" className="contact-page__input" />
          </label>
          <label className="contact-page__field">
            <span>消息</span>
            <textarea rows={4} placeholder="想说的话…" className="contact-page__input" />
          </label>
          <button type="submit" className="btn-neon btn-neon--filled">
            发送留言 →
          </button>
        </form>
      </ScrollReveal>
    </div>
  )
}
