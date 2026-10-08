import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Shell from './components/Shell'
import Me from './pages/Me'
import Origin from './pages/Origin'
import Stack from './pages/Stack'
import Experience, { ExperienceDetail } from './pages/Experience'
import Projects, { ProjectDetail } from './pages/Projects'
import Education from './pages/Education'
import Certifications from './pages/Certifications'
import GitHub from './pages/GitHub'
import Collab from './pages/Collab'
import NotFound from './pages/NotFound'
import { profile, experience, projects, fallbackRepos } from './data/profile'

// Loads the GitHub profile and public repos, falling back to a cached list.
function useGitHub() {
  const [state, setState] = useState({ user: null, repos: fallbackRepos, live: false })

  useEffect(() => {
    const api = `https://api.github.com/users/${profile.githubUser}`
    const get = (url) => fetch(url).then((r) => (r.ok ? r.json() : Promise.reject()))
    Promise.all([get(api), get(`${api}/repos?per_page=100&sort=updated`)])
      .then(([user, repos]) =>
        setState({ user, repos: repos.filter((r) => !r.fork && r.name !== profile.githubUser), live: true })
      )
      .catch(() => {})
  }, [])

  return state
}

export default function App() {
  const github = useGitHub()

  return (
    <Routes>
      <Route element={<Shell github={github} />}>
        <Route path="/" element={<Me />} />
        <Route path="/me" element={<Navigate to="/" replace />} />
        <Route path="/me/origin" element={<Origin />} />
        <Route path="/stack" element={<Stack />} />

        <Route path="/experience" element={<Experience />}>
          <Route index element={<Navigate to={experience[0].slug} replace />} />
          <Route path=":slug" element={<ExperienceDetail />} />
        </Route>

        <Route path="/projects" element={<Projects />}>
          <Route index element={<Navigate to={projects[0].slug} replace />} />
          <Route path=":slug" element={<ProjectDetail />} />
        </Route>

        <Route path="/education" element={<Education />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/github" element={<GitHub />} />
        <Route path="/collab" element={<Collab />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
