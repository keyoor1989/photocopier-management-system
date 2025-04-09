<template>
  <div class="settings">
    <div class="header">
      <h1>Settings</h1>
    </div>

    <div class="settings-grid">
      <router-link to="/settings/company" class="settings-card">
        <div class="card-icon">
          <i class="fas fa-building"></i>
        </div>
        <div class="card-content">
          <h3>Company Profile</h3>
          <p>Manage your company information, contact details, and preferences</p>
        </div>
        <i class="fas fa-chevron-right"></i>
      </router-link>

      <router-link to="/settings/users" class="settings-card">
        <div class="card-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="card-content">
          <h3>User Management</h3>
          <p>Manage user accounts, roles, and permissions</p>
        </div>
        <i class="fas fa-chevron-right"></i>
      </router-link>

      <router-link to="/settings/notifications" class="settings-card">
        <div class="card-icon">
          <i class="fas fa-bell"></i>
        </div>
        <div class="card-content">
          <h3>Notifications</h3>
          <p>Configure notification preferences and alerts</p>
        </div>
        <i class="fas fa-chevron-right"></i>
      </router-link>

      <router-link to="/settings/integrations" class="settings-card">
        <div class="card-icon">
          <i class="fas fa-plug"></i>
        </div>
        <div class="card-content">
          <h3>Integrations</h3>
          <p>Manage third-party integrations and API settings</p>
        </div>
        <i class="fas fa-chevron-right"></i>
      </router-link>

      <router-link to="/settings/backup" class="settings-card">
        <div class="card-icon">
          <i class="fas fa-database"></i>
        </div>
        <div class="card-content">
          <h3>Backup & Restore</h3>
          <p>Configure data backup and restore options</p>
        </div>
        <i class="fas fa-chevron-right"></i>
      </router-link>

      <router-link to="/settings/security" class="settings-card">
        <div class="card-icon">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div class="card-content">
          <h3>Security</h3>
          <p>Manage security settings and access controls</p>
        </div>
        <i class="fas fa-chevron-right"></i>
      </router-link>
    </div>
  </div>
</template>

<script setup>
// No additional setup needed for this component
</script>

<style scoped>
.settings {
  padding: 2rem;
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
  color: #1f2937;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.settings-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}

.settings-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background-color: #f3f4f6;
  color: #6366f1;
  font-size: 1.25rem;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  margin: 0 0 0.5rem;
  color: #1f2937;
  font-size: 1rem;
}

.card-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.settings-card i.fa-chevron-right {
  color: #9ca3af;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .settings {
    padding: 1rem;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style> 