import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import PrivateRoute from './components/PrivateRoute'
import InstallPrompt from './components/InstallPrompt'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Tracker from './components/Tracker/SCTTracker'
import Dashboard from './components/Dashboard/Dashboard'
import Reminders from './components/Reminders/Reminders'
import Guides from './components/Guides/Guides'
import Settings from './components/Settings/Settings'
import Layout from './components/Layout/Layout'
import './styles/App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Tracker />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/reminders" element={<Reminders />} />
                    <Route path="/guides" element={<Guides />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
        <InstallPrompt />
      </Router>
    </AuthProvider>
  )
}

export default App

