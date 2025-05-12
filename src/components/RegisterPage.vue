<template>
  <div class="page-wrapper">
    <div class="register-container">
      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <h1>Register</h1>
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Register</button>
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
      email: '',
      password: '',
      error: '',
      success: '',
    };
  },
  methods: {
    async handleRegister() {
      try {
        const response = await axios.post(
          'https://reqres.in/api/register',
          {
            email: this.email,
            password: this.password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'reqres-free-v1',
            },
          }
        );

        if (response.data.token) {
          this.success = 'Registration successful!';
          this.error = '';
        } else {
          this.error = 'Registration failed. Please try again.';
          this.success = '';
        }
      } catch (error) {
        console.error('Error:', error);
        this.error = 'An error occurred during registration. Please try again.';
        this.success = '';
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
}

button:hover {
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
