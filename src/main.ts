import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'

// Create the Pinia store instance
const pinia = createPinia()

// Create the Vue app instance
const app = createApp(App)

// Use Pinia for state management
app.use(pinia)

// Use Vue Router for routing
app.use(router)

// Mount the app to the DOM
app.mount('#app')
