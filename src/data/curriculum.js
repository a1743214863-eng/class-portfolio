export const YEARS = ['2024', '2025', '2026']

export const SEMESTERS = [
  { id: '1', label: '上学期' },
  { id: '2', label: '下学期' },
]

export const COURSES = [
  '建筑设计基础',
  '城市设计概论',
  '构造技术',
  '手绘表现',
  '模型制作',
  '综合课程设计',
]

export function isValidYear(year) {
  return YEARS.includes(String(year))
}

export function getSemesterLabel(semesterId) {
  return SEMESTERS.find((s) => s.id === String(semesterId))?.label || '未知学期'
}

export function getWorkTypeLabel(workType) {
  return workType === 'diy' ? 'DIY 创作' : '课程作业'
}
