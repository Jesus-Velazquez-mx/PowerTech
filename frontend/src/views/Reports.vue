<template>
  <v-container class="mt-4 px-4 main-container print-container" fluid>

    <!-- HEADER DEL REPORTE -->
    <div class="mb-6 border-b pb-4 d-flex justify-space-between align-end flex-wrap gap-4 print-header">
      <div>
        <!-- Usamos d-print-none nativo de Vuetify para asegurar que no salga en el PDF -->
        <div class="d-print-none mb-4">
          <v-btn prepend-icon="mdi-arrow-left" variant="plain" color="blue-darken-2" class="px-0 text-none"
            @click="$router.back()">
            Volver a la selección
          </v-btn>
        </div>
        <div class="d-flex align-center mb-1">
          <v-icon color="blue-darken-3" size="32" class="mr-2 d-print-none">mdi-google-analytics</v-icon>
          <h1 class="text-h4 font-weight-black text-grey-darken-4">Reporte de Operatividad</h1>
        </div>
        <p class="text-subtitle-1 text-grey-darken-1 mb-0">
          Sala: <span class="font-weight-bold text-blue-darken-4">{{ nombreSala }}</span> |
          Edificio: <span class="font-weight-bold text-grey-darken-3">{{ nombreEdificio }}</span>
        </p>
      </div>

      <!-- Sello de fecha para el PDF -->
      <div class="text-right d-none d-print-block print-visible">
        <div class="text-caption text-grey text-uppercase font-weight-bold">Fecha de Emisión</div>
        <div class="text-body-2 font-weight-medium">{{ fechaActual }}</div>
      </div>
    </div>

    <!-- SKELETON LOADER -->
    <div v-if="loading" class="d-print-none">
      <v-skeleton-loader type="card" class="rounded-xl mb-6"></v-skeleton-loader>
      <v-row dense>
        <v-col cols="6" v-for="n in 4" :key="n" class="pa-2">
          <v-skeleton-loader type="list-item-two-line" class="rounded-xl"></v-skeleton-loader>
        </v-col>
      </v-row>
    </div>

    <!-- CONTENIDO DEL REPORTE -->
    <div v-else-if="reporteData" class="report-content">

      <!-- Agregamos clase print-row para forzar la estructura en el PDF -->
      <v-row class="print-row">

        <!-- SECCIÓN IZQUIERDA: GRÁFICO PRINCIPAL -->
        <v-col cols="12" md="5" class="d-flex flex-column print-col-left">
          <v-card
            class="pa-6 rounded-xl flex-grow-1 d-flex flex-column align-center justify-center dashboard-card border-card"
            elevation="0">
            <div class="text-subtitle-1 font-weight-bold text-grey-darken-2 mb-6 w-100 text-center">
              Índice de Salud de la Sala
            </div>

            <v-progress-circular :model-value="Number(reporteData.indice_operatividad)" :color="colorOperatividad"
              size="180" width="18" class="mb-4 bg-grey-lighten-4 rounded-circle">
              <div class="text-center">
                <div class="text-h3 font-weight-black" :class="`text-${colorOperatividad}`">
                  {{ Number(reporteData.indice_operatividad).toFixed(0) }}<span class="text-h5">%</span>
                </div>
              </div>
            </v-progress-circular>

            <v-chip :color="colorOperatividad" variant="flat" class="font-weight-bold text-uppercase px-6 mt-2"
              size="large">
              {{ textoOperatividad }}
            </v-chip>
          </v-card>
        </v-col>

        <!-- SECCIÓN DERECHA: MÉTRICAS Y BARRAS -->
        <v-col cols="12" md="7" class="print-col-right">
          <v-row dense>

            <v-row class="w-100 ma-0 print-sub-row">
              <!-- Dispositivos Totales -->
              <v-col cols="6" class="pa-2 print-sub-col">
                <v-card class="pa-4 rounded-xl dashboard-card border-card h-100 d-flex align-center" elevation="0">
                  <v-avatar color="blue-lighten-5" size="54" class="mr-4">
                    <v-icon size="28" color="blue-darken-2">mdi-memory</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h5 font-weight-black text-grey-darken-4">{{ reporteData.total_dispositivos }}</div>
                    <div class="text-caption font-weight-bold text-grey-darken-1">Equipos en Red</div>
                  </div>
                </v-card>
              </v-col>

              <!-- Sensores Activos -->
              <v-col cols="6" class="pa-2 print-sub-col">
                <v-card class="pa-4 rounded-xl dashboard-card border-card h-100 d-flex align-center" elevation="0">
                  <v-avatar color="cyan-lighten-5" size="54" class="mr-4">
                    <v-icon size="28" color="cyan-darken-3">mdi-access-point-network</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h5 font-weight-black text-grey-darken-4">{{ reporteData.total_sensores }}</div>
                    <div class="text-caption font-weight-bold text-grey-darken-1">Sensores Físicos</div>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <!-- Gráfico Comparativo de Alarmas -->
            <v-col cols="12" class="pa-2 mt-2 w-100">
              <v-card class="pa-5 rounded-xl dashboard-card border-card" elevation="0">
                <div class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-4">Balance de Incidentes</div>

                <!-- Barra de Alarmas Resueltas -->
                <div class="mb-4">
                  <div class="d-flex justify-space-between align-end mb-1">
                    <span class="text-body-2 font-weight-medium text-grey-darken-3">
                      <v-icon color="green" size="small" class="mr-1">mdi-check-circle</v-icon> Resueltas Históricas
                    </span>
                    <span class="text-body-2 font-weight-bold">{{ reporteData.alarmas_historicas_resueltas }}</span>
                  </div>
                  <v-progress-linear :model-value="porcentajeResueltas" color="green-darken-1" height="10" rounded
                    bg-color="grey-lighten-3"></v-progress-linear>
                </div>

                <!-- Barra de Alarmas Activas -->
                <div>
                  <div class="d-flex justify-space-between align-end mb-1">
                    <span class="text-body-2 font-weight-medium text-grey-darken-3">
                      <v-icon color="red" size="small" class="mr-1">mdi-alert-circle</v-icon> Activas Críticas
                    </span>
                    <span class="text-body-2 font-weight-bold text-red">{{ reporteData.alarmas_activas }}</span>
                  </div>
                  <v-progress-linear :model-value="porcentajeActivas" color="red-darken-1" height="10" rounded
                    bg-color="grey-lighten-3"></v-progress-linear>
                </div>

              </v-card>
            </v-col>

          </v-row>
        </v-col>
      </v-row>
    </div>

    <!-- BOTÓN DE IMPRESIÓN -->
    <div class="d-flex justify-center w-100 mt-10 d-print-none" v-if="!loading && reporteData">
      <v-btn prepend-icon="mdi-printer" color="blue-darken-3" class="text-none rounded-xl pa-4 font-weight-bold"
        size="large" elevation="3" @click="imprimirReporte">
        Exportar Reporte a PDF
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

const { reporteData, loading } = storeToRefs(reportStore);

onMounted(() => {
  const salaId = route.params.roomId;
  if (salaId) {
    reportStore.obtenerReporteSala({ id: salaId });
  }
});

/* Propiedades Computadas para Nombres */
const nombreEdificio = computed(() => {
  const edif = buildingStore.edificios.find(e => e.codigoEdificio === route.params.buildingId);
  return edif ? edif.nombreEdificio : route.params.buildingId;
});

const nombreSala = computed(() => {
  const sala = roomStore.salas.find(s => s.codigoSala === route.params.roomId);
  return sala ? (sala.nombreSala || sala.codigoSala) : route.params.roomId;
});

const fechaActual = computed(() => {
  const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date().toLocaleDateString('es-MX', opciones);
});

/* Lógica de colores y estados para el Índice de Operatividad */
const colorOperatividad = computed(() => {
  if (!reporteData.value) return 'grey';
  const indice = Number(reporteData.value.indice_operatividad);
  if (indice >= 90) return 'green-darken-1';
  if (indice >= 70) return 'orange-darken-2';
  return 'red-darken-2';
});

const textoOperatividad = computed(() => {
  if (!reporteData.value) return 'Desconocido';
  const indice = Number(reporteData.value.indice_operatividad);
  if (indice >= 90) return 'Óptimo';
  if (indice >= 70) return 'En Riesgo';
  return 'Crítico';
});

/* Cálculos para las barras de progreso de alarmas */
const totalAlarmasHistoricas = computed(() => {
  if (!reporteData.value) return 0;
  return Number(reporteData.value.alarmas_activas) + Number(reporteData.value.alarmas_historicas_resueltas);
});

const porcentajeActivas = computed(() => {
  if (totalAlarmasHistoricas.value === 0) return 0;
  return (Number(reporteData.value.alarmas_activas) / totalAlarmasHistoricas.value) * 100;
});

const porcentajeResueltas = computed(() => {
  if (totalAlarmasHistoricas.value === 0) return 0;
  return (Number(reporteData.value.alarmas_historicas_resueltas) / totalAlarmasHistoricas.value) * 100;
});

/* Función de Impresión con nombre de archivo dinámico */
const imprimirReporte = () => {
  // 1. Guardar el título original de la página web
  const tituloOriginal = document.title;

  // 2. Limpiar espacios y generar el nombre Reporte_Edificio_Sala
  const edifLimpio = nombreEdificio.value.replace(/\s+/g, '_');
  const salaLimpia = nombreSala.value.replace(/\s+/g, '_');

  // 3. Cambiar el título temporalmente (el navegador usa esto para el nombre del PDF)
  document.title = `Reporte_${edifLimpio}_${salaLimpia}`;

  // 4. Abrir diálogo de impresión
  window.print();

  // 5. Restaurar el título original después de un pequeño retraso
  setTimeout(() => {
    document.title = tituloOriginal;
  }, 500);
};
</script>

<style scoped>
.main-container {
  max-width: 850px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 40px;
}

.dashboard-card {
  background-color: #ffffff !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.dashboard-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
}

.border-card {
  border: 1px solid #eef2f6 !important;
}

/* =========================================
   ESTILOS ESTRICTOS PARA IMPRESIÓN A PDF
   ========================================= */
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  @page {
    size: letter portrait;
    margin: 1.5cm;
  }

  body {
    background-color: white !important;
  }

  .print-container {
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* FORZAR REJILLA: Evita que el navegador apile los elementos verticalmente */
  .print-row {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
  }

  .print-col-left {
    flex: 0 0 42% !important;
    max-width: 42% !important;
    padding-right: 16px !important;
  }

  .print-col-right {
    flex: 0 0 58% !important;
    max-width: 58% !important;
  }

  .print-sub-row {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
  }

  .print-sub-col {
    flex: 0 0 50% !important;
    max-width: 50% !important;
  }

  /* Ajustes visuales para las tarjetas en papel */
  .dashboard-card {
    border: 1px solid #d0d0d0 !important;
    box-shadow: none !important;
    break-inside: avoid;
    margin-bottom: 16px !important;
  }

  .print-header {
    border-bottom: 2px solid #e0e0e0 !important;
  }
}
</style>