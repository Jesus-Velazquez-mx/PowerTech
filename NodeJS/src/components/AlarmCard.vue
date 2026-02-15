<template>
  <v-card
    class="alarm-card mb-3 pa-3 rounded-xl"
    elevation="1"
    link
    ripple
  >
    <div class="d-flex align-center">
      <!-- Avatar se usa para poner la imagen circular, y dentro de ella va el ícono-->
      <v-avatar :color="colorNivel.fondo" size="48" class="mr-4 elevation-1">
        <v-icon :color="colorNivel.texto" size="28">{{ iconoTipo }}</v-icon>
      </v-avatar>

      <div class="flex-grow-1 overflow-hidden">
        <div class="d-flex justify-space-between align-start mb-1">
            <!-- Parte de arriba de la tarjeta: Tipo de alarma y la Hora -->
            <!-- Tipo de alarma -->
          <h3 class="text-subtitle-1 font-weight-bold text-truncate" style="color: #3b6fb6;">
            {{ alarma.tipoAlarma }}
          </h3>
          <!-- Hora -->
          <span class="text-caption text-grey-darken-1 flex-shrink-0 ml-2">
            {{ formatearFecha(alarma.fechaHora) }}
          </span>
        </div>

        <!-- Tipo de alarma -->
        <p class="text-body-2 text-grey-darken-2 text-truncate mb-1">
          {{ alarma.detalle }}
        </p>

        <!-- Parte de abajo: Edificio + Sala -->
        <div class="d-flex align-center text-caption text-grey">
          <v-icon size="14" class="mr-1">mdi-map-marker-outline</v-icon>
          <span class="text-truncate">
            {{ alarma.nombreEdificio }} - {{ alarma.nombreSala }}
          </span>
           <v-chip size="x-small" class="ml-2 font-weight-bold" :color="alarma.estado === 'Activa' ? 'red-lighten-4' : 'green-lighten-4'" label>
             {{ alarma.estado }}
          </v-chip>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

/* Recibimos el objeto alarma completo como prop */
const props = defineProps({
  alarma: {
    type: Object,
    required: true,
  },
});

/* Lógica para asignar colores según el nivel de gravedad (1 a 5) */
const colorNivel = computed(() => {
  const nivel = props.alarma.nivel;
  if (nivel >= 4) return { fondo: 'red-lighten-5', texto: 'red-darken-2' }; // Crítico
  if (nivel === 3) return { fondo: 'orange-lighten-5', texto: 'orange-darken-2' }; // Medio
  return { fondo: 'blue-lighten-5', texto: 'blue-darken-2' }; // Bajo/Info
});

/* Lógica para elegir icono según el tipo de alarma */
const iconoTipo = computed(() => {
  const tipo = props.alarma.tipoAlarma.toLowerCase();
  if (tipo.includes('incendio') || tipo.includes('humo')) return 'mdi-fire-alert';
  if (tipo.includes('intruso') || tipo.includes('movimiento')) return 'mdi-motion-sensor';
  if (tipo.includes('falla') || tipo.includes('energia')) return 'mdi-flash-alert';
  return 'mdi-bell-alert-outline'; // Default
});

/* Formateo de fecha */
const formatearFecha = (fechaIso) => {
  if (!fechaIso) return '';
  const fecha = new Date(fechaIso);
  // Si es de hoy, mostramos solo la hora
  if (new Date().toDateString() === fecha.toDateString()) {
     return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  // Si no, fecha corta
  return fecha.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
};
</script>

<style scoped>
/* Efectos de hover similares al estándar */
.alarm-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.alarm-card:hover {
  background-color: #f0f7ff !important; /* Un azul muy clarito al pasar el mouse */
  transform: translateY(-2px); /* Ligera elevación */
  box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
}
</style>