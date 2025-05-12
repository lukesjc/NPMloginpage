<template>
    <div class="Dashboard-container">
        <router-view />

        
     <DashboardPage />
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import DashboardPage from '../components/DashboardPage.vue'

export default defineComponent({
    components:{
        DashboardPage,
    },
})
</script>
<style scoped>
    .Dashboard-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: #ffffff;
      font-family: 'Arial', sans-serif;
    }
    h1 {
      margin-bottom: 20px;
      color: #333;
    }
    .login-container {
  position: relative;
}
</style>