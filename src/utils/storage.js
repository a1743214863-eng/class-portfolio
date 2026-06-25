import { seedWorks } from '../data/seedWorks'
import { COURSES } from '../data/curriculum'

const STORAGE_KEY = 'zhihui-design-works'
const USER_LIKES_KEY = 'zhihui-design-user-likes'

const DEFAULT_COURSE = COURSES[COURSES.length - 1] || '综合课程设计'

function normalizeWork(work) {
  const images = work.images?.length ? work.images : work.image ? [work.image] : []
  const workType = work.workType === 'diy' ? 'diy' : 'course'

  return {
    ...work,
    id: String(work.id),
    images,
    image: work.image || images[0] || '',
    likes: Number(work.likes) || 0,
    advisor: work.advisor || '',
    year: work.year ? String(work.year) : new Date().getFullYear().toString(),
    semester: work.semester ? String(work.semester) : '1',
    course: work.course || DEFAULT_COURSE,
    workType,
  }
}

function getUserLikeSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem(USER_LIKES_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

function saveWorks(works) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(works))
  } catch (error) {
    if (error?.name === 'QuotaExceededError') {
      throw new Error('STORAGE_FULL')
    }
    throw error
  }
}

export function getWorks() {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    const initial = seedWorks.map(normalizeWork)
    saveWorks(initial)
    return initial
  }

  try {
    return JSON.parse(raw).map(normalizeWork)
  } catch {
    const initial = seedWorks.map(normalizeWork)
    saveWorks(initial)
    return initial
  }
}

export function getWorkById(id) {
  return getWorks().find((work) => work.id === String(id))
}

export function isWorkLiked(workId) {
  return getUserLikeSet().has(String(workId))
}

export function toggleLike(workId) {
  const id = String(workId)
  const userLikes = getUserLikeSet()
  const works = getWorks()
  const index = works.findIndex((work) => work.id === id)

  if (index === -1) return null

  const work = { ...works[index] }

  if (userLikes.has(id)) {
    work.likes = Math.max(0, work.likes - 1)
    userLikes.delete(id)
  } else {
    work.likes += 1
    userLikes.add(id)
  }

  works[index] = work
  saveWorks(works)
  localStorage.setItem(USER_LIKES_KEY, JSON.stringify([...userLikes]))

  return { likes: work.likes, liked: userLikes.has(id) }
}

export function addWork(work) {
  const works = getWorks()
  const images = work.images?.length ? work.images : []
  const newWork = normalizeWork({
    ...work,
    id: Date.now().toString(),
    images,
    image: images[0] || '',
    likes: 0,
    created_at: new Date().toISOString().split('T')[0],
  })

  works.unshift(newWork)
  saveWorks(works)
  return newWork
}

export function deleteWork(workId) {
  const id = String(workId)
  const works = getWorks()
  const index = works.findIndex((work) => work.id === id)

  if (index === -1) return false

  works.splice(index, 1)
  saveWorks(works)

  const userLikes = getUserLikeSet()
  if (userLikes.has(id)) {
    userLikes.delete(id)
    localStorage.setItem(USER_LIKES_KEY, JSON.stringify([...userLikes]))
  }

  return true
}

export function resetWorks() {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(USER_LIKES_KEY)
  return getWorks()
}
