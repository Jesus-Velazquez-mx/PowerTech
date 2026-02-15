<template>
  <v-container class="mt-8 px-4 main-container" fluid>
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold">Monitoreo</h1>
      <p class="text-subtitle-2 text-grey-darken-1">Estado energético de tus edificios</p>
    </div>

    <v-row class="mb-6" align="center" dense>
      <v-col cols="12" sm="7">
        <v-btn-toggle
          v-model="filtroTiempo"
          rounded="xl"
          color="primary"
          group
          mandatory
          density="comfortable"
        >
          <v-btn value="dia">Día</v-btn>
          <v-btn value="semana">Semana</v-btn>
          <v-btn value="mes">Mes</v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="12" sm="5">
        <v-select
          v-model="edificioSeleccionado"
          :items="edificios"
          label="Edificio"
          variant="solo-filled"
          rounded="xl"
          flat
          hide-details
          bg-color="blue-lighten-5"
          color="primary"
          density="compact"
        ></v-select>
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col cols="12" v-for="n in 3" :key="n">
         <v-skeleton-loader
           type="card"
           class="rounded-xl mb-3"
         ></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-card
      v-else-if="!datosMonitoreo"
      class="pa-8 text-center rounded-xl bg-transparent elevation-0 border-dashed"
    >
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-chart-bar-off</v-icon>
      <div class="text-h6 text-grey-darken-2">Sin datos disponibles</div>
      <div class="text-body-2 text-grey">No hay registros para este periodo.</div>
    </v-card>

    <div v-else class="monitoring-content">

      <v-card class="rounded-xl pa-5 mb-4 elevation-1 border-light">
        <div class="d-flex justify-space-between align-start mb-4">
          <div>
            <span class="text-subtitle-1 text-grey-darken-1 d-block">Consumo total</span>
            <span class="text-h4 font-weight-bold text-green-darken-1">
              {{ datosMonitoreo.consumoTotal }} kWh
            </span>
          </div>
        </div>
        <v-sheet height="120" class="d-flex align-end justify-space-between pt-4">
          <div
            v-for="(val, i) in [40, 60, 45, 90, 65, 80, 50]"
            :key="i"
            class="bg-blue-lighten-4 rounded-t-lg"
            :style="{ height: val + '%', width: '12%' }"
          ></div>
        </v-sheet>
        <div class="d-flex justify-space-between mt-2 text-caption text-grey">
          <span>3:00 PM</span><span>8:00 PM</span>
        </div>
      </v-card>

      <v-card class="rounded-xl pa-5 mb-4 elevation-1 border-light">
        <p class="text-subtitle-1 text-grey-darken-1 mb-4">Consumo por dispositivo</p>
        <v-row align="center" no-gutters>
          <v-col cols="5">
            <v-progress-circular
              :model-value="75"
              :size="100"
              :width="12"
              color="blue"
            >
              <span class="text-caption font-weight-bold">75%</span>
            </v-progress-circular>
          </v-col>
          <v-col cols="7">
            <div v-for="item in desglose" :key="item.label" class="d-flex align-center mb-1">
              <v-icon :color="item.color" size="small" class="mr-2">mdi-circle</v-icon>
              <span class="text-body-2 mr-auto">{{ item.label }}</span>
              <span class="text-body-2 font-weight-bold">{{ item.valor }}%</span>
            </div>
          </v-col>
        </v-row>
      </v-card>

      <v-row dense>
        <v-col cols="6">
          <v-card class="rounded-xl pa-4 text-center elevation-1 border-light">
            <p class="text-caption text-grey-darken-1 mb-1">Costo Est.</p>
            <h3 class="text-h6 font-weight-bold">${{ datosMonitoreo.costo }}</h3>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card class="rounded-xl pa-4 text-center elevation-1 border-light">
            <p class="text-caption text-grey-darken-1 mb-1">Uso Pico</p>
            <h3 class="text-h6 font-weight-bold">{{ datosMonitoreo.pico }} kWh</h3>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/users';
// import { useMonitoringStore } from '@/stores/monitoring'; // Ejemplo de store

const userStore = useUserStore();
const { usuario } = storeToRefs(userStore);

// Estados locales (Placeholder para conectar a tu Store después)
const loading = ref(false);
const filtroTiempo = ref('dia');
const edificioSeleccionado = ref('Edificio B');
const edificios = ['Edificio A', 'Edificio B', 'Edificio C'];

const datosMonitoreo = ref({
  consumoTotal: 100,
  costo: '1,000,000',
  pico: 180
});

const desglose = [
  { label: 'Iluminación', valor: 38, color: 'red' },
  { label: 'Aclimatización', valor: 29, color: 'blue' },
  { label: 'Computadoras', valor: 33, color: 'green' }
];

/**
 * Función para jalar datos de la BD
 */
const cargarDatos = async () => {
  const userId = usuario.value?.idUsuario;
  if (!userId) return;

  loading.value = true;
  try {
    // Simulación de llamada a API/Store
    // await monitoringStore.obtenerResumen({ id: userId, edificio: edificioSeleccionado.value, periodo: filtroTiempo.value });
    console.log("Cargando datos para:", edificioSeleccionado.value);
  } finally {
    setTimeout(() => { loading.value = false; }, 800); // Simulación de lag
  }
};

onMounted(() => {
  cargarDatos();
});

// Watchers para recargar al cambiar filtros (como en una app real)
watch([filtroTiempo, edificioSeleccionado, () => usuario.value?.idUsuario], () => {
  cargarDatos();
});
</script>

<style scoped>
.main-container {
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

.v-card {
  transition: transform 0.2s ease;
  box-shadow: none !important;
  border: none !important;
  background-color: #f8f9fb;
}

.v-sheet{
   background-color: #f8f9fb;
}

.v-card:active {
  transform: scale(0.98);
}


/* Animación simple para las barras del gráfico */
.bg-blue-lighten-4 {
  transition: height 0.4s ease-out;
}
</style>