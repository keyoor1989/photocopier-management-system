const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

class NetworkError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
  }
}

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = this.getCacheKey(url, options);
    
    // Check cache for GET requests
    if (options.method === 'GET' && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
      this.cache.delete(cacheKey);
    }

    let lastError;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await this.makeRequest(url, options);
        
        // Cache successful GET requests
        if (options.method === 'GET') {
          this.cache.set(cacheKey, {
            data: response,
            timestamp: Date.now()
          });
        }
        
        return response;
      } catch (error) {
        lastError = error;
        if (!this.shouldRetry(error, attempt)) {
          break;
        }
        await this.delay(RETRY_DELAY * Math.pow(2, attempt));
      }
    }
    
    throw lastError;
  }

  async makeRequest(url, options) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new NetworkError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof NetworkError) {
        throw error;
      }
      throw new NetworkError(
        error.message || 'Network request failed',
        0
      );
    }
  }

  shouldRetry(error, attempt) {
    // Retry on network errors or 5xx server errors
    return (
      attempt < MAX_RETRIES - 1 &&
      (error.status === 0 || (error.status >= 500 && error.status < 600))
    );
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getCacheKey(url, options) {
    return `${options.method || 'GET'}-${url}-${JSON.stringify(options.params || {})}`;
  }

  clearCache() {
    this.cache.clear();
  }

  invalidateCache(endpoint) {
    const url = `${this.baseURL}${endpoint}`;
    for (const [key] of this.cache) {
      if (key.includes(url)) {
        this.cache.delete(key);
      }
    }
  }
}

export const apiClient = new ApiClient('/api');

export const handleApiError = (error) => {
  if (error instanceof NetworkError) {
    switch (error.status) {
      case 401:
        return 'Please log in to continue';
      case 403:
        return 'You do not have permission to perform this action';
      case 404:
        return 'The requested resource was not found';
      case 422:
        return 'Invalid data provided';
      case 429:
        return 'Too many requests. Please try again later';
      case 500:
        return 'An internal server error occurred';
      case 503:
        return 'Service temporarily unavailable';
      default:
        return error.message || 'An unexpected error occurred';
    }
  }
  return 'Network connection error. Please check your internet connection';
}; 