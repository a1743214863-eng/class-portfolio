import { useEffect } from 'react'
import WorkDetailContent from './WorkDetailContent'
import './WorkDetailModal.css'

export default function WorkDetailModal({ workId, onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="work-modal" role="dialog" aria-modal="true" aria-label="作品详情">
      <button type="button" className="work-modal__backdrop" onClick={onClose} aria-label="关闭" />
      <div className="work-modal__panel">
        <button type="button" className="work-modal__close" onClick={onClose} aria-label="关闭">
          ×
        </button>
        <WorkDetailContent workId={workId} variant="modal" />
      </div>
    </div>
  )
}
