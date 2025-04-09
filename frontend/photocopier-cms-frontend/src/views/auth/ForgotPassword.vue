<template>
  <div class="forgot-password">
    <div class="card">
      <h1>Forgot Password</h1>
      <p class="description">Enter your email address to reset your password</p>
      
      <form @submit.prevent="handleSubmit" class="form">
        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            class="form-input" 
            :class="{ 'error': error }"
            required
            placeholder="Enter your email"
          />
          <p v-if="error" class="error-message">{{ error }}</p>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Sending...' : 'Reset Password' }}
          </button>
        </div>
        
        <div v-if="success" class="success-message">
          {{ success }}
        </div>
      </form>
      
      <div class="links">
        <p>Remember your password? <router-link to="/login">Back to Login</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const email = ref('');
const error = ref('');
const success = ref('');
const isLoading = ref(false);

const handleSubmit = async () => {
  if (!email.value) {
    error.value = 'Email is required';
    return;
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = 'Please enter a valid email address';
    return;
  }
  
  try {
    isLoading.value = true;
    error.value = '';
    success.value = '';
    
    // This would call the auth store's forgotPassword method
    // await authStore.forgotPassword(email.value);
    
    // For now, just simulate a successful response
    setTimeout(() => {
      success.value = 'Password reset instructions have been sent to your email.';
      isLoading.value = false;
    }, 1500);
    
  } catch (err) {
    error.value = err.message || 'Failed to send reset instructions. Please try again.';
    isLoading.value = false;
  }
};
</script>

<style scoped>
.forgot-password {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f8f9fa;
}

.card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

h1 {
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.description {
  margin-bottom: 1.5rem;
  color: #6b7280;
}

.form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
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
  margin-top: 0.5rem;
  color: #ef4444;
  font-size: 0.875rem;
}

.form-actions {
  margin-bottom: 1rem;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
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

.success-message {
  padding: 0.75rem;
  background-color: #ecfdf5;
  color: #047857;
  border-radius: 4px;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.links {
  text-align: center;
  margin-top: 1.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.links a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.links a:hover {
  text-decoration: underline;
}
</style> 