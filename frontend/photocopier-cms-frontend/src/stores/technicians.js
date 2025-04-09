import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTechniciansStore = defineStore('technicians', () => {
  // State
  const technicians = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedTechnician = ref(null)

  // Getters
  const activeTechnicians = computed(() => {
    return technicians.value.filter(tech => tech.status === 'active')
  })

  const availableTechnicians = computed(() => {
    return activeTechnicians.value.filter(tech => tech.availability === 'available')
  })

  const techniciansByBranch = computed(() => {
    return (branchId) => {
      return technicians.value.filter(tech => tech.branchId === branchId)
    }
  })

  const techniciansBySkill = computed(() => {
    return (skill) => {
      return technicians.value.filter(tech => tech.skills.includes(skill))
    }
  })

  const getTechnicianById = computed(() => {
    return (id) => {
      return technicians.value.find(tech => tech.id === id)
    }
  })

  // Actions
  const fetchTechnicians = async () => {
    loading.value = true
    error.value = null
    try {
      // TODO: Implement API call to fetch technicians
      // For now, using mock data
      technicians.value = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1 234 567 8900',
          status: 'active',
          availability: 'available',
          branchId: 1,
          skills: ['photocopier', 'printer', 'scanner'],
          experience: 5,
          rating: 4.8,
          completedTickets: 120,
          averageResponseTime: '2h 30m'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1 234 567 8901',
          status: 'active',
          availability: 'busy',
          branchId: 1,
          skills: ['photocopier', 'printer'],
          experience: 3,
          rating: 4.5,
          completedTickets: 85,
          averageResponseTime: '3h 15m'
        }
      ]
    } catch (err) {
      error.value = 'Failed to fetch technicians. Please try again.'
      console.error('Error fetching technicians:', err)
    } finally {
      loading.value = false
    }
  }

  const addTechnician = async (technicianData) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Implement API call to add technician
      console.log('Adding technician:', technicianData)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      technicians.value.push({
        id: Date.now(), // Temporary ID
        ...technicianData,
        status: 'active',
        availability: 'available',
        completedTickets: 0,
        averageResponseTime: '0h 0m'
      })
    } catch (err) {
      error.value = 'Failed to add technician. Please try again.'
      console.error('Error adding technician:', err)
    } finally {
      loading.value = false
    }
  }

  const updateTechnician = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Implement API call to update technician
      console.log('Updating technician:', { id, updates })
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const index = technicians.value.findIndex(tech => tech.id === id)
      if (index !== -1) {
        technicians.value[index] = {
          ...technicians.value[index],
          ...updates
        }
      }
    } catch (err) {
      error.value = 'Failed to update technician. Please try again.'
      console.error('Error updating technician:', err)
    } finally {
      loading.value = false
    }
  }

  const deleteTechnician = async (id) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Implement API call to delete technician
      console.log('Deleting technician:', id)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      technicians.value = technicians.value.filter(tech => tech.id !== id)
    } catch (err) {
      error.value = 'Failed to delete technician. Please try again.'
      console.error('Error deleting technician:', err)
    } finally {
      loading.value = false
    }
  }

  const updateAvailability = async (id, availability) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Implement API call to update availability
      console.log('Updating technician availability:', { id, availability })
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const technician = technicians.value.find(tech => tech.id === id)
      if (technician) {
        technician.availability = availability
      }
    } catch (err) {
      error.value = 'Failed to update availability. Please try again.'
      console.error('Error updating availability:', err)
    } finally {
      loading.value = false
    }
  }

  const assignToTicket = async (technicianId, ticketId) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Implement API call to assign technician to ticket
      console.log('Assigning technician to ticket:', { technicianId, ticketId })
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const technician = technicians.value.find(tech => tech.id === technicianId)
      if (technician) {
        technician.availability = 'busy'
      }
    } catch (err) {
      error.value = 'Failed to assign technician. Please try again.'
      console.error('Error assigning technician:', err)
    } finally {
      loading.value = false
    }
  }

  const updatePerformance = async (id, performanceData) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Implement API call to update performance metrics
      console.log('Updating technician performance:', { id, performanceData })
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const technician = technicians.value.find(tech => tech.id === id)
      if (technician) {
        technician.completedTickets = performanceData.completedTickets
        technician.averageResponseTime = performanceData.averageResponseTime
        technician.rating = performanceData.rating
      }
    } catch (err) {
      error.value = 'Failed to update performance metrics. Please try again.'
      console.error('Error updating performance:', err)
    } finally {
      loading.value = false
    }
  }

  const selectTechnician = (id) => {
    selectedTechnician.value = technicians.value.find(tech => tech.id === id)
  }

  const clearSelectedTechnician = () => {
    selectedTechnician.value = null
  }

  return {
    // State
    technicians,
    loading,
    error,
    selectedTechnician,

    // Getters
    activeTechnicians,
    availableTechnicians,
    techniciansByBranch,
    techniciansBySkill,
    getTechnicianById,

    // Actions
    fetchTechnicians,
    addTechnician,
    updateTechnician,
    deleteTechnician,
    updateAvailability,
    assignToTicket,
    updatePerformance,
    selectTechnician,
    clearSelectedTechnician
  }
}) 