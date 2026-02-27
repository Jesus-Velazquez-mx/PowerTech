<template>
  <v-container class="mt-8 px-4 main-container" fluid>
    
    <div class="mb-6 no-print">
      <v-btn icon="mdi-arrow-left" variant="text" color="blue-darken-2" @click="$router.back()"></v-btn>
      <span class="text-subtitle-1 font-weight-bold ml-2">Volver a la selección</span>      
      <h1 class="text-h4 font-weight-bold">Reporte: {{ nombreSala }}</h1>
      <p class="text-subtitle-2 text-grey-darken-1">
        Ubicación: <span class="font-weight-bold text-grey-darken-3">{{ nombreEdificio }}</span>
      </p>
    </div>

    <div v-if="loading">
      <v-skeleton-loader type="card" class="rounded-xl mb-6"></v-skeleton-loader>
      <v-row dense>
        <v-col cols="6" v-for="n in 4" :key="n" class="pa-1">
          <v-skeleton-loader type="list-item-two-line" class="rounded-xl"></v-skeleton-loader>
        </v-col>
      </v-row>
    </div>

    <div v-else-if="reporteData">
      <v-card class="pa-6 rounded-xl mb-6 d-flex align-center justify-space-between standard-card" elevation="0">
        <div>
          <div class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-1">Índice de Operatividad</div>
<div class="text-h4 font-weight-black text-green-accent-4">
  {{ Number(reporteData.indice_operatividad).toFixed(1) }}%
</div>
        </div>
        <v-avatar color="blue-lighten-5" size="64">
          <v-icon size="32" color="blue-darken-2">mdi-shield-check-outline</v-icon>
        </v-avatar>
      </v-card>

      <v-row dense>
        <v-col cols="6" class="pa-1">
          <v-card class="pa-4 rounded-xl standard-card text-center h-100 d-flex flex-column align-center" elevation="0">
            <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">Total Equipos</div>
            <div class="text-h6 font-weight-bold text-blue-darken-2">{{ reporteData.total_dispositivos }}</div>
            <div class="text-caption text-grey">Dispositivos en red</div>
          </v-card>
        </v-col>

        <v-col cols="6" class="pa-1">
          <v-card class="pa-4 rounded-xl standard-card text-center h-100 d-flex flex-column align-center" elevation="0">
            <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">Computadoras</div>
            <div class="text-h6 font-weight-bold text-blue-darken-2">{{ reporteData.cant_computadoras }}</div>
            <div class="text-caption text-grey">Estaciones (Tipo C)</div>
          </v-card>
        </v-col>

        <v-col cols="6" class="pa-1">
          <v-card class="pa-4 rounded-xl standard-card text-center h-100 d-flex flex-column align-center" elevation="0">
            <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">Climatización</div>
            <div class="text-h6 font-weight-bold text-blue-darken-2">{{ reporteData.cant_aires }}</div>
            <div class="text-caption text-grey">Equipos (Tipo A)</div>
          </v-card>
        </v-col>

        <v-col cols="6" class="pa-1">
          <v-card class="pa-4 rounded-xl standard-card text-center h-100 d-flex flex-column align-center" elevation="0">
            <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">Alertas Activas</div>
            <div 
              class="text-h6 font-weight-bold" 
              :class="reporteData.alarmas_activas > 0 ? 'text-red-darken-2' : 'text-green-darken-2'"
            >
              {{ reporteData.alarmas_activas }}
            </div>
            <div class="text-caption text-grey">Incidentes sin cerrar</div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div class="d-flex justify-center w-100 no-print" v-if="!loading && reporteData">
      <v-btn
        prepend-icon="mdi-printer"
        color="blue-darken-2"
        class="mt-8 text-none rounded-pill px-8"
        elevation="2"
        @click="imprimirReporte"
      >
        Imprimir Reporte en PDF
      </v-btn>
    </div>

  </v-container>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useReportStore } from "@/stores/reports"
import { useBuildingStore } from "@/stores/buildings";
import { useRoomStore } from "@/stores/rooms";

const route = useRoute();
const reportStore = useReportStore();
const buildingStore = useBuildingStore();
const roomStore = useRoomStore();

// Datos reactivos del store
const { reporteData, loading } = storeToRefs(reportStore);

onMounted(() => {
  const salaId = route.params.roomId;
  if (salaId) {
    // Llamada al backend para obtener los datos de la vista
    reportStore.obtenerReporteSala({ id: salaId });
  }
});

/* Lógica de nombres basada en los parámetros de la URL */
const nombreEdificio = computed(() => {
  const edif = buildingStore.edificios.find(e => e.codigoEdificio === route.params.buildingId);
  return edif ? edif.nombreEdificio : route.params.buildingId;
});

const nombreSala = computed(() => {
  const sala = roomStore.salas.find(s => s.codigoSala === route.params.roomId);
  return sala ? (sala.nombreSala || sala.codigoSala) : route.params.roomId;
});

const imprimirReporte = () => {
  window.print();
};
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
  transition: transform 0.2s ease;
}

@media print {
  .no-print, .v-btn { display: none !important; }
  .main-container { max-width: 100% !important; margin: 0 !important; }
}
</style>