<template>
  <div class="dashboard-wrapper">
    <h1>Welcome to Your Dashboard</h1>
    <div v-if="isLoading"></div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div
      class="user-scroll-container"
      ref="scrollContainer"
      @scroll="handleScroll"
    >
      <ul class="user-list">
        <li v-for="user in visibleUsers" :key="user.id" class="user-item">
          <img :src="user.avatar" alt="Avatar" class="avatar" />
          <div class="user-info">
            <strong>{{ user.first_name }} {{ user.last_name }}</strong>
            <p>{{ user.email }}</p>
          </div>
        </li>
      </ul>
      <div v-if="isLoading" class="loading-more">Loading more...</div>
    </div>
    <!-- Logout Button -->
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
export default defineComponent({
  name: "DashboardPage",
  data() {
    return {
      store: useUserStore(),
      scrollContainer: null as HTMLElement | null,
      totalShown: 10, // Show 10 users initially
    };
  },
  computed: {
    users() {
      return this.store.users;
    },
    visibleUsers() {
      return this.users.slice(0, this.totalShown); // Show users based on totalShown
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
      this.$router.push("/"); // Redirect to login page on logout
    },
    async handleScroll() {
      const el = this.scrollContainer;
      if (!el) return;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
      // If we're at the bottom and not already loading, load more users
      if (atBottom && !this.store.isLoading) {
        // If there are more users to load, increase the totalShown count
        const remainingUsers = this.users.length - this.totalShown;
        if (remainingUsers > 0) {
          this.totalShown += 10; // Increase by 10 users
        } else {
          await this.store.loadMoreUsers();
        }
      }
    },
  },
  async mounted() {
    if (!this.store.token) {
      this.$router.push("/"); // Redirect to login if no token
    } else {
      // Load initial users on mount
      await this.store.loadMoreUsers();
      this.scrollContainer = this.$refs.scrollContainer as HTMLElement;
    }
  },
});
</script>
<style scoped>
body {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 2rem;
  font-family: Arial, sans-serif;
  background-color: #fff;
  margin: 0;
}
.dashboard-wrapper {
  max-width: 600px;
  width: 100%;
  background-color: #fff;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.user-scroll-container {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.user-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.user-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.05);
  gap: 1rem;
}
.avatar {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}
.user-info {
  flex: 1;
  text-align: left;
}
button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  align-self: flex-start;
  transition: background-color 0.25s ease;
}
button:hover,
button:focus {
  background-color: #0056b3;
  outline: none;
}
.loading-more {
  text-align: center;
  font-size: 0.9rem;
  color: #007bff;
  padding-top: 0.5rem;
}
</style>
