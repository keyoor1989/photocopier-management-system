import api from './api'

export const inventoryService = {
  /**
   * Get a list of inventory items with filtering and pagination
   * @param {Object} params - Query parameters for filtering and pagination
   * @returns {Promise} - API response
   */
  async getInventoryItems(params = {}) {
    const response = await api.get('/inventory', { params })
    return response.data
  },

  /**
   * Get a single inventory item by ID
   * @param {string} id - Inventory item ID
   * @returns {Promise} - API response
   */
  async getInventoryItem(id) {
    const response = await api.get(`/inventory/${id}`)
    return response.data
  },

  /**
   * Create a new inventory item
   * @param {Object} itemData - Inventory item data
   * @returns {Promise} - API response
   */
  async createInventoryItem(itemData) {
    const response = await api.post('/inventory', itemData)
    return response.data
  },

  /**
   * Update an existing inventory item
   * @param {string} id - Inventory item ID
   * @param {Object} itemData - Updated inventory item data
   * @returns {Promise} - API response
   */
  async updateInventoryItem(id, itemData) {
    const response = await api.put(`/inventory/${id}`, itemData)
    return response.data
  },

  /**
   * Delete an inventory item
   * @param {string} id - Inventory item ID
   * @returns {Promise} - API response
   */
  async deleteInventoryItem(id) {
    const response = await api.delete(`/inventory/${id}`)
    return response.data
  },

  /**
   * Adjust stock level for an inventory item
   * @param {string} id - Inventory item ID
   * @param {Object} adjustmentData - Stock adjustment data (quantity, reason, reference)
   * @returns {Promise} - API response
   */
  async adjustStockLevel(id, adjustmentData) {
    const response = await api.post(`/inventory/${id}/adjust`, adjustmentData)
    return response.data
  },

  /**
   * Get stock history for an inventory item
   * @param {string} id - Inventory item ID
   * @returns {Promise} - API response
   */
  async getStockHistory(id) {
    const response = await api.get(`/inventory/${id}/history`)
    return response.data
  },

  /**
   * Get inventory categories
   * @returns {Promise} - API response
   */
  async getCategories() {
    const response = await api.get('/inventory/categories')
    return response.data
  },

  /**
   * Get suppliers
   * @returns {Promise} - API response
   */
  async getSuppliers() {
    const response = await api.get('/inventory/suppliers')
    return response.data
  },

  /**
   * Generate barcode for an inventory item
   * @param {string} id - Inventory item ID
   * @param {Object} options - Barcode generation options
   * @returns {Promise} - API response with barcode data
   */
  async generateBarcode(id, options = {}) {
    const response = await api.post(`/inventory/${id}/barcode`, options)
    return response.data
  },

  /**
   * Get inventory items by category
   * @param {string} categoryId - Category ID
   * @returns {Promise} - API response
   */
  async getItemsByCategory(categoryId) {
    const response = await api.get(`/inventory/category/${categoryId}`)
    return response.data
  },

  /**
   * Get inventory items by supplier
   * @param {string} supplierId - Supplier ID
   * @returns {Promise} - API response
   */
  async getItemsBySupplier(supplierId) {
    const response = await api.get(`/inventory/supplier/${supplierId}`)
    return response.data
  },

  /**
   * Get low stock items
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  async getLowStockItems(params = {}) {
    const response = await api.get('/inventory/low-stock', { params })
    return response.data
  },

  /**
   * Get out of stock items
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  async getOutOfStockItems(params = {}) {
    const response = await api.get('/inventory/out-of-stock', { params })
    return response.data
  },

  /**
   * Get inventory valuation report
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  async getInventoryValuation(params = {}) {
    const response = await api.get('/inventory/valuation', { params })
    return response.data
  },

  /**
   * Get inventory forecasting data
   * @param {string} id - Inventory item ID
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  async getInventoryForecast(id, params = {}) {
    const response = await api.get(`/inventory/${id}/forecast`, { params })
    return response.data
  },

  /**
   * Set auto-reorder settings for an inventory item
   * @param {string} id - Inventory item ID
   * @param {Object} settings - Auto-reorder settings
   * @returns {Promise} - API response
   */
  async setAutoReorderSettings(id, settings) {
    const response = await api.post(`/inventory/${id}/auto-reorder`, settings)
    return response.data
  },

  /**
   * Import inventory items from CSV or Excel file
   * @param {FormData} formData - Form data containing the file
   * @returns {Promise} - API response
   */
  async importInventory(formData) {
    const response = await api.post('/inventory/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  /**
   * Export inventory items to CSV or Excel file
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with file blob
   */
  async exportInventory(params = {}) {
    const response = await api.get('/inventory/export', { 
      params,
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Perform inventory cycle count
   * @param {Object} countData - Cycle count data
   * @returns {Promise} - API response
   */
  async performCycleCount(countData) {
    const response = await api.post('/inventory/cycle-count', countData)
    return response.data
  },

  /**
   * Get inventory locations
   * @returns {Promise} - API response
   */
  async getInventoryLocations() {
    const response = await api.get('/inventory/locations')
    return response.data
  },

  /**
   * Update inventory item location
   * @param {string} id - Inventory item ID
   * @param {Object} locationData - Location data
   * @returns {Promise} - API response
   */
  async updateItemLocation(id, locationData) {
    const response = await api.post(`/inventory/${id}/location`, locationData)
    return response.data
  },

  /**
   * Get compatible machines for an inventory item
   * @param {string} id - Inventory item ID
   * @returns {Promise} - API response
   */
  async getCompatibleMachines(id) {
    const response = await api.get(`/inventory/${id}/compatible-machines`)
    return response.data
  },

  /**
   * Add compatible machine to an inventory item
   * @param {string} id - Inventory item ID
   * @param {string} machineId - Machine ID
   * @returns {Promise} - API response
   */
  async addCompatibleMachine(id, machineId) {
    const response = await api.post(`/inventory/${id}/compatible-machines`, { machineId })
    return response.data
  },

  /**
   * Remove compatible machine from an inventory item
   * @param {string} id - Inventory item ID
   * @param {string} machineId - Machine ID
   * @returns {Promise} - API response
   */
  async removeCompatibleMachine(id, machineId) {
    const response = await api.delete(`/inventory/${id}/compatible-machines/${machineId}`)
    return response.data
  },

  /**
   * Upload product image
   * @param {string} id - Inventory item ID
   * @param {FormData} formData - Form data containing the image
   * @returns {Promise} - API response
   */
  async uploadProductImage(id, formData) {
    const response = await api.post(`/inventory/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

export default inventoryService 