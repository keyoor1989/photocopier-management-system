<template>
  <div class="company-profile">
    <div class="header">
      <button class="btn btn-secondary" @click="goBack">
        <i class="fas fa-arrow-left"></i> Back
      </button>
      <h1>Company Profile</h1>
    </div>

    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i> Loading company profile...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="fetchProfile" class="btn btn-secondary">Retry</button>
    </div>

    <form v-else @submit.prevent="saveProfile" class="profile-form">
      <div class="form-section">
        <h2>Basic Information</h2>
        <div class="form-grid">
          <div class="form-group">
            <label for="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              v-model="profile.companyName"
              required
            />
          </div>

          <div class="form-group">
            <label for="registrationNumber">Registration Number</label>
            <input
              type="text"
              id="registrationNumber"
              v-model="profile.registrationNumber"
            />
          </div>

          <div class="form-group">
            <label for="taxId">Tax ID</label>
            <input type="text" id="taxId" v-model="profile.taxId" />
          </div>

          <div class="form-group">
            <label for="industry">Industry</label>
            <input type="text" id="industry" v-model="profile.industry" />
          </div>
        </div>
      </div>

      <div class="form-section">
        <h2>Contact Information</h2>
        <div class="form-grid">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="profile.email"
              required
            />
          </div>

          <div class="form-group">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" v-model="profile.phone" />
          </div>

          <div class="form-group">
            <label for="website">Website</label>
            <input type="url" id="website" v-model="profile.website" />
          </div>
        </div>
      </div>

      <div class="form-section">
        <h2>Address</h2>
        <div class="form-grid">
          <div class="form-group">
            <label for="street">Street Address</label>
            <input type="text" id="street" v-model="profile.address.street" />
          </div>

          <div class="form-group">
            <label for="city">City</label>
            <input type="text" id="city" v-model="profile.address.city" />
          </div>

          <div class="form-group">
            <label for="state">State/Province</label>
            <input type="text" id="state" v-model="profile.address.state" />
          </div>

          <div class="form-group">
            <label for="postalCode">Postal Code</label>
            <input type="text" id="postalCode" v-model="profile.address.postalCode" />
          </div>

          <div class="form-group">
            <label for="country">Country</label>
            <input type="text" id="country" v-model="profile.address.country" />
          </div>
        </div>
      </div>

      <div class="form-section">
        <h2>Preferences</h2>
        <div class="form-grid">
          <div class="form-group">
            <label for="timezone">Timezone</label>
            <select id="timezone" v-model="profile.timezone" required>
              <option value="">Select timezone</option>
              <option v-for="tz in timezones" :key="tz" :value="tz">
                {{ tz }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="currency">Currency</label>
            <select id="currency" v-model="profile.currency" required>
              <option value="">Select currency</option>
              <option v-for="curr in currencies" :key="curr.code" :value="curr.code">
                {{ curr.name }} ({{ curr.code }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="dateFormat">Date Format</label>
            <select id="dateFormat" v-model="profile.dateFormat" required>
              <option value="">Select format</option>
              <option v-for="format in dateFormats" :key="format" :value="format">
                {{ format }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="goBack">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary" :disabled="saving">
          <i class="fas fa-save"></i> {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const error = ref(null)

const profile = ref({
  companyName: '',
  registrationNumber: '',
  taxId: '',
  industry: '',
  email: '',
  phone: '',
  website: '',
  address: {
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  },
  timezone: '',
  currency: '',
  dateFormat: ''
})

const timezones = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Singapore'
]

const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'AUD', name: 'Australian Dollar' }
]

const dateFormats = [
  'MM/DD/YYYY',
  'DD/MM/YYYY',
  'YYYY-MM-DD',
  'DD MMM YYYY'
]

const goBack = () => {
  router.back()
}

const fetchProfile = async () => {
  loading.value = true
  error.value = null
  try {
    // TODO: Implement API call to fetch company profile
    // For now, using mock data
    profile.value = {
      companyName: 'Acme Corporation',
      registrationNumber: '123456789',
      taxId: 'TAX-987654321',
      industry: 'Technology',
      email: 'contact@acme.com',
      phone: '+1 (555) 123-4567',
      website: 'https://acme.com',
      address: {
        street: '123 Business Ave',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States'
      },
      timezone: 'America/New_York',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY'
    }
  } catch (err) {
    error.value = 'Failed to load company profile. Please try again.'
    console.error('Error fetching company profile:', err)
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  saving.value = true
  try {
    // TODO: Implement API call to save company profile
    console.log('Saving profile:', profile.value)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/settings')
  } catch (err) {
    error.value = 'Failed to save company profile. Please try again.'
    console.error('Error saving company profile:', err)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.company-profile {
  padding: 2rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
  color: #1f2937;
}

.profile-form {
  max-width: 1200px;
  margin: 0 auto;
}

.form-section {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-section h2 {
  margin: 0 0 1.5rem;
  color: #1f2937;
  font-size: 1.25rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.error {
  color: #ef4444;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background-color: #6366f1;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #4f46e5;
}

.btn-primary:disabled {
  background-color: #a5b4fc;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

@media (max-width: 768px) {
  .company-profile {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style> 