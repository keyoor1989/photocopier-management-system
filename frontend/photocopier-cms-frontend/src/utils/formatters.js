import { format, formatDistanceToNow, parseISO } from 'date-fns'

/**
 * Formats a number as currency
 * @param {number} value - The number to format
 * @param {string} [currency='USD'] - The currency code
 * @param {string} [locale='en-US'] - The locale to use
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, currency = 'USD', locale = 'en-US') {
  if (typeof value !== 'number') {
    return 'N/A'
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

/**
 * Formats a number as a percentage
 * @param {number} value - The number to format (0-1)
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimals = 2) {
  if (typeof value !== 'number') {
    return 'N/A'
  }
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Formats a time duration in milliseconds to a human-readable string
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} Formatted time string
 */
export function formatTime(milliseconds) {
  if (typeof milliseconds !== 'number') {
    return 'N/A'
  }

  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ${hours % 24}h`
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  }
  return `${seconds}s`
}

/**
 * Formats a date to a human-readable string
 * @param {string|Date} date - The date to format
 * @param {string} [formatStr='MMM d, yyyy'] - The format string
 * @returns {string} Formatted date string
 */
export function formatDate(date, formatStr = 'MMM d, yyyy') {
  if (!date) {
    return 'N/A'
  }
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return format(parsedDate, formatStr)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid Date'
  }
}

/**
 * Formats a date to a relative time string (e.g., "2 hours ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
  if (!date) {
    return 'N/A'
  }
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(parsedDate, { addSuffix: true })
  } catch (error) {
    console.error('Error formatting relative time:', error)
    return 'Invalid Date'
  }
}

/**
 * Formats a percentage change value with appropriate sign and color
 * @param {number} value - The change value (e.g., 0.15 for 15% increase)
 * @param {number} [decimals=1] - Number of decimal places
 * @returns {string} Formatted change string with sign
 */
export function formatChange(value, decimals = 1) {
  if (typeof value !== 'number') {
    return 'N/A'
  }
  const sign = value > 0 ? '+' : ''
  return `${sign}${(value * 100).toFixed(decimals)}%`
} 