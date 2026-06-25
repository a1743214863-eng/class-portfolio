export function matchSearch(work, query) {
  if (!query.trim()) return true
  const q = query.trim().toLowerCase()
  return (
    work.title.toLowerCase().includes(q) ||
    work.author.toLowerCase().includes(q) ||
    work.category.toLowerCase().includes(q) ||
    (work.course || '').toLowerCase().includes(q)
  )
}
