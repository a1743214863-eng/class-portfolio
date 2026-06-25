import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { CLASSMATES } from '../data/classmates'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoggedIn } = useAuth()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  if (isLoggedIn) {
    return <Navigate to="/profile" replace />
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!name) {
      setError('请选择你的姓名')
      return
    }

    login(name)
    navigate('/profile')
  }

  return (
    <div className="login">
      <div className="login__panel">
        <h1 className="login__title">👋 欢迎回来</h1>
        <p className="login__subtitle">选择你的姓名，进入作品世界</p>

        <form className="login__form" onSubmit={handleSubmit}>
          <label className="login__field">
            <span className="login__label">👤 选择姓名</span>
            <select
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="login__input"
            >
              <option value="">请选择姓名</option>
              {CLASSMATES.map((classmate) => (
                <option key={classmate} value={classmate}>
                  {classmate}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="login__error">{error}</p>}

          <button type="submit" className="btn-neon btn-neon--filled login__submit">
            进入智慧设计 →
          </button>
        </form>

        <div className="login__demo">
          <span className="login__demo-badge">💡 演示版 · 无需密码</span>
          <span className="login__demo-text">选择同学姓名即可登录</span>
        </div>
      </div>
    </div>
  )
}
