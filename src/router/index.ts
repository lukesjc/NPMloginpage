import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '@/components/RegisterPage.vue'
import DashboardPage from '@/components/DashboardPage.vue'
import LoginForm from '@/components/LoginForm.vue'
import UserTable from '@/components/UserTable.vue'
import Dashboard from '@/views/Dashboard.vue'


const routes = [
  { path: '/', name: 'Login', component: LoginPage },
  { path: '/register', name: 'Register', component: RegisterPage },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
