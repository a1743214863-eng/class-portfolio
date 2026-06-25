import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/dark-mode.css'
import App from './App.jsx'

document.documentElement.setAttribute(
  'data-theme',
  localStorage.getItem('zhihui-design-theme') || 'light',
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
