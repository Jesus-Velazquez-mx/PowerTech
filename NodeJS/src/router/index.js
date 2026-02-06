import { createRouter, createWebHistory } from 'vue-router'

// Vistas
import HomeView from '@/views/HomeView.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import Messages from '@/views/Messages.vue'
import Notifications from '@/views/Notifications.vue'
import Others from '@/views/Others.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
      path: '/messages',
      name: 'messages',
      component: Messages,
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
    
    
  ],
})

export default router
