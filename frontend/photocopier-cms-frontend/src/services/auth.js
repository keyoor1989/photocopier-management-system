import api from './api'

export const authService = {
  // Authentication methods
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async logout() {
    const response = await api.post('/auth/logout')
    return response.data
  },

  async sendPasswordResetLink(email) {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  async resetPassword(token, password) {
    const response = await api.post('/auth/reset-password', {
      token,
      password
    })
    return response.data
  },

  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh-token', { refreshToken })
    return response.data
  },

  // User profile methods
  async getProfile() {
    const response = await api.get('/auth/profile')
    return response.data
  },

  async updateProfile(data) {
    const response = await api.put('/auth/profile', data)
    return response.data
  },

  async changePassword(data) {
    const response = await api.post('/auth/change-password', data)
    return response.data
  },

  // User management methods
  async getUsers(params = {}) {
    const response = await api.get('/users', { params })
    return response.data
  },

  async getUserById(userId) {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },

  async createUser(userData) {
    const response = await api.post('/users', userData)
    return response.data
  },

  async updateUser(userId, userData) {
    const response = await api.put(`/users/${userId}`, userData)
    return response.data
  },

  async deactivateUser(userId) {
    const response = await api.put(`/users/${userId}/deactivate`)
    return response.data
  },

  async activateUser(userId) {
    const response = await api.put(`/users/${userId}/activate`)
    return response.data
  },

  async deleteUser(userId) {
    const response = await api.delete(`/users/${userId}`)
    return response.data
  },

  // Role and permission methods
  async getRoles() {
    const response = await api.get('/roles')
    return response.data
  },

  async getRoleById(roleId) {
    const response = await api.get(`/roles/${roleId}`)
    return response.data
  },

  async createRole(roleData) {
    const response = await api.post('/roles', roleData)
    return response.data
  },

  async updateRole(roleId, roleData) {
    const response = await api.put(`/roles/${roleId}`, roleData)
    return response.data
  },

  async deleteRole(roleId) {
    const response = await api.delete(`/roles/${roleId}`)
    return response.data
  },

  async assignRoleToUser(userId, roleId) {
    const response = await api.post(`/users/${userId}/roles`, { roleId })
    return response.data
  },

  async removeRoleFromUser(userId, roleId) {
    const response = await api.delete(`/users/${userId}/roles/${roleId}`)
    return response.data
  },

  async getPermissions() {
    const response = await api.get('/permissions')
    return response.data
  },

  async assignPermissionsToRole(roleId, permissions) {
    const response = await api.post(`/roles/${roleId}/permissions`, { permissions })
    return response.data
  },

  async removePermissionsFromRole(roleId, permissions) {
    const response = await api.delete(`/roles/${roleId}/permissions`, { data: { permissions } })
    return response.data
  },

  // Password management
  async forcePasswordChange(userId) {
    const response = await api.post(`/users/${userId}/force-password-change`)
    return response.data
  },

  async resetUserPassword(userId, newPassword) {
    const response = await api.post(`/users/${userId}/reset-password`, { password: newPassword })
    return response.data
  },

  // Branch assignment
  async assignUserToBranch(userId, branchId) {
    const response = await api.post(`/users/${userId}/branches`, { branchId })
    return response.data
  },

  async removeUserFromBranch(userId, branchId) {
    const response = await api.delete(`/users/${userId}/branches/${branchId}`)
    return response.data
  },

  async getUserBranches(userId) {
    const response = await api.get(`/users/${userId}/branches`)
    return response.data
  },

  // Two-factor authentication
  async setupTwoFactor() {
    const response = await api.post('/auth/2fa/setup')
    return response.data
  },

  async verifyTwoFactor(code) {
    const response = await api.post('/auth/2fa/verify', { code })
    return response.data
  },

  async disableTwoFactor(code) {
    const response = await api.post('/auth/2fa/disable', { code })
    return response.data
  },

  // Session management
  async getUserSessions(userId) {
    const response = await api.get(`/users/${userId}/sessions`)
    return response.data
  },

  async terminateSession(userId, sessionId) {
    const response = await api.delete(`/users/${userId}/sessions/${sessionId}`)
    return response.data
  },

  async terminateAllSessions(userId) {
    const response = await api.delete(`/users/${userId}/sessions`)
    return response.data
  },

  // Activity logging
  async getUserActivity(userId, params = {}) {
    const response = await api.get(`/users/${userId}/activity`, { params })
    return response.data
  },

  async getLoginHistory(userId, params = {}) {
    const response = await api.get(`/users/${userId}/login-history`, { params })
    return response.data
  }
}

export default authService 