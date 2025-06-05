import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '@/components/RegisterPage.vue';
import Dashboard from '@/views/Dashboard.vue';
import { useUserStore } from '@/stores/userStore';
import MeterCheck from '@/components/MeterCheck.vue';

const routes = [
  { path: '/', name: 'Login', component: LoginPage },
  { path: '/register', name: 'Register', component: RegisterPage },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard,meta:{ requiresAuth:true} },
  { path: "/meter-check",name: "MeterCheck",component: MeterCheck},
];

const router = createRouter({
  history: createWebHistory(),
  routes,

});
router.beforeEach((to, from, next) => {
  const store = useUserStore();
  store.restoreTokenFromLocalStorage();

  if (to.meta.requiresAuth && !store.token) {
    next('/');
  } else {
    next();
  }
});


export default router;
