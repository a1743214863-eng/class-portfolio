import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  getStoredUser,
  loginUser,
  logoutUser,
  isWorkFavorited,
  toggleFavorite as toggleFavoriteStorage,
  getUserFavorites,
} from '../utils/auth'
import { getWorkById } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())
  const [favoriteVersion, setFavoriteVersion] = useState(0)

  const login = useCallback((name) => {
    const loggedIn = loginUser(name)
    setUser(loggedIn)
    return loggedIn
  }, [])

  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
  }, [])

  const toggleFavorite = useCallback(
    (workId) => {
      if (!user) return { ok: false, needLogin: true }
      const added = toggleFavoriteStorage(user.name, workId)
      setFavoriteVersion((v) => v + 1)
      return { ok: true, favorited: added }
    },
    [user],
  )

  const isFavorited = useCallback(
    (workId) => {
      void favoriteVersion
      if (!user) return false
      return isWorkFavorited(user.name, workId)
    },
    [user, favoriteVersion],
  )

  const favoriteWorks = useMemo(() => {
    void favoriteVersion
    if (!user) return []
    return getUserFavorites(user.name)
      .map((id) => getWorkById(id))
      .filter(Boolean)
  }, [user, favoriteVersion])

  const refreshFavorites = useCallback(() => {
    setFavoriteVersion((v) => v + 1)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      login,
      logout,
      toggleFavorite,
      isFavorited,
      favoriteWorks,
      favoriteCount: favoriteWorks.length,
      refreshFavorites,
    }),
    [user, login, logout, toggleFavorite, isFavorited, favoriteWorks, refreshFavorites],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
