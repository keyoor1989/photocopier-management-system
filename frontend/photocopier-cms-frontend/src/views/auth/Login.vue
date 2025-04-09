<template>
  <form @submit.prevent="handleSubmit" class="login-form">
    <h2 class="form-title">Sign In</h2>
    <p class="form-description">Sign in to your account to continue</p>
    
    <div class="form-group">
      <label for="email" class="form-label">Email Address</label>
      <input 
        type="email" 
        id="email" 
        v-model="formData.email" 
        class="form-input" 
        :class="{ 'error': errors.email }"
        required
        placeholder="Enter your email"
        autocomplete="email"
      />
      <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
    </div>
    
    <div class="form-group">
      <label for="password" class="form-label">Password</label>
      <div class="password-input">
        <input 
          :type="showPassword ? 'text' : 'password'" 
          id="password" 
          v-model="formData.password" 
          class="form-input" 
          :class="{ 'error': errors.password }"
          required
          placeholder="Enter your password"
          autocomplete="current-password"
        />
        <button 
          type="button" 
          class="toggle-password" 
          @click="showPassword = !showPassword"
        >
          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>
      <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
    </div>
    
    <div class="form-options">
      <label class="checkbox-container">
        <input type="checkbox" v-model="formData.rememberMe" />
        Remember me
      </label>
      <router-link to="/forgot-password" class="forgot-password">Forgot Password?</router-link>
    </div>
    
    <div v-if="error" class="error-alert">
      {{ error }}
    </div>
    
    <div class="form-actions">
      <button type="submit" class="btn btn-primary" :disabled="isLoading">
        {{ isLoading ? 'Signing in...' : 'Sign In' }}
      </button>
    </div>
    
    <div class="form-footer">
      <p>Don't have an account? <router-link to="/register">Register</router-link></p>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const formData = reactive({
  email: '',
  password: '',
  rememberMe: false
});

const errors = reactive({
  email: '',
  password: ''
});

const isLoading = ref(false);
const error = ref('');
const showPassword = ref(false);

const validateForm = () => {
  let isValid = true;
  errors.email = '';
  errors.password = '';
  
  if (!formData.email) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }
  
  if (!formData.password) {
    errors.password = 'Password is required';
    isValid = false;
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
    isValid = false;
  }
  
  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  
  try {
    isLoading.value = true;
    error.value = '';
    
    await authStore.login({
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe
    });
    
    router.push('/app/dashboard');
  } catch (err) {
    error.value = err.message || 'Failed to sign in. Please check your credentials and try again.';
    console.error('Login error:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-form {
  width: 100%;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  text-align: center;
}

.form-description {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.25rem;
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

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.875rem;
  color: #4b5563;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  height: 18px;
  width: 18px;
  background-color: #fff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  margin-right: 0.5rem;
  position: relative;
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
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.875rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

.form-actions {
  margin-bottom: 1.5rem;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
}

.form-footer {
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 1.5rem;
}

.form-footer a {
  color: var(--primary-color);
  text-decoration: none;
}

.form-footer a:hover {
  text-decoration: underline;
}
</style> 