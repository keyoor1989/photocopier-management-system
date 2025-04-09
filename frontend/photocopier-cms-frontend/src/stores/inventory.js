import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import inventoryService from '@/services/inventory'

export const useInventoryStore = defineStore('inventory', () => {
  // State
  const inventoryItems = ref([])
  const selectedItem = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const categories = ref([])
  const suppliers = ref([])
  const locations = ref([])
  const stockHistory = ref([])
  const compatibleMachines = ref([])
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0
  })
  const filters = ref({
    search: '',
    category: '',
    supplier: '',
    location: '',
    stockStatus: '', // 'in-stock', 'low-stock', 'out-of-stock'
    minPrice: null,
    maxPrice: null
  })
  const importProgress = ref(0)
  const exportProgress = ref(0)
  const lowStockThreshold = ref(5) // Default threshold for low stock alerts

  // Getters
  const filteredInventory = computed(() => {
    return inventoryItems.value.filter(item => {
      const matchesSearch = !filters.value.search || 
        item.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        item.sku.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        item.barcode?.toLowerCase().includes(filters.value.search.toLowerCase())
      const matchesCategory = !filters.value.category || item.category === filters.value.category
      const matchesSupplier = !filters.value.supplier || item.supplier === filters.value.supplier
      const matchesLocation = !filters.value.location || item.location === filters.value.location
      const matchesStockStatus = !filters.value.stockStatus || 
        (filters.value.stockStatus === 'in-stock' && item.quantity > lowStockThreshold.value) ||
        (filters.value.stockStatus === 'low-stock' && item.quantity <= lowStockThreshold.value && item.quantity > 0) ||
        (filters.value.stockStatus === 'out-of-stock' && item.quantity === 0)
      const matchesPriceRange = 
        (!filters.value.minPrice || item.price >= filters.value.minPrice) &&
        (!filters.value.maxPrice || item.price <= filters.value.maxPrice)
      
      return matchesSearch && matchesCategory && matchesSupplier && 
             matchesLocation && matchesStockStatus && matchesPriceRange
    })
  })

  const lowStockItems = computed(() => {
    return inventoryItems.value.filter(item => 
      item.quantity <= lowStockThreshold.value && item.quantity > 0
    )
  })

  const outOfStockItems = computed(() => {
    return inventoryItems.value.filter(item => item.quantity === 0)
  })

  const inventoryValue = computed(() => {
    return inventoryItems.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })

  // Actions
  async function fetchInventoryItems() {
    loading.value = true
    error.value = null
    try {
      const response = await inventoryService.getInventoryItems({
        page: pagination.value.page,
        limit: pagination.value.limit,
        ...filters.value
      })
      inventoryItems.value = response.data
      pagination.value.total = response.total
    } catch (err) {
      error.value = err.message
      console.error('Error fetching inventory items:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchInventoryItem(id) {
    loading.value = true
    error.value = null
    try {
      const item = await inventoryService.getInventoryItem(id)
      selectedItem.value = item
    } catch (err) {
      error.value = err.message
      console.error('Error fetching inventory item:', err)
    } finally {
      loading.value = false
    }
  }

  async function createInventoryItem(itemData) {
    loading.value = true
    error.value = null
    try {
      const item = await inventoryService.createInventoryItem(itemData)
      inventoryItems.value.push(item)
      return item
    } catch (err) {
      error.value = err.message
      console.error('Error creating inventory item:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateInventoryItem(id, itemData) {
    loading.value = true
    error.value = null
    try {
      const item = await inventoryService.updateInventoryItem(id, itemData)
      const index = inventoryItems.value.findIndex(i => i._id === id)
      if (index !== -1) {
        inventoryItems.value[index] = item
      }
      if (selectedItem.value?._id === id) {
        selectedItem.value = item
      }
      return item
    } catch (err) {
      error.value = err.message
      console.error('Error updating inventory item:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteInventoryItem(id) {
    loading.value = true
    error.value = null
    try {
      await inventoryService.deleteInventoryItem(id)
      inventoryItems.value = inventoryItems.value.filter(i => i._id !== id)
      if (selectedItem.value?._id === id) {
        selectedItem.value = null
      }
    } catch (err) {
      error.value = err.message
      console.error('Error deleting inventory item:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function adjustStockLevel(id, adjustmentData) {
    loading.value = true
    error.value = null
    try {
      const item = await inventoryService.adjustStockLevel(id, adjustmentData)
      const index = inventoryItems.value.findIndex(i => i._id === id)
      if (index !== -1) {
        inventoryItems.value[index] = item
      }
      if (selectedItem.value?._id === id) {
        selectedItem.value = item
      }
      return item
    } catch (err) {
      error.value = err.message
      console.error('Error adjusting stock level:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchStockHistory(id) {
    loading.value = true
    error.value = null
    try {
      const history = await inventoryService.getStockHistory(id)
      stockHistory.value = history
      return history
    } catch (err) {
      error.value = err.message
      console.error('Error fetching stock history:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    loading.value = true
    error.value = null
    try {
      const data = await inventoryService.getCategories()
      categories.value = data
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching categories:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchSuppliers() {
    loading.value = true
    error.value = null
    try {
      const data = await inventoryService.getSuppliers()
      suppliers.value = data
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching suppliers:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchLocations() {
    loading.value = true
    error.value = null
    try {
      const data = await inventoryService.getInventoryLocations()
      locations.value = data
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching locations:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function generateBarcode(id, options) {
    loading.value = true
    error.value = null
    try {
      const barcode = await inventoryService.generateBarcode(id, options)
      return barcode
    } catch (err) {
      error.value = err.message
      console.error('Error generating barcode:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCompatibleMachines(id) {
    loading.value = true
    error.value = null
    try {
      const machines = await inventoryService.getCompatibleMachines(id)
      compatibleMachines.value = machines
      return machines
    } catch (err) {
      error.value = err.message
      console.error('Error fetching compatible machines:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addCompatibleMachine(id, machineId) {
    loading.value = true
    error.value = null
    try {
      const result = await inventoryService.addCompatibleMachine(id, machineId)
      await fetchCompatibleMachines(id) // Refresh the list
      return result
    } catch (err) {
      error.value = err.message
      console.error('Error adding compatible machine:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function removeCompatibleMachine(id, machineId) {
    loading.value = true
    error.value = null
    try {
      const result = await inventoryService.removeCompatibleMachine(id, machineId)
      await fetchCompatibleMachines(id) // Refresh the list
      return result
    } catch (err) {
      error.value = err.message
      console.error('Error removing compatible machine:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function importInventory(formData) {
    loading.value = true
    error.value = null
    importProgress.value = 0
    try {
      const response = await inventoryService.importInventory(formData)
      await fetchInventoryItems() // Refresh the inventory list
      return response
    } catch (err) {
      error.value = err.message
      console.error('Error importing inventory:', err)
      throw err
    } finally {
      loading.value = false
      importProgress.value = 100
    }
  }

  async function exportInventory() {
    loading.value = true
    error.value = null
    exportProgress.value = 0
    try {
      const blob = await inventoryService.exportInventory(filters.value)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `inventory-export-${new Date().toISOString()}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      error.value = err.message
      console.error('Error exporting inventory:', err)
      throw err
    } finally {
      loading.value = false
      exportProgress.value = 100
    }
  }

  async function getInventoryValuation() {
    loading.value = true
    error.value = null
    try {
      const valuation = await inventoryService.getInventoryValuation(filters.value)
      return valuation
    } catch (err) {
      error.value = err.message
      console.error('Error getting inventory valuation:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getInventoryForecast(id) {
    loading.value = true
    error.value = null
    try {
      const forecast = await inventoryService.getInventoryForecast(id)
      return forecast
    } catch (err) {
      error.value = err.message
      console.error('Error getting inventory forecast:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function setAutoReorderSettings(id, settings) {
    loading.value = true
    error.value = null
    try {
      const result = await inventoryService.setAutoReorderSettings(id, settings)
      const index = inventoryItems.value.findIndex(i => i._id === id)
      if (index !== -1) {
        inventoryItems.value[index] = { ...inventoryItems.value[index], ...result }
      }
      if (selectedItem.value?._id === id) {
        selectedItem.value = { ...selectedItem.value, ...result }
      }
      return result
    } catch (err) {
      error.value = err.message
      console.error('Error setting auto-reorder settings:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function performCycleCount(countData) {
    loading.value = true
    error.value = null
    try {
      const result = await inventoryService.performCycleCount(countData)
      await fetchInventoryItems() // Refresh the inventory list
      return result
    } catch (err) {
      error.value = err.message
      console.error('Error performing cycle count:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateItemLocation(id, locationData) {
    loading.value = true
    error.value = null
    try {
      const result = await inventoryService.updateItemLocation(id, locationData)
      const index = inventoryItems.value.findIndex(i => i._id === id)
      if (index !== -1) {
        inventoryItems.value[index] = { ...inventoryItems.value[index], ...result }
      }
      if (selectedItem.value?._id === id) {
        selectedItem.value = { ...selectedItem.value, ...result }
      }
      return result
    } catch (err) {
      error.value = err.message
      console.error('Error updating item location:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function uploadProductImage(id, formData) {
    loading.value = true
    error.value = null
    try {
      const result = await inventoryService.uploadProductImage(id, formData)
      const index = inventoryItems.value.findIndex(i => i._id === id)
      if (index !== -1) {
        inventoryItems.value[index] = { ...inventoryItems.value[index], ...result }
      }
      if (selectedItem.value?._id === id) {
        selectedItem.value = { ...selectedItem.value, ...result }
      }
      return result
    } catch (err) {
      error.value = err.message
      console.error('Error uploading product image:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1 // Reset to first page when filters change
  }

  function setPagination(newPagination) {
    pagination.value = { ...pagination.value, ...newPagination }
  }

  function setLowStockThreshold(threshold) {
    lowStockThreshold.value = threshold
  }

  function clearSelectedItem() {
    selectedItem.value = null
  }

  return {
    // State
    inventoryItems,
    selectedItem,
    loading,
    error,
    categories,
    suppliers,
    locations,
    stockHistory,
    compatibleMachines,
    pagination,
    filters,
    importProgress,
    exportProgress,
    lowStockThreshold,

    // Getters
    filteredInventory,
    lowStockItems,
    outOfStockItems,
    inventoryValue,

    // Actions
    fetchInventoryItems,
    fetchInventoryItem,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    adjustStockLevel,
    fetchStockHistory,
    fetchCategories,
    fetchSuppliers,
    fetchLocations,
    generateBarcode,
    fetchCompatibleMachines,
    addCompatibleMachine,
    removeCompatibleMachine,
    importInventory,
    exportInventory,
    getInventoryValuation,
    getInventoryForecast,
    setAutoReorderSettings,
    performCycleCount,
    updateItemLocation,
    uploadProductImage,
    setFilters,
    setPagination,
    setLowStockThreshold,
    clearSelectedItem
  }
}) 