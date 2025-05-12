<template>
  <div class="Dashboardpage-container">
    <h1>Welcome to Your Dashboard</h1>
    <div v-if="isLoading">Loading users...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <ul>
        <li v-for="user in users" :key="user.id" class="user-item">
          <img :src="user.avatar" alt="Avatar" class="avatar" />
          <div class="user-info">
            <strong>{{ user.first_name }} {{ user.last_name }}</strong>
            <p>{{ user.email }}</p>
          </div>
        </li>
      </ul>
    </div>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useUserStore } from '@/stores/userStore';

export default defineComponent({
  name: 'DashboardPage',
  data() {
    return {
      store: useUserStore(),
    };
  },
  computed: {
    users() {
      return this.store.users;
    },
    isLoading() {
      return this.store.isLoading;
    },
    error() {
      return this.store.error;
    },
  },
  methods: {
    async handleLogout() {
      this.store.logout();
      this.$router.push('/');
    },
  },
  async mounted() {
    if (!this.store.token) {
      this.$router.push('/');
    } else {
      await this.store.fetchUsers();
    }
  },
});
</script>

<style scoped>
.Dashboardpage-container {
  padding: 2rem;
  font-family: Arial, sans-serif;
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
}
.user-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}
.user-info {
  display: flex;
  flex-direction: column;
}
button {
  margin-top: 2rem;
  padding: 0.5rem 1rem;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
}
</style>
