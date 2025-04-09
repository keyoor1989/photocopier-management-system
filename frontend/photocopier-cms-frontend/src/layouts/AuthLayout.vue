<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-header">
        <div class="logo-container">
          <img src="@/assets/logo.svg" alt="Photocopier CMS Logo" class="logo" />
        </div>
        <h1 class="title">Photocopier CMS</h1>
      </div>
      
      <div class="auth-content">
        <slot></slot>
      </div>
      
      <div class="auth-footer">
        <p>&copy; {{ currentYear }} Photocopier CMS. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  padding: 1.5rem;
}

.auth-container {
  width: 100%;
  max-width: 450px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.auth-header {
  padding: 2rem;
  text-align: center;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.logo {
  width: 64px;
  height: 64px;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.auth-content {
  padding: 2rem;
}

.auth-footer {
  padding: 1.5rem;
  text-align: center;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .auth-layout {
    padding: 1rem;
    background-color: white;
  }
  
  .auth-container {
    box-shadow: none;
    border-radius: 0;
  }
  
  .auth-header {
    padding: 1.5rem;
  }
  
  .auth-content {
    padding: 1.5rem;
  }
  
  .auth-footer {
    padding: 1rem;
  }
}
</style> 