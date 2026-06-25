import { Link, useParams } from 'react-router-dom'
import WorkDetailContent from '../components/WorkDetailContent'
import './Detail.css'

export default function Detail() {
  const { id } = useParams()

  return (
    <div className="detail-page">
      <nav className="detail-page__nav">
        <Link to="/" className="detail-page__back">
          ← 返回智慧设计
        </Link>
      </nav>
      <div className="detail-page__panel">
        <WorkDetailContent workId={id} variant="page" />
      </div>
    </div>
  )
}
