<template>
  <v-container class="mt-8 px-4 main-container" fluid>
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold">Monitoreo</h1>
      <p class="text-subtitle-2 text-grey-darken-1">Estado energético de tus edificios (Mes Actual)</p>
    </div>

    <v-row class="mb-6" align="center" dense>
      <v-col cols="12">
        <v-select v-model="edificioSeleccionado" :items="edificios" item-title="nombreEdificio"
          item-value="codigoEdificio" label="Seleccionar Edificio" variant="solo-filled" rounded="xl" flat hide-details
          bg-color="blue-lighten-5" color="primary" density="comfortable" :loading="loadingBuildings"></v-select>
      </v-col>
    </v-row>

    <v-row v-if="loading || loadingBuildings">
      <v-col cols="12" v-for="n in 3" :key="n">
        <v-skeleton-loader type="card" class="rounded-xl mb-3"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-card v-else-if="consumoTotal === 0 && edificioSeleccionado"
      class="pa-8 text-center rounded-xl bg-transparent elevation-0 border-dashed">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-chart-bar-off</v-icon>
      <div class="text-h6 text-grey-darken-2">Sin datos disponibles</div>
      <div class="text-body-2 text-grey">No hay registros para <b>{{ nombreEdificioMostrado }}</b> en marzo 2026.</div>
    </v-card>

    <v-card v-else-if="!edificioSeleccionado"
      class="pa-8 text-center rounded-xl bg-transparent elevation-0 border-dashed">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-office-building-marker-outline</v-icon>
      <div class="text-h6 text-grey-darken-2">Selecciona un edificio</div>
      <div class="text-body-2 text-grey">Elige un edificio del menú para ver su consumo.</div>
    </v-card>

    <div v-else class="monitoring-content">
      <v-card class="rounded-xl pa-5 mb-4 elevation-1 border-light">
        <div class="d-flex justify-space-between align-start mb-4">
          <div>
            <span class="text-subtitle-1 text-grey-darken-1 d-block">Consumo total</span>
            <span class="text-h4 font-weight-bold text-green-darken-1">
              {{ parseFloat(consumoTotal).toFixed(2) }} kWh
            </span>
          </div>
        </div>
        <v-sheet height="120" class="d-flex align-end justify-space-between pt-4">
          <div v-for="(val, i) in [40, 60, 45, 90, 65, 80, 50]" :key="i" class="bg-blue-lighten-4 rounded-t-lg"
            :style="{ height: val + '%', width: '12%' }"></div>
        </v-sheet>
        <div class="d-flex justify-space-between mt-2 text-caption text-grey">
          <span>Lecturas del mes</span><span>Marzo 2026</span>
        </div>
      </v-card>

      <v-card class="rounded-xl pa-5 mb-4 elevation-1 border-light">
        <p class="text-subtitle-1 text-grey-darken-1 mb-4">Consumo por dispositivo</p>
        <v-row align="center" no-gutters>
          <v-col cols="5">
            <v-progress-circular :model-value="porcentajeCompu" :size="100" :width="12" color="blue">
              <span class="text-caption font-weight-bold">{{ porcentajeCompu }}%</span>
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
            <h3 class="text-h6 font-weight-bold">${{ (consumoTotal * 1.5).toFixed(2) }}</h3>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card class="rounded-xl pa-4 text-center elevation-1 border-light">
            <p class="text-caption text-grey-darken-1 mb-1">Dispositivos</p>
            <h3 class="text-h6 font-weight-bold">8</h3>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { onMounted, watch, ref, computed } from 'vue';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { useBuildingStore } from '@/stores/buildings';
import { useUserStore } from '@/stores/users';

const buildingStore = useBuildingStore();
const userStore = useUserStore();

// Obtenemos los edificios del usuario directamente del store
const { edificios, loading: loadingBuildings } = storeToRefs(buildingStore);

const loading = ref(false);
const edificioSeleccionado = ref(null);

const consumoTotal = ref(0);
const totalValorCompu = ref(0);
const totalValorAires = ref(0);

// Computed para mostrar el nombre real del edificio en caso de no haber datos
const nombreEdificioMostrado = computed(() => {
  const edif = edificios.value.find(e => e.codigoEdificio === edificioSeleccionado.value);
  return edif ? edif.nombreEdificio : edificioSeleccionado.value;
});

const porcentajeCompu = computed(() => {
  const suma = totalValorCompu.value + totalValorAires.value;
  return suma > 0 ? Math.round((totalValorCompu.value / suma) * 100) : 0;
});

const porcentajeAires = computed(() => {
  const suma = totalValorCompu.value + totalValorAires.value;
  return suma > 0 ? Math.round((totalValorAires.value / suma) * 100) : 0;
});

const desglose = computed(() => [
  { label: 'Computadoras', valor: porcentajeCompu.value, color: 'blue' },
  { label: 'Aires Acond.', valor: porcentajeAires.value, color: 'cyan' }
]);

const cargarDatos = async () => {
  if (!edificioSeleccionado.value) return; // Si no hay edificio, detenemos la carga

  loading.value = true;
  const id = edificioSeleccionado.value;
  try {
    const [resGral, resComp, resAire] = await Promise.all([
      axios.get(`/monitoring/general/${id}`),
      axios.get(`/monitoring/comp/${id}`),
      axios.get(`/monitoring/aire/${id}`)
    ]);

    const dataGral = resGral.data.data;
    consumoTotal.value = dataGral[0]?.total || dataGral[0]?.['sum(l.valor)'] || 0;

    const dataComp = resComp.data.data || [];
    totalValorCompu.value = dataComp.reduce((acc, curr) => {
      return acc + parseFloat(curr.total_valor || curr['sum(l.valor)'] || 0);
    }, 0);

    const dataAire = resAire.data.data || [];
    totalValorAires.value = dataAire.reduce((acc, curr) => {
      return acc + parseFloat(curr.total_valor || curr['sum(l.valor)'] || 0);
    }, 0);

  } catch (error) {
    console.error("Error cargando datos:", error);
    consumoTotal.value = 0;
  } finally {
    setTimeout(() => { loading.value = false; }, 400);
  }
};

onMounted(() => {
  const userId = userStore.usuario?.idUsuario;
  if (userId) {
    // Jalamos los edificios del backend al entrar
    buildingStore.listarEdificiosPorUsuario({
      id: userId,
      onComplete: () => {
        // Seleccionar el primer edificio automáticamente si existen
        if (edificios.value.length > 0) {
          edificioSeleccionado.value = edificios.value[0].codigoEdificio;
        }
      }
    });
  }
});

// Cuando el usuario cambia de edificio en el v-select, disparamos cargarDatos
watch(edificioSeleccionado, cargarDatos);
</script>

<style scoped>
.main-container {
  max-width: 520px;
  margin: 0 auto;
}

.v-card {
  background-color: #ffffff !important;
  border: 1px solid #eef0f2 !important;
  transition: transform 0.2s ease;
}

.v-card:active {
  transform: scale(0.99);
}

.bg-blue-lighten-4 {
  transition: height 0.6s ease;
}

.border-dashed {
  border: 2px dashed #d1d5db !important;
}
</style>