<template>
  <div class="dashboard-wrapper">
    <h1>Welcome to Your Dashboard</h1>
    <!-- SciChart container -->
    <div id="scichart-root" class="chart-container"></div>
    <!-- Loading State -->
    <div v-if="isLoading"></div>
    <!-- Error State -->
    <div v-else-if="error" class="error">{{ error }}</div>
    <!-- Users List with Scroll -->
    <div
      class="user-scroll-container"
      ref="scrollContainer"
      @scroll="handleScroll"
    >
      <ul class="user-list">
        <li v-for="user in visibleUsers" :key="user._id" class="user-item"> 
          <img :src="user.avatar" alt="Avatar" class="avatar" />
          <div class="user-info">
            <strong>{{ user.name }}</strong>
            <p>{{ user.email }}</p>
          </div>
        </li>
      </ul>
      <div v-if="isLoading" class="loading-more">Loading more...</div>
    </div>
    <!-- Logout Button -->
    <button @click="handleLogout">Logout</button>
    <button @click="$router.push('/meter-check')">Meter Check</button>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick } from "vue";
import { useUserStore } from "@/stores/userStore";
// Import SciChart
import {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries
} from "scichart";
// Use WASM from CDN
SciChartSurface.useWasmFromCDN();
export default defineComponent({
  name: "DashboardPage",
  data() {
    return {
      store: useUserStore(),
      scrollContainer: null as HTMLElement | null,
      totalShown: 10,
    };
  },
  computed: {
    users(): any[] {
      return this.store.users;
    },
    visibleUsers(): any[] {
      if (this.users.length === 0) return [];
      const repeatedUsers = [];
      for (let i = 0; i < this.totalShown; i++) {
        repeatedUsers.push(this.users[i % this.users.length]);
      }
      return repeatedUsers;
    },
    isLoading(): boolean {
      return this.store.isLoading;
    },
    error(): string {
      return this.store.error;
    },
  },
  methods: {
    async handleLogout() {
      this.store.logout();
      this.$router.push("/");
    },
    async handleScroll() {
      const el = this.scrollContainer;
      if (!el) return;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
      if (atBottom && !this.isLoading) {
        const remaining = this.users.length - this.totalShown;
        if (remaining > 0) {
          this.totalShown += 10;
        } else {
          this.totalShown = 10;
          el.scrollTop = 0;
        }
      }
    },
    async initSciChart() {
      const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root");
      sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
      sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
      const dataSeries = new XyDataSeries(wasmContext, {
        xValues: [0, 1, 2, 3, 4],
        yValues: [1, 4, 2, 6, 3],
      });
      const lineSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries,
        stroke: "#007bff",
        strokeThickness: 2,
      });
      sciChartSurface.renderableSeries.add(lineSeries);
    }
  },
  async mounted() {
    if (!this.store.token) {
      this.$router.push("/");
    } else {
      await this.store.loadMoreUsers();
      this.scrollContainer = this.$refs.scrollContainer as HTMLElement;
      await nextTick();
      this.initSciChart();
    }
  },
});
</script>
<style scoped>
/* Add chart height */
.chart-container {
  width: 100%;
  height: 300px;
  margin-bottom: 1rem;
}
/* Existing styles */
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
