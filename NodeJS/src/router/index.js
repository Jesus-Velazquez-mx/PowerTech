import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from "@/stores/users"; // Importamos tu store de usuario

// Vistas
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import Monitoring from '@/views/Monitoring.vue'
import Notifications from '@/views/Notifications.vue'
import Others from '@/views/Others.vue'
import Buildings from '@/views/Buildings.vue'
import Reports from '@/views/Reports.vue'
import Rooms from '@/views/Rooms.vue'
import Devices from '@/views/Devices.vue'
import ReportSelection from '@/views/ReportSelection.vue'

const routes = [
  { path: '/', name: 'home', component: Home, meta: { requiresAuth: true } },
  { path: '/login', name: 'login', component: Login },
  { path: '/signup', name: 'signup', component: Signup },
  { path: '/monitoring', name: 'monitoring', component: Monitoring, meta: { requiresAuth: true } },
  { path: '/notifications', name: 'notifications', component: Notifications, meta: { requiresAuth: true } },
  { path: '/others', name: 'others', component: Others, meta: { requiresAuth: true } },
  { path: '/buildings', name: 'buildings', component: Buildings, meta: { requiresAuth: true } },
  { path: '/rooms/:id', name: 'rooms', component: Rooms, meta: { requiresAuth: true } },
  { path: '/devices/:id', name: 'devices', component: Devices, meta: { requiresAuth: true } },

  // Moví la selección arriba del reporte dinámico para evitar colisiones
  { path: '/reports/selection', name: 'report-selection', component: ReportSelection, meta: { requiresAuth: true } },
  { path: '/reports/:buildingId/:roomId', name: 'reports', component: Reports, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// --- GUARDIÁN DE NAVEGACIÓN ---
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = !!userStore.usuario; // Verifica si hay usuario en el store

  // Si la ruta requiere autenticación y el usuario no está logueado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router