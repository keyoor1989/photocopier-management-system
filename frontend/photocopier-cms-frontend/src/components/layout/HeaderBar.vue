<template>
  <header class="header-bar">
    <div class="header-left">
      <button class="sidebar-toggle" @click="$emit('toggle-sidebar')">
        <i class="fas fa-bars"></i>
      </button>
      <div class="breadcrumb">
        <router-link to="/app/dashboard" class="breadcrumb-item">Home</router-link>
        <span v-if="currentRoute" class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item current">{{ currentRoute }}</span>
      </div>
    </div>

    <div class="header-right">
      <div class="header-actions">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search..."
            v-model="searchQuery"
            @input="handleSearch"
          />
        </div>

        <div class="notifications">
          <button class="notification-btn" @click="toggleNotifications">
            <i class="fas fa-bell"></i>
            <span v-if="unreadCount > 0" class="notification-badge">
              {{ unreadCount }}
            </span>
          </button>
          <div v-if="showNotifications" class="notification-dropdown">
            <div class="notification-header">
              <h3>Notifications</h3>
              <button @click="markAllAsRead">Mark all as read</button>
            </div>
            <div class="notification-list">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="notification-item"
                :class="{ unread: !notification.read }"
                @click="handleNotificationClick(notification)"
              >
                <div class="notification-icon">
                  <i :class="getNotificationIcon(notification.type)"></i>
                </div>
                <div class="notification-content">
                  <p class="notification-text">{{ notification.message }}</p>
                  <span class="notification-time">{{ formatTime(notification.time) }}</span>
                </div>
              </div>
              <div v-if="notifications.length === 0" class="no-notifications">
                No new notifications
              </div>
            </div>
          </div>
        </div>

        <div class="branch-selector">
          <select v-model="selectedBranch" @change="handleBranchChange">
            <option v-for="branch in branches" :key="branch.id" :value="branch.id">
              {{ branch.name }}
            </option>
          </select>
        </div>

        <div class="user-menu">
          <button class="user-menu-btn" @click="toggleUserMenu">
            <img :src="userAvatar" alt="User" class="user-avatar" />
            <span class="user-name">{{ userName }}</span>
            <i class="fas fa-chevron-down"></i>
          </button>
          <div v-if="showUserMenu" class="user-menu-dropdown">
            <div class="user-info">
              <img :src="userAvatar" alt="User" class="user-avatar-large" />
              <div class="user-details">
                <span class="user-name">{{ userName }}</span>
                <span class="user-role">{{ userRole }}</span>
              </div>
            </div>
            <div class="menu-items">
              <router-link to="/app/settings" class="menu-item">
                <i class="fas fa-user-cog"></i>
                <span>Profile Settings</span>
              </router-link>
              <button class="menu-item" @click="handleLogout">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBranchStore } from '@/stores/branch'

const props = defineProps({
  isSidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-sidebar'])

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const branchStore = useBranchStore()

const searchQuery = ref('')
const showNotifications = ref(false)
const showUserMenu = ref(false)
const notifications = ref([])
const branches = ref([])
const selectedBranch = ref(null)

const userName = computed(() => authStore.currentUser?.name || 'User')
const userRole = computed(() => authStore.currentUser?.role || 'Role')
const userAvatar = computed(() => authStore.currentUser?.avatar || '/default-avatar.png')
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
const currentRoute = computed(() => {
  const path = route.path.split('/').pop()
  return path.charAt(0).toUpperCase() + path.slice(1)
})

const handleSearch = () => {
  // Implement search functionality
  console.log('Searching for:', searchQuery.value)
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

const handleNotificationClick = (notification) => {
  // Mark as read and navigate to relevant page
  notification.read = true
  if (notification.link) {
    router.push(notification.link)
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
}

const handleBranchChange = async () => {
  try {
    await branchStore.setCurrentBranch(selectedBranch.value)
    // Refresh relevant data
  } catch (error) {
    console.error('Failed to change branch:', error)
  }
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const getNotificationIcon = (type) => {
  const icons = {
    service: 'fas fa-tools',
    inventory: 'fas fa-boxes',
    customer: 'fas fa-users',
    system: 'fas fa-info-circle'
  }
  return icons[type] || 'fas fa-bell'
}

const formatTime = (time) => {
  // Implement time formatting
  return time
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.notifications') && !event.target.closest('.user-menu')) {
    showNotifications.value = false
    showUserMenu.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  try {
    // Fetch notifications
    notifications.value = [
      {
        id: 1,
        type: 'service',
        message: 'New service ticket assigned to you',
        time: '5 minutes ago',
        read: false,
        link: '/app/service-tickets/1'
      },
      // Add more notifications
    ]

    // Fetch branches
    branches.value = await branchStore.fetchBranches()
    selectedBranch.value = branchStore.currentBranch?.id
  } catch (error) {
    console.error('Failed to initialize header:', error)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.header-bar {
  height: 64px;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: #4b5563;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.sidebar-toggle:hover {
  background-color: #f3f4f6;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
}

.breadcrumb-item {
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
}

.breadcrumb-item.current {
  color: #1f2937;
  font-weight: 500;
}

.breadcrumb-separator {
  color: #9ca3af;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  position: relative;
  width: 200px;
}

.search-box i {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-box input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #6366f1;
}

.notifications {
  position: relative;
}

.notification-btn {
  background: none;
  border: none;
  color: #4b5563;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  position: relative;
  transition: background-color 0.2s;
}

.notification-btn:hover {
  background-color: #f3f4f6;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ef4444;
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
}

.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
}

.notification-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.notification-header button {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 0.875rem;
  cursor: pointer;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 1rem;
  display: flex;
  gap: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f9fafb;
}

.notification-item.unread {
  background-color: #f0f9ff;
}

.notification-icon {
  width: 32px;
  height: 32px;
  background-color: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
}

.notification-content {
  flex: 1;
}

.notification-text {
  font-size: 0.875rem;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.notification-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.no-notifications {
  padding: 1rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.branch-selector select {
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #1f2937;
  background-color: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5em 1.5em;
}

.branch-selector select:focus {
  outline: none;
  border-color: #6366f1;
}

.user-menu {
  position: relative;
}

.user-menu-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-menu-btn:hover {
  background-color: #f3f4f6;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.user-name {
  font-size: 0.875rem;
  color: #1f2937;
}

.user-menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 240px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
}

.user-info {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.menu-items {
  padding: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  color: #1f2937;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
}

.menu-item:hover {
  background-color: #f3f4f6;
}

.menu-item i {
  width: 20px;
  text-align: center;
  color: #6b7280;
}

@media (max-width: 768px) {
  .header-bar {
    padding: 0 1rem;
  }

  .search-box {
    display: none;
  }

  .user-name {
    display: none;
  }
}
</style> 