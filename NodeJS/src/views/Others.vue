<template>
  <v-container class="mt-8 px-4 main-container" fluid>
    <div class="mb-8">
      <h1 class="text-h4 font-weight-bold">Administración rápida</h1>
      <p class="text-subtitle-2 text-grey-darken-1">
        Bienvenido, {{ nombreFormateado || 'Usuario' }}
      </p>
    </div>

    <div v-for="seccion in menuAdministracion" :key="seccion.titulo" class="mb-8">
      <h2 class="text-subtitle-1 font-weight-bold text-grey-darken-3 mb-4">
        {{ seccion.titulo }}
      </h2>

      <v-row dense>
        <v-col
          v-for="item in seccion.items"
          :key="item.label"
          cols="6"
        >
          <v-card
            class="pa-6 rounded-xl d-flex flex-column align-center justify-center action-card"
            elevation="0"
            @click="item.accion"
          >
            <v-icon size="42" color="grey-darken-2" class="mb-2">
              {{ item.icon }}
            </v-icon>
            <span class="text-body-2 font-weight-medium text-grey-darken-3">
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
import { useUserStore } from "@/stores/users";

const userStore = useUserStore();

// Datos estáticos para los botones, listos para agregar funciones
const menuAdministracion = [
  {
    titulo: 'Gestión de edificios',
    items: [
      { label: 'Agregar', icon: 'mdi-home-plus-outline', accion: () => console.log('Agregar Edificio') },
      { label: 'Administrar', icon: 'mdi-office-building-cog-outline', accion: () => console.log('Admin Edificio') },
    ]
  },
  {
    titulo: 'Gestión de dispositivos',
    items: [
      { label: 'Agregar', icon: 'mdi-plus-box-outline', accion: () => console.log('Agregar Disp') },
      { label: 'Monitorear', icon: 'mdi-pulse', accion: () => console.log('Monitorear Disp') },
    ]
  },
  {
    titulo: 'Gestión de reportes',
    items: [
      { label: 'Generar', icon: 'mdi-file-document-outline', accion: () => console.log('Generar Reporte') },
      { label: 'Imprimir', icon: 'mdi-printer-eye', accion: () => console.log('Imprimir Reporte') },
    ]
  }
];

// Tu lógica de nombre formateado mantenida
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

/* Estilo de las tarjetas según la imagen */
.action-card {
  background-color: #f8f9fb !important; /* Gris muy claro/azulado de la imagen */
  border: none !important;
  height: 160px;
  width: 220px;
  transition: all 0.2s ease;
  aspect-ratio: 1.1 / 1; /* Las hace un poco más cuadradas */
}

.action-card:hover {
  background-color: #f0f2f5 !important;
  transform: translateY(-2px);
}

.action-card:active {
  transform: scale(0.96);
  background-color: #e8ebf0 !important;
}

/* Ajuste de tipografía para los títulos de sección */
h2 {
  letter-spacing: 0.5px;
}
</style>