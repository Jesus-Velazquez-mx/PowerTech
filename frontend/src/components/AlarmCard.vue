<template>
  <v-card
    class="alarm-card mb-4 pa-4 rounded-xl"
    elevation="0"
    link
    ripple
  >
    <div class="d-flex align-center">
      <!--Icono-->
      <v-avatar :color="colorNivel.fondo" size="52" class="mr-4">
        <v-icon :color="colorNivel.texto" size="28">{{ iconoTipo }}</v-icon>
      </v-avatar>

      <div class="flex-grow-1 overflow-hidden">
        <div class="d-flex justify-space-between align-start mb-1">
          <!-- Título -->
          <h3 
            class="text-subtitle-1 font-weight-bold text-truncate" 
            :class="'text-' + colorNivel.texto"
          >
            {{ alarma.tipoAlarma }}
          </h3>
          <!-- Fecha -->
          <span class="text-caption text-grey-darken-1 flex-shrink-0 ml-2">
            {{ formatearFecha(alarma.fechaHora) }}
          </span>
        </div>

        <!-- Detalle -->
        <p class="text-body-2 text-grey-darken-2 text-truncate mb-2">
          {{ alarma.detalle }}
        </p>

        <!-- Icono, Edificio y Sala -->
        <div class="d-flex align-center text-caption text-grey-darken-1">
          <v-icon size="14" class="mr-1">mdi-map-marker-outline</v-icon>
          <span class="text-truncate font-weight-medium">
            {{ alarma.nombreEdificio }} • {{ alarma.nombreSala }}
          </span>
          
          <v-spacer></v-spacer>

          <!-- Activo -->
          <v-chip 
            size="x-small" 
            class="font-weight-bold" 
            :color="alarma.estado === 'Activa' ? 'red-lighten-4' : 'green-lighten-4'" 
            variant="flat"
            label
          >
             {{ alarma.estado }}
          </v-chip>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  alarma: { type: Object, required: true },
});

/* Lógica de colores por nivel */
const colorNivel = computed(() => {
  const nivel = props.alarma.nivel;
  if (nivel >= 4) return { fondo: 'red-lighten-5', texto: 'red-darken-2' };
  if (nivel === 3) return { fondo: 'orange-lighten-5', texto: 'orange-darken-2' };
  return { fondo: 'blue-lighten-5', texto: 'blue-darken-2' };
});

/* Iconos para test. Se deben de cambiar */
const iconoTipo = computed(() => {
  const tipo = props.alarma.tipoAlarma.toLowerCase();
  if (tipo.includes('incendio') || tipo.includes('humo')) return 'mdi-fire-alert';
  if (tipo.includes('intruso') || tipo.includes('movimiento')) return 'mdi-motion-sensor';
  if (tipo.includes('falla') || tipo.includes('energia')) return 'mdi-flash-alert';
  return 'mdi-bell-alert-outline';
});

/* Formateo de fecha */
const formatearFecha = (fechaIso) => {
  if (!fechaIso) return '';
  const fecha = new Date(fechaIso);
  if (new Date().toDateString() === fecha.toDateString()) {
     return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return fecha.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
};
</script>

<style scoped>
/* [REGLA DE CONSISTENCIA]: Tarjetas con fondo #f8f9fb y transición de escala al presionar */
.alarm-card {
  transition: transform 0.2s ease, background-color 0.2s ease;
  background-color: #f8f9fb !important;
  border: none !important;
}

.alarm-card:hover {
  background-color: #f0f7ff !important;
  transform: translateY(-2px);
}

.alarm-card:active {
  transform: scale(0.98);
}
</style>