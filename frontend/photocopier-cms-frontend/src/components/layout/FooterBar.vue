<template>
  <footer class="footer">
    <div class="footer-content">
      <p class="copyright">&copy; {{ currentYear }} Photocopier CMS. All rights reserved.</p>
      <div class="footer-links">
        <a href="#" class="footer-link">Privacy Policy</a>
        <a href="#" class="footer-link">Terms of Service</a>
        <a href="#" class="footer-link">Help</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  background-color: white;
  border-top: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.copyright {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-link {
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #3b82f6;
}

@media (max-width: 640px) {
  .footer-content {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
  
  .footer-links {
    justify-content: center;
  }
}
</style> 