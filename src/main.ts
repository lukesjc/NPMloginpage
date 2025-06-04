import { createApp, onMounted } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import { useUserStore } from './stores/userStore';

// Create the Pinia store instance
const pinia = createPinia();

// Create the Vue app instance
const app = createApp(App);

// Use Pinia for state management
app.use(pinia);

// Use Vue Router for routing
app.use(router);

// Restore token from localStorage after app is created
app.mount('#app');

const userStore = useUserStore();
userStore.restoreTokenFromLocalStorage();
