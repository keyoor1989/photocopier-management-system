import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/auth'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const isAuthenticated = computed(() => !!token.value)
  const error = ref(null)
  const loading = ref(false)
  const isVerifying = ref(false)

  // Initialize from localStorage
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
    // Set axios default header if token exists
    if (token.value) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    }
  }

  // Actions
  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('token', newToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }

  function setUser(userData) {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // For development/testing purposes
  const testCredentials = {
    email: 'admin@example.com',
    password: 'admin123'
  }

  async function login({ email, password, rememberMe = false }) {
    try {
      loading.value = true
      error.value = null
      console.log('Auth store: Attempting login...')

      const response = await authService.login({ email, password })
      console.log('Auth store: Login response received:', response)

      if (response.success) {
        console.log('Auth store: Login successful, setting token and user')
        setToken(response.token)
        setUser(response.user)

        if (rememberMe) {
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
        }

        return { success: true }
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (err) {
      console.error('Auth store: Login error:', err)
      error.value = err.response?.data?.message || err.message || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  function clearAuth() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
  }

  async function logout() {
    try {
      await authService.logout()
    } finally {
      clearAuth()
    }
  }

  async function checkAuth() {
    if (!token.value || isVerifying.value) return false

    try {
      isVerifying.value = true
      const response = await authService.verifyToken(token.value)
      if (response.success) {
        setToken(response.token)
        setUser(response.user)
        return true
      }
    } catch (err) {
      console.error('Auth store: Token verification error:', err)
      clearAuth()
    } finally {
      isVerifying.value = false
    }
    return false
  }

  async function updateProfile(data) {
    const response = await authService.updateProfile(data)
    user.value = response.user
    localStorage.setItem('user', JSON.stringify(response.user))
    return response
  }

  async function changePassword(data) {
    return await authService.changePassword(data)
  }

  async function sendPasswordResetLink(email) {
    return await authService.sendPasswordResetLink(email)
  }

  async function resetPassword(token, password) {
    return await authService.resetPassword(token, password)
  }

  // Return store interface
  return {
    // State
    user,
    token,
    isAuthenticated,
    error,
    loading,
    isVerifying,

    // Actions
    setToken,
    setUser,
    login,
    logout,
    checkAuth,
    updateProfile,
    changePassword,
    sendPasswordResetLink,
    resetPassword,
    clearAuth
  }
}) 