<template>
  <AuthLayout>
    <div class="reset-password">
      <div class="reset-password-container">
        <div class="reset-password-header">
          <h1>Reset Password</h1>
          <p>Please enter your new password below</p>
        </div>

        <form @submit.prevent="handleSubmit" class="reset-password-form">
          <div class="form-group">
            <label for="password">New Password</label>
            <div class="password-input">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'error': errors.password }"
                placeholder="Enter your new password"
                @input="validatePassword"
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="errors.password" class="error-message">
              {{ errors.password }}
            </div>
            <div class="password-strength">
              <div
                class="strength-bar"
                :class="passwordStrength.class"
              ></div>
              <span class="strength-text">{{ passwordStrength.text }}</span>
            </div>
            <div class="password-requirements">
              <p>Password must contain:</p>
              <ul>
                <li :class="{ 'met': hasMinLength }">
                  <i :class="hasMinLength ? 'fas fa-check' : 'fas fa-times'"></i>
                  At least 8 characters
                </li>
                <li :class="{ 'met': hasUpperCase }">
                  <i :class="hasUpperCase ? 'fas fa-check' : 'fas fa-times'"></i>
                  At least one uppercase letter
                </li>
                <li :class="{ 'met': hasLowerCase }">
                  <i :class="hasLowerCase ? 'fas fa-check' : 'fas fa-times'"></i>
                  At least one lowercase letter
                </li>
                <li :class="{ 'met': hasNumber }">
                  <i :class="hasNumber ? 'fas fa-check' : 'fas fa-times'"></i>
                  At least one number
                </li>
                <li :class="{ 'met': hasSpecialChar }">
                  <i :class="hasSpecialChar ? 'fas fa-check' : 'fas fa-times'"></i>
                  At least one special character
                </li>
              </ul>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="password-input">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'error': errors.confirmPassword }"
                placeholder="Confirm your new password"
                @input="validateConfirmPassword"
              />
              <button
                type="button"
                class="toggle-password"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="errors.confirmPassword" class="error-message">
              {{ errors.confirmPassword }}
            </div>
          </div>

          <div v-if="error" class="form-error">
            <i class="fas fa-exclamation-circle"></i>
            {{ error }}
          </div>

          <button
            type="submit"
            class="btn-primary"
            :disabled="loading || !isFormValid"
          >
            <span v-if="loading" class="spinner"></span>
            <span v-else>Reset Password</span>
          </button>
        </form>

        <div class="reset-password-footer">
          <p>
            Remember your password?
            <router-link to="/login">Back to Login</router-link>
          </p>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import AuthLayout from '@/layouts/AuthLayout.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(false)
const error = ref(null)
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const errors = ref({
  password: '',
  confirmPassword: ''
})

// Password validation
const hasMinLength = computed(() => password.value.length >= 8)
const hasUpperCase = computed(() => /[A-Z]/.test(password.value))
const hasLowerCase = computed(() => /[a-z]/.test(password.value))
const hasNumber = computed(() => /[0-9]/.test(password.value))
const hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(password.value))

const passwordStrength = computed(() => {
  const strength = [
    hasMinLength.value,
    hasUpperCase.value,
    hasLowerCase.value,
    hasNumber.value,
    hasSpecialChar.value
  ].filter(Boolean).length

  if (strength === 0) return { class: 'weak', text: 'Very Weak' }
  if (strength <= 2) return { class: 'weak', text: 'Weak' }
  if (strength <= 3) return { class: 'medium', text: 'Medium' }
  if (strength <= 4) return { class: 'strong', text: 'Strong' }
  return { class: 'very-strong', text: 'Very Strong' }
})

const isFormValid = computed(() => {
  return (
    password.value &&
    confirmPassword.value &&
    !errors.value.password &&
    !errors.value.confirmPassword &&
    hasMinLength.value &&
    hasUpperCase.value &&
    hasLowerCase.value &&
    hasNumber.value &&
    hasSpecialChar.value
  )
})

const validatePassword = () => {
  errors.value.password = ''
  
  if (!password.value) {
    errors.value.password = 'Password is required'
    return
  }

  if (!hasMinLength.value) {
    errors.value.password = 'Password must be at least 8 characters'
    return
  }

  if (!hasUpperCase.value) {
    errors.value.password = 'Password must contain at least one uppercase letter'
    return
  }

  if (!hasLowerCase.value) {
    errors.value.password = 'Password must contain at least one lowercase letter'
    return
  }

  if (!hasNumber.value) {
    errors.value.password = 'Password must contain at least one number'
    return
  }

  if (!hasSpecialChar.value) {
    errors.value.password = 'Password must contain at least one special character'
    return
  }

  validateConfirmPassword()
}

const validateConfirmPassword = () => {
  errors.value.confirmPassword = ''
  
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Please confirm your password'
    return
  }

  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match'
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  loading.value = true
  error.value = null

  try {
    const token = route.query.token
    if (!token) {
      throw new Error('Invalid or expired reset link')
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
    loading.value = false
  }
}
</script>

<style scoped>
.reset-password {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f3f4f6;
}

.reset-password-container {
  width: 100%;
  max-width: 480px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
}

.reset-password-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.password-input {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #1f2937;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.form-input.error {
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
  font-size: 0.75rem;
  color: #ef4444;
}

.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  border-radius: 2px;
  margin-bottom: 0.25rem;
  transition: width 0.3s, background-color 0.3s;
}

.strength-bar.weak {
  width: 20%;
  background-color: #ef4444;
}

.strength-bar.medium {
  width: 60%;
  background-color: #f59e0b;
}

.strength-bar.strong {
  width: 80%;
  background-color: #3b82f6;
}

.strength-bar.very-strong {
  width: 100%;
  background-color: #10b981;
}

.strength-text {
  font-size: 0.75rem;
  color: #6b7280;
}

.password-requirements {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 4px;
}

.password-requirements p {
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.password-requirements ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.password-requirements li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.password-requirements li.met {
  color: #10b981;
}

.password-requirements li i {
  font-size: 0.75rem;
}

.form-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  color: #ef4444;
  border-radius: 4px;
  font-size: 0.875rem;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  background-color: #4f46e5;
}

.btn-primary:disabled {
  opacity: 0.5;
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

.reset-password-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.reset-password-footer a {
  color: #6366f1;
  text-decoration: none;
}

.reset-password-footer a:hover {
  text-decoration: underline;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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