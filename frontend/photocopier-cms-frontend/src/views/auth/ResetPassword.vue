<template>
  <div class="reset-password">
    <div class="reset-password-container">
      <div class="reset-password-header">
        <h1>Reset Password</h1>
        <p>Enter your new password below</p>
      </div>

      <form @submit.prevent="handleSubmit" class="reset-password-form">
        <div class="form-group">
          <label for="password">New Password</label>
          <div class="input-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              :class="{ error: errors.password }"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span v-if="errors.password" class="error-message">
            {{ errors.password }}
          </span>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <div class="input-group">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="confirmPassword"
              :class="{ error: errors.confirmPassword }"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span v-if="errors.confirmPassword" class="error-message">
            {{ errors.confirmPassword }}
          </span>
        </div>

        <div class="password-requirements">
          <h3>Password Requirements:</h3>
          <ul>
            <li :class="{ satisfied: hasMinLength }">
              At least 8 characters long
            </li>
            <li :class="{ satisfied: hasUpperCase }">
              Contains at least one uppercase letter
            </li>
            <li :class="{ satisfied: hasLowerCase }">
              Contains at least one lowercase letter
            </li>
            <li :class="{ satisfied: hasNumber }">
              Contains at least one number
            </li>
            <li :class="{ satisfied: hasSpecialChar }">
              Contains at least one special character
            </li>
          </ul>
        </div>

        <button
          type="submit"
          class="submit-btn"
          :disabled="isSubmitting || !isFormValid"
        >
          <span v-if="isSubmitting" class="spinner"></span>
          <span v-else>Reset Password</span>
        </button>

        <div v-if="error" class="error-message">{{ error }}</div>
      </form>

      <div class="reset-password-footer">
        <router-link to="/login">Back to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isSubmitting = ref(false)
const error = ref('')
const errors = ref({
  password: '',
  confirmPassword: ''
})

const hasMinLength = computed(() => password.value.length >= 8)
const hasUpperCase = computed(() => /[A-Z]/.test(password.value))
const hasLowerCase = computed(() => /[a-z]/.test(password.value))
const hasNumber = computed(() => /[0-9]/.test(password.value))
const hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(password.value))

const isPasswordValid = computed(() => {
  return (
    hasMinLength.value &&
    hasUpperCase.value &&
    hasLowerCase.value &&
    hasNumber.value &&
    hasSpecialChar.value
  )
})

const isFormValid = computed(() => {
  return isPasswordValid.value && password.value === confirmPassword.value
})

const validateForm = () => {
  errors.value = {
    password: '',
    confirmPassword: ''
  }

  if (!password.value) {
    errors.value.password = 'Password is required'
  } else if (!isPasswordValid.value) {
    errors.value.password = 'Password does not meet requirements'
  }

  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match'
  }

  return !errors.value.password && !errors.value.confirmPassword
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  error.value = ''

  try {
    const token = route.query.token
    if (!token) {
      throw new Error('Invalid or expired reset token')
    }

    await authStore.resetPassword({
      token,
      password: password.value
    })

    toast.success('Password reset successfully')
    router.push('/login')
  } catch (err) {
    error.value = err.message || 'Failed to reset password'
    toast.error(error.value)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.reset-password {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  padding: 2rem;
}

.reset-password-container {
  width: 100%;
  max-width: 480px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.reset-password-header {
  text-align: center;
  margin-bottom: 2rem;
}

.reset-password-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.reset-password-header p {
  color: #6b7280;
  font-size: 0.875rem;
}

.reset-password-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.input-group {
  position: relative;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.input-group input:focus {
  outline: none;
  border-color: #6366f1;
}

.input-group input.error {
  border-color: #ef4444;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.password-requirements {
  background-color: #f9fafb;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.password-requirements h3 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.password-requirements ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.password-requirements li {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
}

.password-requirements li:before {
  content: '•';
  margin-right: 0.5rem;
}

.password-requirements li.satisfied {
  color: #10b981;
}

.password-requirements li.satisfied:before {
  content: '✓';
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn:hover:not(:disabled) {
  background-color: #4f46e5;
}

.submit-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.reset-password-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.reset-password-footer a {
  color: #6366f1;
  text-decoration: none;
  font-size: 0.875rem;
}

.reset-password-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .reset-password {
    padding: 1rem;
  }

  .reset-password-container {
    padding: 1.5rem;
  }
}
</style> 