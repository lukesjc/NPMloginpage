<template>
  <div class="login-container">
    <router-view />

    <a href="/" aria-label="Npm">
      <svg viewBox="0 0 780 250" aria-hidden="true" class="npm-logo">
        <path
          fill="#231F20"
          d="M240,250h100v-50h100V0H240V250z M340,50h50v100h-50V50z M480,0v200h100V50h50v150h50V50h50v150h50V0H480z M0,200h100V50h50v150h50V0H0V200z"
          stroke-width="5"
          stroke="#f7f7f7"
        />
      </svg>
      <p> </p>
    </a>

    <LoginForm />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LoginForm from '../components/LoginForm.vue'

export default defineComponent({
  components: {
    LoginForm,
  },
})
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Arial', sans-serif;
}

.logo-header {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.npm-logo {
  width: 150px;
  height: auto;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

.login-container {
  position: relative;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 10px;
  width: 100%;
  z-index: 9999;
  background-image: linear-gradient(139deg, #fb8817, #ff4b01, #c12127, #e02aff);
}
</style>
