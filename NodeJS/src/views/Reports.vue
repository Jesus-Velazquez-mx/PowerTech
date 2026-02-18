<template>
  <v-container class="mt-8 px-4 main-container" fluid>
    
    <div class="mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" color="blue-darken-2" @click="$router.back()"></v-btn>
      <span class="text-subtitle-1 font-weight-bold ml-2">Volver a la selección </span>      
      <h1 class="text-h4 font-weight-bold">Reporte: {{ nombreSala }}</h1>
      <p class="text-subtitle-2 text-grey-darken-1">Ubicación: <span class="font-weight-bold text-grey-darken-3">{{ nombreEdificio }}</span></p>
    </div>

    <v-card class="pa-6 rounded-xl mb-6 d-flex align-center justify-space-between standard-card" elevation="0">
      <div>
        <div class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-1">Dato Principal</div>
        <div class="text-h4 font-weight-black text-green-accent-4">
          98.5%
        </div>
      </div>
      <v-avatar color="blue-lighten-5" size="64">
        <v-icon size="32" color="blue-darken-2">mdi-chart-line</v-icon>
      </v-avatar>
    </v-card>

    <v-row dense>
      <v-col cols="6" v-for="n in 4" :key="n" class="pa-1">
        <v-card class="pa-4 rounded-xl standard-card text-center h-100 d-flex flex-column align-center" elevation="0">
          <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">Dato {{ n }}</div>
          <div class="text-h6 font-weight-bold text-blue-darken-2">Placeholder</div>
          <div class="text-caption text-grey">Información adicional</div>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-6 pa-4 rounded-xl standard-card" elevation="0">
      <div class="text-subtitle-1 font-weight-bold mb-3 ml-1" style="color: #3b6fb6;">Detalles Técnicos</div>
      <div v-for="i in 3" :key="'det-'+i" class="d-flex justify-space-between py-2 border-bottom">
        <span class="text-body-2 text-grey-darken-2 font-weight-medium">Dato Técnico {{ i }}</span>
        <span class="text-body-2 font-weight-bold">Valor {{ i }}</span>
      </div>
    </v-card>

    <div class="d-flex justify-center w-100">
      <v-btn
        prepend-icon="mdi-printer"
        color="blue-darken-2"
        class="mt-4 text-none rounded-pill px-8"
        elevation="2"
        @click="imprimirReporte"
      >
        Imprimir en PDF
      </v-btn>
    </div>

  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from "@/stores/users";
import { useBuildingStore } from "@/stores/buildings";
import { useRoomStore } from "@/stores/rooms";

const route = useRoute();
const userStore = useUserStore();
const buildingStore = useBuildingStore();
const roomStore = useRoomStore();

/** * Lógica para obtener nombres reales desde los stores
 */
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

const nombreFormateado = computed(() => {
  const nombreCompleto = userStore.usuario?.nombre;
  if (!nombreCompleto) return "";
  const primerNombre = nombreCompleto.split(" ")[0];
  return primerNombre.charAt(0).toUpperCase() + primerNombre.slice(1).toLowerCase();
});
</script>

<style scoped>
/* [REGLA DE CONSISTENCIA]: Alineación visual */
.main-container {
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 40px;
}

/* [REGLA DE CONSISTENCIA]: Estilo estándar de tarjetas de PowerTech */
.standard-card {
  background-color: #f8f9fb !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
  transition: transform 0.2s ease;
}

.border-bottom {
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.border-bottom:last-child {
  border-bottom: none;
}

@media print {
  .no-print, nav, .v-bottom-navigation, .fab-container {
    display: none !important;
  }
  .main-container {
    max-width: 100% !important;
    margin: 0 !important;
    padding: 20px !important;
  }
  .v-card {
    border: 1px solid #eee !important;
    break-inside: avoid;
  }
}
</style>