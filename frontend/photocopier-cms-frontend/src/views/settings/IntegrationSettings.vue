<template>
  <div class="integration-settings">
    <div class="header">
      <button class="btn btn-secondary" @click="goBack">
        <i class="fas fa-arrow-left"></i> Back
      </button>
      <h1>Integration Settings</h1>
    </div>

    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i> Loading integration settings...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="fetchSettings" class="btn btn-secondary">Retry</button>
    </div>

    <div v-else class="integrations-grid">
      <!-- WhatsApp Business API -->
      <div class="integration-card">
        <div class="integration-header">
          <div class="integration-title">
            <i class="fab fa-whatsapp"></i>
            <h3>WhatsApp Business API</h3>
          </div>
          <div class="integration-status">
            <span class="status-badge" :class="{ active: whatsapp.enabled }">
              {{ whatsapp.enabled ? 'Connected' : 'Disabled' }}
            </span>
            <label class="toggle-switch">
              <input
                type="checkbox"
                v-model="whatsapp.enabled"
                @change="toggleIntegration('whatsapp')"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="integration-details" v-if="whatsapp.enabled">
          <div class="form-group">
            <label>API Key</label>
            <input
              type="password"
              v-model="whatsapp.apiKey"
              placeholder="Enter WhatsApp Business API key"
            />
          </div>
          <div class="form-group">
            <label>Phone Number ID</label>
            <input
              type="text"
              v-model="whatsapp.phoneNumberId"
              placeholder="Enter WhatsApp Business phone number ID"
            />
          </div>
          <div class="form-group">
            <label>Business Account ID</label>
            <input
              type="text"
              v-model="whatsapp.businessAccountId"
              placeholder="Enter WhatsApp Business account ID"
            />
          </div>
          <div class="form-actions">
            <button
              class="btn btn-secondary"
              @click="testConnection('whatsapp')"
              :disabled="testingWhatsapp"
            >
              {{ testingWhatsapp ? 'Testing...' : 'Test Connection' }}
            </button>
            <button
              class="btn btn-primary"
              @click="saveIntegration('whatsapp')"
              :disabled="savingWhatsapp"
            >
              {{ savingWhatsapp ? 'Saving...' : 'Save Settings' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Email Service -->
      <div class="integration-card">
        <div class="integration-header">
          <div class="integration-title">
            <i class="fas fa-envelope"></i>
            <h3>Email Service</h3>
          </div>
          <div class="integration-status">
            <span class="status-badge" :class="{ active: email.enabled }">
              {{ email.enabled ? 'Connected' : 'Disabled' }}
            </span>
            <label class="toggle-switch">
              <input
                type="checkbox"
                v-model="email.enabled"
                @change="toggleIntegration('email')"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="integration-details" v-if="email.enabled">
          <div class="form-group">
            <label>SMTP Host</label>
            <input
              type="text"
              v-model="email.smtpHost"
              placeholder="Enter SMTP host"
            />
          </div>
          <div class="form-group">
            <label>SMTP Port</label>
            <input
              type="number"
              v-model="email.smtpPort"
              placeholder="Enter SMTP port"
            />
          </div>
          <div class="form-group">
            <label>Username</label>
            <input
              type="text"
              v-model="email.username"
              placeholder="Enter SMTP username"
            />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              v-model="email.password"
              placeholder="Enter SMTP password"
            />
          </div>
          <div class="form-actions">
            <button
              class="btn btn-secondary"
              @click="testConnection('email')"
              :disabled="testingEmail"
            >
              {{ testingEmail ? 'Testing...' : 'Test Connection' }}
            </button>
            <button
              class="btn btn-primary"
              @click="saveIntegration('email')"
              :disabled="savingEmail"
            >
              {{ savingEmail ? 'Saving...' : 'Save Settings' }}
            </button>
          </div>
        </div>
      </div>

      <!-- SMS Gateway -->
      <div class="integration-card">
        <div class="integration-header">
          <div class="integration-title">
            <i class="fas fa-sms"></i>
            <h3>SMS Gateway</h3>
          </div>
          <div class="integration-status">
            <span class="status-badge" :class="{ active: sms.enabled }">
              {{ sms.enabled ? 'Connected' : 'Disabled' }}
            </span>
            <label class="toggle-switch">
              <input
                type="checkbox"
                v-model="sms.enabled"
                @change="toggleIntegration('sms')"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="integration-details" v-if="sms.enabled">
          <div class="form-group">
            <label>API Key</label>
            <input
              type="password"
              v-model="sms.apiKey"
              placeholder="Enter SMS gateway API key"
            />
          </div>
          <div class="form-group">
            <label>Sender ID</label>
            <input
              type="text"
              v-model="sms.senderId"
              placeholder="Enter sender ID"
            />
          </div>
          <div class="form-actions">
            <button
              class="btn btn-secondary"
              @click="testConnection('sms')"
              :disabled="testingSms"
            >
              {{ testingSms ? 'Testing...' : 'Test Connection' }}
            </button>
            <button
              class="btn btn-primary"
              @click="saveIntegration('sms')"
              :disabled="savingSms"
            >
              {{ savingSms ? 'Saving...' : 'Save Settings' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Payment Gateway -->
      <div class="integration-card">
        <div class="integration-header">
          <div class="integration-title">
            <i class="fas fa-credit-card"></i>
            <h3>Payment Gateway</h3>
          </div>
          <div class="integration-status">
            <span class="status-badge" :class="{ active: payment.enabled }">
              {{ payment.enabled ? 'Connected' : 'Disabled' }}
            </span>
            <label class="toggle-switch">
              <input
                type="checkbox"
                v-model="payment.enabled"
                @change="toggleIntegration('payment')"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="integration-details" v-if="payment.enabled">
          <div class="form-group">
            <label>Merchant ID</label>
            <input
              type="text"
              v-model="payment.merchantId"
              placeholder="Enter merchant ID"
            />
          </div>
          <div class="form-group">
            <label>API Key</label>
            <input
              type="password"
              v-model="payment.apiKey"
              placeholder="Enter API key"
            />
          </div>
          <div class="form-group">
            <label>Secret Key</label>
            <input
              type="password"
              v-model="payment.secretKey"
              placeholder="Enter secret key"
            />
          </div>
          <div class="form-actions">
            <button
              class="btn btn-secondary"
              @click="testConnection('payment')"
              :disabled="testingPayment"
            >
              {{ testingPayment ? 'Testing...' : 'Test Connection' }}
            </button>
            <button
              class="btn btn-primary"
              @click="saveIntegration('payment')"
              :disabled="savingPayment"
            >
              {{ savingPayment ? 'Saving...' : 'Save Settings' }}
            </button>
          </div>
        </div>
      </div>

      <!-- IndiaMART API -->
      <div class="integration-card">
        <div class="integration-header">
          <div class="integration-title">
            <i class="fas fa-store"></i>
            <h3>IndiaMART API</h3>
          </div>
          <div class="integration-status">
            <span class="status-badge" :class="{ active: indiamart.enabled }">
              {{ indiamart.enabled ? 'Connected' : 'Disabled' }}
            </span>
            <label class="toggle-switch">
              <input
                type="checkbox"
                v-model="indiamart.enabled"
                @change="toggleIntegration('indiamart')"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="integration-details" v-if="indiamart.enabled">
          <div class="form-group">
            <label>API Key</label>
            <input
              type="password"
              v-model="indiamart.apiKey"
              placeholder="Enter IndiaMART API key"
            />
          </div>
          <div class="form-group">
            <label>Seller ID</label>
            <input
              type="text"
              v-model="indiamart.sellerId"
              placeholder="Enter seller ID"
            />
          </div>
          <div class="form-actions">
            <button
              class="btn btn-secondary"
              @click="testConnection('indiamart')"
              :disabled="testingIndiamart"
            >
              {{ testingIndiamart ? 'Testing...' : 'Test Connection' }}
            </button>
            <button
              class="btn btn-primary"
              @click="saveIntegration('indiamart')"
              :disabled="savingIndiamart"
            >
              {{ savingIndiamart ? 'Saving...' : 'Save Settings' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Document Storage -->
      <div class="integration-card">
        <div class="integration-header">
          <div class="integration-title">
            <i class="fas fa-cloud"></i>
            <h3>Document Storage</h3>
          </div>
          <div class="integration-status">
            <span class="status-badge" :class="{ active: storage.enabled }">
              {{ storage.enabled ? 'Connected' : 'Disabled' }}
            </span>
            <label class="toggle-switch">
              <input
                type="checkbox"
                v-model="storage.enabled"
                @change="toggleIntegration('storage')"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="integration-details" v-if="storage.enabled">
          <div class="form-group">
            <label>Access Key</label>
            <input
              type="password"
              v-model="storage.accessKey"
              placeholder="Enter access key"
            />
          </div>
          <div class="form-group">
            <label>Secret Key</label>
            <input
              type="password"
              v-model="storage.secretKey"
              placeholder="Enter secret key"
            />
          </div>
          <div class="form-group">
            <label>Bucket Name</label>
            <input
              type="text"
              v-model="storage.bucketName"
              placeholder="Enter bucket name"
            />
          </div>
          <div class="form-actions">
            <button
              class="btn btn-secondary"
              @click="testConnection('storage')"
              :disabled="testingStorage"
            >
              {{ testingStorage ? 'Testing...' : 'Test Connection' }}
            </button>
            <button
              class="btn btn-primary"
              @click="saveIntegration('storage')"
              :disabled="savingStorage"
            >
              {{ savingStorage ? 'Saving...' : 'Save Settings' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const error = ref(null)

// Integration states
const whatsapp = ref({
  enabled: false,
  apiKey: '',
  phoneNumberId: '',
  businessAccountId: ''
})

const email = ref({
  enabled: false,
  smtpHost: '',
  smtpPort: '',
  username: '',
  password: ''
})

const sms = ref({
  enabled: false,
  apiKey: '',
  senderId: ''
})

const payment = ref({
  enabled: false,
  merchantId: '',
  apiKey: '',
  secretKey: ''
})

const indiamart = ref({
  enabled: false,
  apiKey: '',
  sellerId: ''
})

const storage = ref({
  enabled: false,
  accessKey: '',
  secretKey: '',
  bucketName: ''
})

// Loading states
const testingWhatsapp = ref(false)
const testingEmail = ref(false)
const testingSms = ref(false)
const testingPayment = ref(false)
const testingIndiamart = ref(false)
const testingStorage = ref(false)

const savingWhatsapp = ref(false)
const savingEmail = ref(false)
const savingSms = ref(false)
const savingPayment = ref(false)
const savingIndiamart = ref(false)
const savingStorage = ref(false)

const goBack = () => {
  router.back()
}

const fetchSettings = async () => {
  loading.value = true
  error.value = null
  try {
    // TODO: Implement API call to fetch integration settings
    // For now, using mock data
    const mockSettings = {
      whatsapp: {
        enabled: true,
        apiKey: '********',
        phoneNumberId: '123456789',
        businessAccountId: '987654321'
      },
      email: {
        enabled: true,
        smtpHost: 'smtp.example.com',
        smtpPort: '587',
        username: 'user@example.com',
        password: '********'
      },
      sms: {
        enabled: false,
        apiKey: '',
        senderId: ''
      },
      payment: {
        enabled: true,
        merchantId: 'MERCHANT123',
        apiKey: '********',
        secretKey: '********'
      },
      indiamart: {
        enabled: false,
        apiKey: '',
        sellerId: ''
      },
      storage: {
        enabled: true,
        accessKey: '********',
        secretKey: '********',
        bucketName: 'my-bucket'
      }
    }

    whatsapp.value = mockSettings.whatsapp
    email.value = mockSettings.email
    sms.value = mockSettings.sms
    payment.value = mockSettings.payment
    indiamart.value = mockSettings.indiamart
    storage.value = mockSettings.storage
  } catch (err) {
    error.value = 'Failed to load integration settings. Please try again.'
    console.error('Error fetching settings:', err)
  } finally {
    loading.value = false
  }
}

const toggleIntegration = async (integration) => {
  try {
    // TODO: Implement API call to toggle integration
    console.log(`Toggling ${integration} integration:`, {
      enabled: eval(`${integration}.value.enabled`)
    })
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (err) {
    error.value = `Failed to toggle ${integration} integration. Please try again.`
    console.error(`Error toggling ${integration}:`, err)
    // Revert the toggle
    eval(`${integration}.value.enabled = !${integration}.value.enabled`)
  }
}

const testConnection = async (integration) => {
  const loadingState = eval(`testing${integration.charAt(0).toUpperCase() + integration.slice(1)}`)
  loadingState.value = true
  try {
    // TODO: Implement API call to test connection
    console.log(`Testing ${integration} connection`)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert(`${integration} connection test successful!`)
  } catch (err) {
    error.value = `Failed to test ${integration} connection. Please check your settings.`
    console.error(`Error testing ${integration}:`, err)
  } finally {
    loadingState.value = false
  }
}

const saveIntegration = async (integration) => {
  const loadingState = eval(`saving${integration.charAt(0).toUpperCase() + integration.slice(1)}`)
  loadingState.value = true
  try {
    // TODO: Implement API call to save integration settings
    console.log(`Saving ${integration} settings:`, eval(`${integration}.value`))
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert(`${integration} settings saved successfully!`)
  } catch (err) {
    error.value = `Failed to save ${integration} settings. Please try again.`
    console.error(`Error saving ${integration}:`, err)
  } finally {
    loadingState.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>

<style scoped>
.integration-settings {
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
  flex: 1;
}

.integrations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.integration-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.integration-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.integration-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.integration-title i {
  font-size: 1.5rem;
  color: #6366f1;
}

.integration-title h3 {
  margin: 0;
  color: #1f2937;
}

.integration-status {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: #e5e7eb;
  color: #6b7280;
}

.status-badge.active {
  background-color: #ecfdf5;
  color: #10b981;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e5e7eb;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #6366f1;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.integration-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.form-group input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.form-group input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
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
  .integration-settings {
    padding: 1rem;
  }

  .integrations-grid {
    grid-template-columns: 1fr;
  }
}
</style> 