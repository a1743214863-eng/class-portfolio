export const CATEGORIES = [
  { id: '建筑设计', icon: '🏛️', label: '建筑设计' },
  { id: '城市设计', icon: '🌆', label: '城市设计' },
  { id: '作品物件', icon: '🪑', label: '作品物件' },
  { id: '手绘草图', icon: '✏️', label: '手绘草图' },
  { id: '构造技术', icon: '📐', label: '构造技术' },
  { id: '课程作业', icon: '🎓', label: '课程作业' },
  { id: '建筑摄影', icon: '📷', label: '建筑摄影' },
]

export function getCategoryInfo(categoryId) {
  return CATEGORIES.find((c) => c.id === categoryId) ?? {
    id: categoryId,
    icon: '📁',
    label: categoryId || '未分类',
  }
}

export function formatCategory(categoryId) {
  const info = getCategoryInfo(categoryId)
  return `${info.icon} ${info.label}`
}
