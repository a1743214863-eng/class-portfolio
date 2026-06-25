import './IntroTicker.css'

const TAGS = ['课程作业', '学期归档', '建筑', '城市', '构造', '模型', '同学作品', 'DIY']

export default function IntroTicker() {
  return (
    <section className="intro-tags" aria-label="站点导航提示">
      <p className="intro-tags__lead">按学年浏览专业课作品，或进入同学个人页</p>
      <ul className="intro-tags__list">
        {TAGS.map((tag) => (
          <li key={tag} className="intro-tags__pill">
            {tag}
          </li>
        ))}
      </ul>
    </section>
  )
}
