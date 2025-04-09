import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const refreshToken = ref(localStorage.getItem('refreshToken'))
  const isAuthenticated = computed(() => !!token.value)
  const error = ref(null)
  const loading = ref(false)

  // For development/testing purposes
  const testCredentials = {
    email: 'admin@example.com',
    password: 'admin123'
  }

  async function login({ email, password, rememberMe }) {
    try {
      loading.value = true
      error.value = null

      // For development/testing - check against test credentials
      if (email === testCredentials.email && password === testCredentials.password) {
        const testUser = {
          id: 1,
          email: testCredentials.email,
          name: 'Admin User',
          role: 'admin'
        }
        
        // Simulate API token
        const testToken = 'test-jwt-token'
        
        user.value = testUser
        token.value = testToken
        isAuthenticated.value = true
        
        if (rememberMe) {
          localStorage.setItem('token', testToken)
        }
        
        return testUser
      } else {
        throw new Error('Invalid email or password')
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
    }
  }

  function clearAuth() {
    user.value = null
    token.value = null
    refreshToken.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }

  async function checkAuth() {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      token.value = storedToken
      isAuthenticated.value = true
      // In a real app, you would validate the token with the backend here
    }
  }

  async function updateProfile(data) {
    const response = await authService.updateProfile(data)
    user.value = response.user
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

  return {
    user,
    token,
    refreshToken,
    isAuthenticated,
    error,
    loading,
    login,
    logout,
    checkAuth,
    updateProfile,
    changePassword,
    sendPasswordResetLink,
    resetPassword
  }
}) 