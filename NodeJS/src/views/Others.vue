<template>
  <v-container class="mt-8 px-4 main-container" fluid>
    
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold">Administración rápida</h1>
      <p class="text-subtitle-2 text-grey-darken-1"> Bienvenido, {{ nombreFormateado || 'Usuario' }}</p>
    </div>

    <div v-for="seccion in menuAdministracion" :key="seccion.titulo" class="mb-5">
      <h2 class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-2 ml-1">
        {{ seccion.titulo }}
      </h2>

      <v-row dense class="ga-0">
        <v-col
          v-for="item in seccion.items"
          :key="item.label"
          cols="6"
          class="pa-1"
        >
          <v-card
            class="pa-3 rounded-xl d-flex flex-column align-center justify-center standard-card"
            elevation="0"
            ripple
            @click="item.accion"
          >
            <v-icon size="40" color="grey-darken-4" class="mb-1">
              {{ item.icon }}
            </v-icon>
            <span class="text-caption font-weight-bold text-grey-darken-3" style="font-size: 0.75rem !important;">
              {{ item.label }}
            </span>
          </v-card>
        </v-col>
      </v-row>
    </div>

  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from "@/stores/users";

const userStore = useUserStore();
const router = useRouter(); // Instanciamos el enrutador

const menuAdministracion = [
  {
    titulo: 'Gestión de edificios',
    items: [
      { label: 'Agregar', icon: 'mdi-home-plus-outline', accion: () => router.push('/buildings') },
      { label: 'Administrar', icon: 'mdi-office-building-cog-outline', accion: () => router.push('/buildings') },
    ]
  },
  {
    titulo: 'Gestión de dispositivos',
    items: [
      // Enlazamos a la nueva vista global de sensores
      { label: 'Sensores', icon: 'mdi-access-point', accion: () => router.push('/sensors') },
      { label: 'Monitorear', icon: 'mdi-pulse', accion: () => router.push('/monitoring') },
    ]
  },
  {
    titulo: 'Gestión de reportes',
    items: [
      { label: 'Generar', icon: 'mdi-file-document-outline', accion: () => router.push('/reports/selection') },
      { label: 'Imprimir', icon: 'mdi-printer-eye', accion: () => router.push('/reports/selection') },
    ]
  }
];

const nombreFormateado = computed(() => {
  const nombreCompleto = userStore.usuario?.nombre;
  if (!nombreCompleto) return "";
  const primerNombre = nombreCompleto.split(" ")[0];
  return primerNombre.charAt(0).toUpperCase() + primerNombre.slice(1).toLowerCase();
});
</script>

<style scoped>
.main-container {
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 40px;
}

.standard-card {
  background-color: #f8f9fb !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
  transition: all 0.3s ease !important;
  box-shadow: none !important;
  aspect-ratio: 1.8 / 1; 
  cursor: pointer;
}

.standard-card:hover {
  background-color: #f0f7ff !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px -6px rgba(0, 0, 0, 0.1) !important;
}

.standard-card:active {
  transform: scale(0.97);
}

h2 {
  letter-spacing: 0.3px;
  font-size: 1rem !important;
}
</style>