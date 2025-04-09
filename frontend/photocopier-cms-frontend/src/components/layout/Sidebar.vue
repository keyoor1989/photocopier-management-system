<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header">
      <router-link to="/app/dashboard" class="logo-link">
        <img src="@/assets/logo.svg" alt="Logo" class="logo" />
        <span v-if="!isCollapsed" class="logo-text">Photocopier CMS</span>
      </router-link>
      <button class="toggle-btn" @click="$emit('toggle')">
        <i class="fas" :class="isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
      </button>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section">
        <h3 v-if="!isCollapsed" class="section-title">Main</h3>
        <ul class="nav-list">
          <li>
            <router-link to="/app/dashboard" class="nav-link" active-class="active">
              <i class="fas fa-home"></i>
              <span v-if="!isCollapsed">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/app/customers" class="nav-link" active-class="active">
              <i class="fas fa-users"></i>
              <span v-if="!isCollapsed">Customers</span>
            </router-link>
          </li>
          <li>
            <router-link to="/app/machines" class="nav-link" active-class="active">
              <i class="fas fa-print"></i>
              <span v-if="!isCollapsed">Machines</span>
            </router-link>
          </li>
          <li>
            <router-link to="/app/service-tickets" class="nav-link" active-class="active">
              <i class="fas fa-tools"></i>
              <span v-if="!isCollapsed">Service Tickets</span>
            </router-link>
          </li>
          <li>
            <router-link to="/app/inventory" class="nav-link" active-class="active">
              <i class="fas fa-boxes"></i>
              <span v-if="!isCollapsed">Inventory</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="nav-section">
        <h3 v-if="!isCollapsed" class="section-title">Reports</h3>
        <ul class="nav-list">
          <li>
            <router-link to="/app/reports" class="nav-link" active-class="active">
              <i class="fas fa-chart-bar"></i>
              <span v-if="!isCollapsed">Reports</span>
            </router-link>
          </li>
          <li>
            <router-link to="/app/reports/sales" class="nav-link" active-class="active">
              <i class="fas fa-dollar-sign"></i>
              <span v-if="!isCollapsed">Sales Reports</span>
            </router-link>
          </li>
          <li>
            <router-link to="/app/reports/service" class="nav-link" active-class="active">
              <i class="fas fa-wrench"></i>
              <span v-if="!isCollapsed">Service Reports</span>
            </router-link>
          </li>
          <li>
            <router-link to="/app/reports/inventory" class="nav-link" active-class="active">
              <i class="fas fa-warehouse"></i>
              <span v-if="!isCollapsed">Inventory Reports</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="nav-section">
        <h3 v-if="!isCollapsed" class="section-title">Settings</h3>
        <ul class="nav-list">
          <li>
            <router-link to="/app/settings" class="nav-link" active-class="active">
              <i class="fas fa-cog"></i>
              <span v-if="!isCollapsed">Settings</span>
            </router-link>
          </li>
          <li>
            <router-link to="/app/settings/users" class="nav-link" active-class="active">
              <i class="fas fa-user-cog"></i>
              <span v-if="!isCollapsed">User Management</span>
            </router-link>
          </li>
          <li>
            <router-link to="/app/settings/branches" class="nav-link" active-class="active">
              <i class="fas fa-building"></i>
              <span v-if="!isCollapsed">Branch Management</span>
            </router-link>
          </li>
          <li>
            <router-link to="/app/settings/integrations" class="nav-link" active-class="active">
              <i class="fas fa-plug"></i>
              <span v-if="!isCollapsed">Integrations</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info" v-if="!isCollapsed">
        <img :src="userAvatar" alt="User" class="user-avatar" />
        <div class="user-details">
          <span class="user-name">{{ userName }}</span>
          <span class="user-role">{{ userRole }}</span>
        </div>
      </div>
      <button class="logout-btn" @click="handleLogout">
        <i class="fas fa-sign-out-alt"></i>
        <span v-if="!isCollapsed">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle'])

const router = useRouter()
const authStore = useAuthStore()

const userName = computed(() => authStore.currentUser?.name || 'User')
const userRole = computed(() => authStore.currentUser?.role || 'Role')
const userAvatar = computed(() => authStore.currentUser?.avatar || '/default-avatar.png')

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #1a1c23;
  color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  z-index: 1000;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  height: 64px;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #fff;
}

.logo {
  width: 32px;
  height: 32px;
}

.logo-text {
  margin-left: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.toggle-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.toggle-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.nav-section {
  margin-bottom: 1.5rem;
}

.section-title {
  padding: 0 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background-color: #6366f1;
}

.nav-link i {
  width: 20px;
  text-align: center;
  margin-right: 0.75rem;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 0.75rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  font-size: 0.875rem;
}

.user-role {
  font-size: 0.75rem;
  color: #9ca3af;
}

.logout-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 4px;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.logout-btn i {
  width: 20px;
  text-align: center;
  margin-right: 0.75rem;
}

@media (max-width: 768px) {
  .sidebar {
    width: 64px;
  }

  .sidebar:not(.collapsed) {
    width: 250px;
  }
}
</style> 