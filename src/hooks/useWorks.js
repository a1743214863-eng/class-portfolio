import { useCallback, useEffect, useState } from 'react'
import { getWorks } from '../utils/storage'

export function useWorks() {
  const [works, setWorks] = useState([])

  const refreshWorks = useCallback(() => {
    setWorks(getWorks())
  }, [])

  useEffect(() => {
    refreshWorks()
  }, [refreshWorks])

  return { works, refreshWorks }
}
