<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const layout = computed(() => {
  return route.meta.layout || null
})

onMounted(async () => {
  // Check for stored authentication token on app load
  await authStore.checkAuth()
  
  // If we're on the root path and not authenticated, redirect to login
  if (router.currentRoute.value.path === '/' && !authStore.isAuthenticated) {
    router.push('/login')
  }
})
</script>

<template>
  <component :is="layout" v-if="layout">
    <router-view />
  </component>
  <router-view v-else />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-primary);
  line-height: 1.5;
  background-color: #f3f4f6;
}

#app {
  min-height: 100vh;
}

/* Global utility classes */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-primary:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.error-alert {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.875rem;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  display: inline-block;
  height: 18px;
  width: 18px;
  background-color: #fff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  margin-right: 0.5rem;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 5px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>
