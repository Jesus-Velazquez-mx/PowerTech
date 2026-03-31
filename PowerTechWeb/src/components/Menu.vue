<template>
  <v-app-bar color="transparent" elevation="0" class="glass-bar px-2">    
    <v-btn icon="mdi-menu" variant="text" class="menu-btn" @click="menuAbierto = !menuAbierto"></v-btn>
    <v-app-bar-title class="font-weight-black text-gradient custom-font">PowerTech</v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer v-model="menuAbierto" location="left" temporary elevation="4" class="modern-drawer">
    <div class="pa-5 text-center drawer-header">
      <v-avatar color="blue-lighten-5" size="64" class="mb-3 mt-2 elevation-1">
        <v-icon color="blue-darken-2" size="32">mdi-lightning-bolt</v-icon>
      </v-avatar>
      <h3 class="font-weight-bold text-blue-darken-3 custom-font">Menú Principal</h3>
    </div>

    <v-divider class="mb-2 mx-4 opacity-20"></v-divider>

<v-list nav class="px-3">
      <v-list-item 
        @click="irA('inicio')" 
        :active="seccionActiva === 'inicio'"
        prepend-icon="mdi-home-outline" 
        title="Inicio"
        class="animated-item custom-font"
        :class="seccionActiva === 'inicio' ? 'text-blue-darken-2 font-weight-bold' : 'text-grey-darken-4'"
      ></v-list-item>
      
      <v-list-item 
        @click="irA('nosotros')" 
        :active="seccionActiva === 'nosotros'"
        prepend-icon="mdi-information-outline" 
        title="Nosotros"
        class="animated-item custom-font"
        :class="seccionActiva === 'nosotros' ? 'text-blue-darken-2 font-weight-bold' : 'text-grey-darken-4'"
      ></v-list-item>
      
      <v-list-item 
        @click="irA('foda')" 
        :active="seccionActiva === 'foda'"
        prepend-icon="mdi-chart-pie" 
        title="FODA"
        class="animated-item custom-font"
        :class="seccionActiva === 'foda' ? 'text-blue-darken-2 font-weight-bold' : 'text-grey-darken-4'"
      ></v-list-item>

      <v-list-item 
        @click="irA('costos')" 
        :active="seccionActiva === 'costos'"
        prepend-icon="mdi-currency-usd" 
        title="Costos"
        class="animated-item custom-font"
        :class="seccionActiva === 'costos' ? 'text-blue-darken-2 font-weight-bold' : 'text-grey-darken-4'"
      ></v-list-item>

      <v-list-item 
        @click="irA('contacto')" 
        :active="seccionActiva === 'contacto'"
        prepend-icon="mdi-phone-outline" 
        title="Contacto"
        class="animated-item custom-font"
        :class="seccionActiva === 'contacto' ? 'text-blue-darken-2 font-weight-bold' : 'text-grey-darken-4'"
      ></v-list-item>

      <v-divider class="my-3 opacity-20"></v-divider>

      <!-- Aquí se debe de cambiar dependiendo de la URL del Sistema -->
      <v-list-item 
        href="http://localhost:5173/login" 
        target="_blank"
        prepend-icon="mdi-account-key" 
        title="Iniciar Sesión"
        class="animated-item login-item custom-font font-weight-bold text-blue-darken-3"
      ></v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-4">
        <v-btn block color="red-lighten-1" variant="flat" class="close-btn rounded-pill custom-font text-none font-weight-bold shadow-soft" @click="menuAbierto = false">
          Cerrar Menú
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const menuAbierto = ref(false)
const seccionActiva = ref('inicio')

const router = useRouter()
const route = useRoute()

// Lógica para navegar y hacer scroll
const irA = (id) => {
  // Si el usuario está en una ruta separada (ej: /login), lo regresamos al Home primero
  if (route.path !== '/') {
    router.push('/').then(() => {
      setTimeout(() => hacerScrollSuave(id), 300)
    })
  } else {
    hacerScrollSuave(id)
  }
  menuAbierto.value = false // Cierra el menú al hacer clic
}

const hacerScrollSuave = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

// Lógica del "Espía" (ScrollSpy)
onMounted(() => {
  // El IntersectionObserver revisa qué elementos de la pantalla están visibles
  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      // Si la sección ocupa al menos el 40% de la pantalla, la marcamos como activa
      if (entrada.isIntersecting) {
        seccionActiva.value = entrada.target.id
      }
    })
  }, { threshold: 0.4 }) 

  // Buscamos todas las secciones con la clase .seccion-pantalla y las empezamos a vigilar
  setTimeout(() => {
    document.querySelectorAll('.seccion-pantalla').forEach(sec => observer.observe(sec))
  }, 500)
})
</script>

<style scoped>
/* =========================================
   ESTILOS MODERNOS Y ANIMACIONES 
========================================= */
.glass-bar {
  background: rgba(255, 255, 255, 0.75) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.menu-btn { transition: transform 0.3s ease; }
.menu-btn:hover { transform: scale(1.1) rotate(5deg); color: #1976D2; }

.text-gradient {
  background: linear-gradient(90deg, #1976D2, #42A5F5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.5px;
}

.modern-drawer {
  border: none !important;
  background-color: #fdfdfd !important;
}

.drawer-header {
  background: linear-gradient(180deg, rgba(25, 118, 210, 0.03) 0%, rgba(255,255,255,0) 100%);
}

.animated-item {
  border-radius: 12px !important;
  margin-bottom: 4px;
  position: relative;
  overflow: visible; 
  transition: all 0.3s ease;
  z-index: 1;
}

.animated-item:hover {
  background-color: transparent !important;
  transform: translateX(6px); 
}

.animated-item::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 2px solid #1976D2;
  border-radius: 12px;
  clip-path: inset(50% 50% 50% 50%); 
  background-color: transparent;
  transition: clip-path 0.4s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.4s ease;
  pointer-events: none;
  z-index: -1;
}

.animated-item:hover::before {
  clip-path: inset(0% 0% 0% 0%);
  background-color: #f0f7ff;
}

/* Mantener la línea azul cuando la opción está seleccionada (activa) */
.animated-item.v-list-item--active::before {
  clip-path: inset(0% 0% 0% 0%) !important;
  border-color: #1976D2 !important;
  background-color: #f0f7ff !important;
}

/* Quitamos el overlay gris por defecto de Vuetify para que luzca nuestro azul */
.animated-item.v-list-item--active > .v-list-item__overlay {
  opacity: 0 !important;
}

.login-item {
  background-color: rgba(25, 118, 210, 0.05);
  border: 1px solid rgba(25, 118, 210, 0.1);
}
.login-item:hover::before { border-color: #1565C0; }

.shadow-soft { box-shadow: 0 4px 12px rgba(239, 83, 80, 0.25) !important; }
.close-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.close-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(239, 83, 80, 0.35) !important; }

.opacity-20 { opacity: 0.2 !important; }
</style>