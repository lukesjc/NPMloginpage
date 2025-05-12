<template>
  <div class="form-container">
    <form @submit.prevent="handleLogin">
      <div class="gif-wrapper">
        <img
          src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExejZ2YzZzdWw4OHl0dDZyams0cTVlM2Nqdmo3MG02aXV5eDVkMzF6NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xUPGcM9CazM9H5KrEA/giphy.gif"
          alt="Profile"
          class="profile-gif"
        />
      </div>
      <div class="input-group">
        <h1>Sign In</h1>
        <label for="email">Email</label>
        <input type="text" id="email" v-model="email" required />
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />
        <label href="#" class="forgot-password">Forgot Password?</label>
      </div>
      <button type="submit">Sign In</button>
      <div v-if="loginError" class="error-message">Invalid email or password</div>
    </form>
    <router-link to="/register">Register</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
      loginError: false,
    }
  },
  computed: {
    router() {
      return useRouter();
    },
  },
  methods: {
    async handleLogin() {
      try {
        const store = useUserStore()
        const router = useRouter()

        await store.login(this.email, this.password)

        // Success: Navigate to dashboard 
        this.$router.push('/dashboard'); 
      } catch (error: any) {
        console.error('Login Error:', error)
        this.loginError = true
      }
    },
  },
})
</script>

<style scoped>
.form-container {
  height: 500px;
  width: 400px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 8px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: left;
  font-family: 'Source Sans Pro', 'Lucida Grande', sans-serif;
}

.gif-wrapper {
  width: 180px;
  height: 180px;
  border-radius: 100%;
  overflow: hidden;
  margin: 0 auto 1.5rem auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-gif {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.input-group {
  margin-bottom: 15px;
}

input {
  width: 90%;
  padding: 8px;
  margin-top: 5px;
  border-radius: 4px;
  border: 1px solid #2b2b2b;
}

button {
  width: 94%;
  padding: 8px;
  background-color: #f6f8fa;
  border: 1px solid rgb(31, 31, 31);
  border-radius: 4px;
  color: rgb(0, 0, 0);
  font-size: 16px;
  border-color: #7c7c7c;
}

button:hover {
  background-color: #f4f4f4;
}

input:focus {
  border-color: #020202;
  outline: none;
}

label {
  font-size: 14px;
  font-weight: bold;
}

.forgot-password {
  margin-left: 65%;
  font-size: 0.9rem;
  text-decoration: none;
  color: #000000;
  text-align: right;
}

.forgot-password:hover {
  text-decoration: underline;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 10px;
}
</style>
