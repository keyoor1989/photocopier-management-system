<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-header">
        <router-link to="/" class="logo">
          <img src="@/assets/logo.png" alt="Company Logo" />
          <span>Photocopier CMS</span>
        </router-link>
      </div>

      <main class="auth-content">
        <slot></slot>
      </main>

      <footer class="auth-footer">
        <p>&copy; {{ new Date().getFullYear() }} Photocopier CMS. All rights reserved.</p>
        <div class="footer-links">
          <router-link to="/privacy">Privacy Policy</router-link>
          <router-link to="/terms">Terms of Service</router-link>
          <router-link to="/contact">Contact Us</router-link>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
// No additional setup needed
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f3f4f6;
}

.auth-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.auth-header {
  padding: 1rem 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #1f2937;
  font-weight: 600;
  font-size: 1.25rem;
}

.logo img {
  height: 2rem;
  width: auto;
}

.auth-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.auth-footer {
  padding: 1rem 0;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.footer-links a {
  color: #6b7280;
  text-decoration: none;
}

.footer-links a:hover {
  color: #6366f1;
  text-decoration: underline;
}

@media (max-width: 640px) {
  .auth-container {
    padding: 0.5rem;
  }

  .auth-content {
    padding: 1rem 0;
  }

  .footer-links {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style> 