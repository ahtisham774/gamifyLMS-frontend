import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is already logged in (token exists in localStorage)
    const token = localStorage.getItem('token')

    if (token) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [])

  // Load user data using stored token
  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        setLoading(false)
        return
      }

      // Set token in API headers
      api.setAuthToken(token)

      // Fetch user profile
      const response = await api.get('/auth/profile')
      
      if (response.data.success) {
        setUser(response.data.user)
      } else {
        // Handle case where token is invalid
        logout()
      }
    } catch (err) {
      console.error('Error loading user:', err)
      logout()
    } finally {
      setLoading(false)
    }
  }

  // Register a new user
  const register = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.post('/auth/register', userData)

      if (response.data.success) {
        // Store token
        localStorage.setItem('token', response.data.user.token)

        // Set token in API headers
        api.setAuthToken(response.data.user.token)

        // Set user state
        setUser(response.data.user)

        toast.success('Registration successful!')
        return true
      } else {
        setError(response.data.message || 'Registration failed')
        toast.error(response.data.message || 'Registration failed')
        return false
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed'
      setError(errorMessage)
      toast.error(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Login user
  const login = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.post('/auth/login', { email, password })

      if (response.data.success) {
        // Store token
        localStorage.setItem('token', response.data.user.token)

        // Set token in API headers
        api.setAuthToken(response.data.user.token)

        // Set user state
        setUser(response.data.user)

        toast.success('Login successful!')
        return true
      } else {
        setError(response.data.message || 'Login failed')
        toast.error(response.data.message || 'Login failed')
        return false
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed'
      setError(errorMessage)
      toast.error(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Logout user
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token')

    // Remove token from API headers
    api.removeAuthToken()

    // Clear user state
    setUser(null)

    toast.info('You have been logged out')
  }

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.put('/auth/profile', userData)

      if (response.data.success) {
        // Update user state
        setUser(response.data.user)

        toast.success('Profile updated successfully!')
        return true
      } else {
        setError(response.data.message || 'Profile update failed')
        toast.error(response.data.message || 'Profile update failed')
        return false
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Profile update failed'
      setError(errorMessage)
      toast.error(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
