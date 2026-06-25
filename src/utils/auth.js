const SESSION_KEY = 'zhihui-design-user'
const FAVORITES_KEY = 'zhihui-design-favorites'

function getFavoritesMap() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveFavoritesMap(map) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(map))
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const user = JSON.parse(raw)
    return user?.name ? user : null
  } catch {
    return null
  }
}

export function loginUser(name) {
  const user = { name: name.trim(), loginAt: new Date().toISOString() }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY)
}

export function getUserFavorites(userName) {
  const map = getFavoritesMap()
  return map[userName] || []
}

export function isWorkFavorited(userName, workId) {
  if (!userName) return false
  return getUserFavorites(userName).includes(String(workId))
}

export function toggleFavorite(userName, workId) {
  if (!userName) return false

  const id = String(workId)
  const map = getFavoritesMap()
  const list = map[userName] || []
  const exists = list.includes(id)

  map[userName] = exists ? list.filter((item) => item !== id) : [id, ...list]
  saveFavoritesMap(map)

  return !exists
}

export function removeWorkFromAllFavorites(workId) {
  const id = String(workId)
  const map = getFavoritesMap()
  let changed = false

  for (const userName of Object.keys(map)) {
    const next = map[userName].filter((item) => item !== id)
    if (next.length !== map[userName].length) {
      map[userName] = next
      changed = true
    }
  }

  if (changed) {
    saveFavoritesMap(map)
  }
}

export function clearUserFavorites(userName) {
  const map = getFavoritesMap()
  delete map[userName]
  saveFavoritesMap(map)
}
