import { createRouter, createWebHistory } from 'vue-router'

// Vistas
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import Monitoring from '@/views/Monitoring.vue'
import Notifications from '@/views/Notifications.vue'
import Others from '@/views/Others.vue' 
import Buildings from '@/views/Buildings.vue'
import Reports from '@/views/Reports.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
      {
      path: '/signup',
      name: 'signup',
      component: Signup,
    },
      {
      path: '/monitoring',
      name: 'monitoring',
      component: Monitoring,
    },
      {
      path: '/notifications',
      name: 'notifications',
      component: Notifications,
    },
      {
      path: '/others',
      name: 'others',
      component: Others,
    },
       {
      path: '/buildings',
      name: 'buildings',
      component: Buildings,
    },
       {
      path: '/reports',
      name: 'reports',
      component: Reports,
    },
    
    
  ],
})

export default router
