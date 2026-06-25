import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../data/categories'
import { COURSES, SEMESTERS, YEARS } from '../data/curriculum'
import { useAuth } from '../context/AuthContext'
import { useWorksContext } from '../context/WorksContext'
import { addWork } from '../utils/storage'
import { compressImages } from '../utils/compressImage'
import './Upload.css'

function getSubmitErrorMessage(error) {
  const code = error?.message
  if (code === 'STORAGE_FULL') {
    return '浏览器存储空间已满，请减少图片数量，或删除一些旧作品后再试'
  }
  if (code === 'NOT_IMAGE') {
    return '请上传 JPG、PNG 等图片格式'
  }
  if (code === 'LOAD_ERROR' || code === 'COMPRESS_ERROR' || code === 'CANVAS_ERROR') {
    return '图片处理失败，请换一张图片重试'
  }
  return '提交失败，请减少图片数量或换用小一点的图片后重试'
}

function createImageItem(file) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    file,
    previewUrl: URL.createObjectURL(file),
  }
}

export default function Upload() {
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuth()
  const { refreshWorks } = useWorksContext()
  const imageItemsRef = useRef([])
  const currentYear = new Date().getFullYear().toString()
  const defaultYear = YEARS.includes(currentYear) ? currentYear : YEARS[YEARS.length - 1]

  const [form, setForm] = useState({
    title: '',
    author: '',
    category: '',
    advisor: '',
    year: defaultYear,
    semester: '1',
    course: '',
    workType: 'course',
    description: '',
  })
  const [imageItems, setImageItems] = useState([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  imageItemsRef.current = imageItems

  useEffect(() => {
    if (user?.name) {
      setForm((prev) => ({ ...prev, author: user.name }))
    }
  }, [user?.name])

  useEffect(() => {
    return () => {
      imageItemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl))
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleFileChange(event) {
    const selected = Array.from(event.target.files)
    if (selected.length === 0) return

    setImageItems((prev) => [...prev, ...selected.map(createImageItem)])
    event.target.value = ''
  }

  function removeImage(id) {
    setImageItems((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((item) => item.id !== id)
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!form.title.trim()) {
      setError('请填写作品名称')
      return
    }
    if (!form.category) {
      setError('请选择作品分类')
      return
    }
    if (form.workType === 'course' && !form.course) {
      setError('请选择课程')
      return
    }
    if (imageItems.length === 0) {
      setError('请至少上传一张作品图片')
      return
    }

    setSubmitting(true)

    try {
      const files = imageItems.map((item) => item.file)
      const images = await compressImages(files)
      addWork({
        title: form.title.trim(),
        author: user.name,
        category: form.category,
        advisor: form.advisor.trim(),
        year: form.year,
        semester: form.semester,
        course: form.workType === 'diy' ? 'DIY 创作' : form.course,
        workType: form.workType,
        description: form.description.trim(),
        images,
      })
      refreshWorks()
      navigate('/profile')
    } catch (error) {
      setError(getSubmitErrorMessage(error))
      setSubmitting(false)
    }
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="upload">
      <header className="upload__header">
        <h1 className="upload__title">上传作品</h1>
        <p className="upload__subtitle">填写作品信息，课程作业将出现在对应学年板块，DIY 将展示在个人页</p>
      </header>

      <form className="upload__form" onSubmit={handleSubmit}>
        <label className="upload__field">
          <span className="upload__label">作品名称 *</span>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="例如：滨水文化中心设计"
            className="upload__input"
          />
        </label>

        <label className="upload__field">
          <span className="upload__label">作者</span>
          <input
            type="text"
            name="author"
            value={user.name}
            readOnly
            className="upload__input upload__input--readonly"
          />
        </label>

        <label className="upload__field">
          <span className="upload__label">作品类型 *</span>
          <select
            name="workType"
            value={form.workType}
            onChange={handleChange}
            className="upload__input"
          >
            <option value="course">课程作业</option>
            <option value="diy">DIY 创作</option>
          </select>
        </label>

        <label className="upload__field">
          <span className="upload__label">作品分类 *</span>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="upload__input"
          >
            <option value="">请选择分类</option>
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.label}
              </option>
            ))}
          </select>
        </label>

        <div className="upload__row">
          <label className="upload__field">
            <span className="upload__label">学年 *</span>
            <select name="year" value={form.year} onChange={handleChange} className="upload__input">
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <label className="upload__field">
            <span className="upload__label">学期 *</span>
            <select name="semester" value={form.semester} onChange={handleChange} className="upload__input">
              {SEMESTERS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {form.workType === 'course' && (
          <label className="upload__field">
            <span className="upload__label">课程 *</span>
            <select name="course" value={form.course} onChange={handleChange} className="upload__input">
              <option value="">请选择课程</option>
              {COURSES.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="upload__field">
          <span className="upload__label">指导老师</span>
          <input
            type="text"
            name="advisor"
            value={form.advisor}
            onChange={handleChange}
            placeholder="例如：王老师"
            className="upload__input"
          />
        </label>

        <label className="upload__field">
          <span className="upload__label">作品简介</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="简要描述设计理念、材料、功能等……"
            className="upload__input upload__textarea"
          />
        </label>

        <div className="upload__field">
          <span className="upload__label">作品图片 *（可多选，可删除重选）</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="upload__file"
          />
          <p className="upload__hint">
            选择图片后可在下方预览，点 × 可删除单张。提交时会自动压缩，建议每张 5MB 以内
          </p>
        </div>

        {imageItems.length > 0 && (
          <div className="upload__preview">
            {imageItems.map((item, index) => (
              <div key={item.id} className="upload__preview-item">
                <img src={item.previewUrl} alt={`预览 ${index + 1}`} className="upload__preview-img" />
                <button
                  type="button"
                  className="upload__preview-remove"
                  onClick={() => removeImage(item.id)}
                  aria-label={`删除第 ${index + 1} 张图片`}
                >
                  ×
                </button>
                <span className="upload__preview-index">{index + 1}</span>
              </div>
            ))}
          </div>
        )}

        {error && <p className="upload__error">{error}</p>}

        <button type="submit" className="btn-neon btn-neon--filled upload__submit" disabled={submitting}>
          {submitting ? '正在处理图片……' : '提交作品'}
        </button>
      </form>
    </div>
  )
}
