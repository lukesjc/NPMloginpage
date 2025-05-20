<template>
  <div class="page-wrapper">
    <div class="register-container">
      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <h1>Register</h1>
          <label for="name">Name</label>
          <input type="text" id="name" v-model="name" required />
        </div>
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Registering...' : 'Register' }}
        </button>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'RegisterPage',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      error: '',
      success: '',
      isLoading: false,
    };
  },
  methods: {
    async handleRegister() {
      this.isLoading = true;
      try {
        const response = await axios.post(
          'http://localhost:5000/api/users/register',
          {
            name: this.name,
            email: this.email,
            password: this.password,
          }
        );

        if (response.data.token) {
          this.success = 'Registration successful!';
          this.error = '';
          this.name = '';
          this.email = '';
          this.password = '';
        } else {
          this.error = 'Registration failed. Please try again.';
          this.success = '';
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          this.error = error.response.data.message || 'Registration failed.';
        } else {
          this.error = 'Network error. Please try again later.';
        }
        this.success = '';
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
  background-color: #f0f0f0;
}

.register-container {
  width: 300px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
}

.input-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 8px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #45a049;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.success-message {
  color: green;
  margin-top: 10px;
}
</style>
