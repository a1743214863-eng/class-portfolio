import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useWorks } from '../hooks/useWorks'
import { removeWorkFromAllFavorites } from '../utils/auth'
import { deleteWork as deleteWorkStorage, isWorkLiked, toggleLike as toggleLikeStorage } from '../utils/storage'
import WorkDetailModal from '../components/WorkDetailModal'

const WorksContext = createContext(null)

export function WorksProvider({ children }) {
  const { works, refreshWorks } = useWorks()
  const [searchQuery, setSearchQuery] = useState('')
  const [modalWorkId, setModalWorkId] = useState(null)
  const [likeVersion, setLikeVersion] = useState(0)

  const openWork = useCallback((id) => {
    setModalWorkId(String(id))
  }, [])

  const closeWork = useCallback(() => {
    setModalWorkId(null)
  }, [])

  const toggleLike = useCallback(
    (id) => {
      toggleLikeStorage(id)
      refreshWorks()
      setLikeVersion((v) => v + 1)
    },
    [refreshWorks],
  )

  const checkLiked = useCallback(
    (id) => {
      void likeVersion
      return isWorkLiked(id)
    },
    [likeVersion],
  )

  const removeWork = useCallback(
    (workId, authorName) => {
      const id = String(workId)
      const work = works.find((item) => item.id === id)

      if (!work || work.author !== authorName) {
        return { ok: false, reason: 'FORBIDDEN' }
      }

      const deleted = deleteWorkStorage(id)
      if (!deleted) {
        return { ok: false, reason: 'NOT_FOUND' }
      }

      removeWorkFromAllFavorites(id)

      if (modalWorkId === id) {
        setModalWorkId(null)
      }

      refreshWorks()
      setLikeVersion((v) => v + 1)

      return { ok: true }
    },
    [works, refreshWorks, modalWorkId],
  )

  const value = useMemo(
    () => ({
      works,
      refreshWorks,
      searchQuery,
      setSearchQuery,
      openWork,
      closeWork,
      toggleLike,
      isLiked: checkLiked,
      removeWork,
    }),
    [works, refreshWorks, searchQuery, openWork, closeWork, toggleLike, checkLiked, removeWork],
  )

  return (
    <WorksContext.Provider value={value}>
      {children}
      {modalWorkId && (
        <WorkDetailModal workId={modalWorkId} onClose={closeWork} />
      )}
    </WorksContext.Provider>
  )
}

export function useWorksContext() {
  const ctx = useContext(WorksContext)
  if (!ctx) {
    throw new Error('useWorksContext must be used within WorksProvider')
  }
  return ctx
}
