import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './Layout.css'

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Tracker', icon: '📊' },
    { path: '/dashboard', label: 'Dashboard', icon: '📈' },
    { path: '/reminders', label: 'Reminders', icon: '⏰' },
    { path: '/guides', label: 'Guides', icon: '📚' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>SCT Tracker</h1>
        </div>
        <div className="navbar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="navbar-user">
          <span className="user-email">{user?.email}</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default Layout

