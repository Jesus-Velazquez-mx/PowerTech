import { createRouter, createWebHistory } from 'vue-router'

// Vistas
import HomeView from '@/views/HomeView.vue';
import CostsView from '@/views/CostsView.vue';
import FODAView from '@/views/FODAView.vue'; 
import AboutView from '@/views/AboutView.vue'; 
import ContactView from '@/views/ContactView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/costos', name: 'costos', component: CostsView },
  { path: '/foda', name: 'foda', component: FODAView },
  { path: '/nosotros', name: 'nosotros', component: AboutView },
  { path: '/contacto', name: 'contacto', component: ContactView }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router