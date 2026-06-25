import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { WorksProvider } from './context/WorksContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import YearPage from './pages/YearPage'
import PeopleDirectory from './pages/PeopleDirectory'
import PersonPage from './pages/PersonPage'
import About from './pages/About'
import Contact from './pages/Contact'
import Detail from './pages/Detail'
import Upload from './pages/Upload'
import Login from './pages/Login'
import Profile from './pages/Profile'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <WorksProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/year/:year" element={<YearPage />} />
                <Route path="/people" element={<PeopleDirectory />} />
                <Route path="/people/:name" element={<PersonPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/work/:id" element={<Detail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Layout>
          </WorksProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
