import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      const { access_token, user_id, email: userEmail } = response.data
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/66441fe7-28f3-4874-ab27-777c6beb2043',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useAuth.jsx:login:success',message:'Login successful, storing token',data:{tokenLength:access_token?.length || 0,userId:user_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      // #endregion
      const userData = { id: user_id, email: userEmail }
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/66441fe7-28f3-4874-ab27-777c6beb2043',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useAuth.jsx:login:error',message:'Login failed',data:{error:error.response?.data?.detail || 'Unknown error'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      // #endregion
      return { success: false, error: error.response?.data?.detail || 'Login failed' }
    }
  }

  const register = async (email, password) => {
    try {
      const response = await authAPI.register(email, password)
      const { access_token, user_id, email: userEmail } = response.data
      const userData = { id: user_id, email: userEmail }
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Registration failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

