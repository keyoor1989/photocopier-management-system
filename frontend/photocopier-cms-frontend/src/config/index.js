// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Auth Configuration
export const AUTH_CONFIG = {
  tokenKey: 'token',
  refreshTokenKey: 'refreshToken',
  userKey: 'user',
  tokenExpiration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  refreshTokenExpiration: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
}

// App Configuration
export const APP_CONFIG = {
  name: 'Photocopier CMS',
  version: '1.0.0',
  defaultLocale: 'en',
  supportedLocales: ['en', 'es', 'fr'],
  defaultTheme: 'light',
  supportedThemes: ['light', 'dark'],
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm:ss',
  dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
  itemsPerPage: 10,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf']
}

// Feature Flags
export const FEATURE_FLAGS = {
  enableTwoFactorAuth: true,
  enableEmailNotifications: true,
  enableSMSNotifications: false,
  enableWhatsAppIntegration: false,
  enableIndiaMARTIntegration: false,
  enableDocumentStorage: true
}

// Error Messages
export const ERROR_MESSAGES = {
  networkError: 'Network error occurred. Please check your internet connection.',
  serverError: 'Server error occurred. Please try again later.',
  unauthorized: 'You are not authorized to perform this action.',
  forbidden: 'Access to this resource is forbidden.',
  notFound: 'The requested resource was not found.',
  validationError: 'Please check your input and try again.',
  sessionExpired: 'Your session has expired. Please log in again.',
  invalidCredentials: 'Invalid email or password.',
  emailExists: 'This email is already registered.',
  weakPassword: 'Password must be at least 8 characters long and contain at least one number and one special character.',
  invalidToken: 'Invalid or expired token.',
  fileTooLarge: 'File size exceeds the maximum limit.',
  invalidFileType: 'File type is not allowed.',
  twoFactorRequired: 'Two-factor authentication is required.',
  invalidTwoFactorCode: 'Invalid two-factor authentication code.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  login: 'Successfully logged in.',
  logout: 'Successfully logged out.',
  profileUpdated: 'Profile updated successfully.',
  passwordChanged: 'Password changed successfully.',
  passwordResetSent: 'Password reset instructions have been sent to your email.',
  passwordReset: 'Password has been reset successfully.',
  userCreated: 'User created successfully.',
  userUpdated: 'User updated successfully.',
  userDeleted: 'User deleted successfully.',
  roleCreated: 'Role created successfully.',
  roleUpdated: 'Role updated successfully.',
  roleDeleted: 'Role deleted successfully.',
  permissionUpdated: 'Permissions updated successfully.',
  twoFactorEnabled: 'Two-factor authentication enabled successfully.',
  twoFactorDisabled: 'Two-factor authentication disabled successfully.',
  fileUploaded: 'File uploaded successfully.',
  settingsSaved: 'Settings saved successfully.'
}

// Default Values
export const DEFAULT_VALUES = {
  user: {
    role: 'user',
    status: 'active',
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    currency: 'USD',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss'
  },
  company: {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    taxId: '',
    registrationNumber: '',
    industry: '',
    website: '',
    logo: '',
    timezone: 'UTC',
    currency: 'USD',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss'
  }
}

export default {
  API_BASE_URL,
  AUTH_CONFIG,
  APP_CONFIG,
  FEATURE_FLAGS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEFAULT_VALUES
} 