<template>
  <div class="main-layout">
    <Sidebar
      :is-collapsed="isSidebarCollapsed"
      @toggle="toggleSidebar"
    />
    
    <div class="main-content" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <HeaderBar
        :is-sidebar-collapsed="isSidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
      />
      
      <main class="content-area">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      
      <FooterBar />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import HeaderBar from '@/components/layout/HeaderBar.vue'
import FooterBar from '@/components/layout/FooterBar.vue'

const isSidebarCollapsed = ref(false)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f3f4f6;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 250px;
  transition: margin-left 0.3s ease;
}

.main-content.sidebar-collapsed {
  margin-left: 64px;
}

.content-area {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }

  .main-content.sidebar-collapsed {
    margin-left: 0;
  }
}
</style> 