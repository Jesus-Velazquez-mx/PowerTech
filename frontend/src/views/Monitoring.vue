<template>
  <v-container class="mt-8 px-4 main-container" fluid>
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold">Monitoreo</h1>
      <p class="text-subtitle-2 text-grey-darken-1">Estado energético de tus edificios</p>
    </div>

    <!-- Filtros Dinámicos de Fecha y Edificio -->
    <v-row class="mb-2" align="center" dense>
      <v-col cols="12">
        <v-select v-model="edificioSeleccionado" :items="edificios" item-title="nombreEdificio"
          item-value="codigoEdificio" label="Seleccionar Edificio" variant="solo-filled" rounded="xl" flat hide-details
          bg-color="blue-lighten-5" color="primary" density="comfortable" :loading="loadingBuildings"></v-select>
      </v-col>
    </v-row>
    <v-row class="mb-6" dense>
      <v-col cols="6">
        <v-select v-model="anioSeleccionado" :items="aniosDisponibles" label="Año" variant="solo-filled" rounded="xl"
          flat hide-details bg-color="blue-lighten-5" color="primary" density="comfortable"
          :disabled="!edificioSeleccionado"></v-select>
      </v-col>
      <v-col cols="6">
        <v-select v-model="mesSeleccionado" :items="mesesDisponiblesFiltrados" item-title="text" item-value="value"
          label="Mes" variant="solo-filled" rounded="xl" flat hide-details bg-color="blue-lighten-5" color="primary"
          density="comfortable" :disabled="!anioSeleccionado">
          <template v-slot:no-data>
            <div class="pa-3 text-caption text-grey">Sin lecturas este año</div>
          </template>
        </v-select>
      </v-col>
    </v-row>

    <v-row v-if="loading || loadingBuildings">
      <v-col cols="12" v-for="n in 3" :key="n">
        <v-skeleton-loader type="card" class="rounded-xl mb-3"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-card v-else-if="consumoTotal === 0 && edificioSeleccionado && nivelSeleccionado === 'General'"
      class="pa-8 text-center rounded-xl bg-transparent elevation-0 border-dashed">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-chart-bar-off</v-icon>
      <div class="text-h6 text-grey-darken-2">Sin datos disponibles</div>
      <div class="text-body-2 text-grey">No hay registros para <b>{{ nombreEdificioMostrado }}</b> en este periodo.
      </div>
    </v-card>

    <div v-else class="monitoring-content">

      <!-- SECCIÓN: Selector de Tarifa y Horarios Modificables -->
      <div class="mb-6">
        <div class="d-flex justify-center mb-4">
          <v-btn-toggle v-model="tarifaSeleccionada" color="green-darken-3" mandatory rounded="xl" group
            class="elevation-1 bg-white">
            <v-btn value="GDMTH" class="px-8 font-weight-bold">GDMTH</v-btn>
            <v-btn value="GDMTO" class="px-8 font-weight-bold">GDMTO</v-btn>
          </v-btn-toggle>
        </div>

        <v-card class="rounded-xl pa-4 elevation-1 border">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="d-flex align-center">
              <v-icon color="green-darken-3" class="mr-2">mdi-clock-time-four-outline</v-icon>
              <span class="text-subtitle-2 font-weight-bold text-grey-darken-3">Horarios {{ tarifaSeleccionada }}</span>
            </div>
            <v-btn :icon="editandoHorarios ? 'mdi-check' : 'mdi-pencil'" variant="text" size="small"
              :color="editandoHorarios ? 'green' : 'grey'" @click="editandoHorarios = !editandoHorarios"></v-btn>
          </div>
          <v-row dense>
            <v-col cols="12" v-for="(item, index) in horariosActuales" :key="index">
              <div class="d-flex align-start justify-space-between bg-grey-lighten-4 pa-2 rounded-lg border-sm">
                <div class="d-flex align-center mt-1" style="min-width: 90px;">
                  <v-icon :color="item.color" size="small" class="mr-1">mdi-circle</v-icon>
                  <span class="text-body-2 font-weight-bold text-grey-darken-3">{{ item.nivel }}</span>
                </div>
                <div class="d-flex flex-column align-end flex-grow-1">
                  <div v-for="(bloque, bIdx) in item.bloques" :key="bIdx" class="d-flex align-center mb-1">
                    <span v-if="!editandoHorarios" class="text-caption text-grey-darken-2 font-weight-medium">{{
                      bloque.inicio }} a {{ bloque.fin }}</span>
                    <div v-else class="d-flex align-center">
                      <v-text-field v-model="bloque.inicio" type="time" density="compact" variant="outlined"
                        hide-details class="time-input bg-white"></v-text-field>
                      <span class="mx-2 text-caption text-grey">a</span>
                      <v-text-field v-model="bloque.fin" type="time" density="compact" variant="outlined" hide-details
                        class="time-input bg-white"></v-text-field>
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <!-- SECCIÓN: Consumo total y Gráfica Real -->
      <v-card class="rounded-xl pa-5 mb-4 elevation-1 border-light">
        <div class="d-flex justify-space-between align-start mb-4">
          <div>
            <span class="text-subtitle-1 text-grey-darken-1 d-block">Consumo total</span>
            <span class="text-h4 font-weight-bold text-green-darken-1">{{ parseFloat(consumoTotal).toFixed(2) }}
              kWh</span>
          </div>
        </div>

        <!-- Filtro de Nivel de Tarifa para afectar la Gráfica y Datos -->
        <div class="d-flex justify-center mb-2">
          <v-btn-toggle v-model="nivelSeleccionado" color="deep-purple-darken-1" mandatory rounded="xl" group
            density="compact" class="elevation-0 bg-purple-lighten-5">
            <v-btn value="General" class="px-3 text-caption font-weight-bold">General</v-btn>
            <v-btn v-for="item in horariosActuales" :key="item.nivel" :value="item.nivel"
              class="px-3 text-caption font-weight-bold">
              {{ item.nivel }}
            </v-btn>
          </v-btn-toggle>
        </div>

        <!-- Selector de periodo (Día, Semana, Mes) -->
        <div class="d-flex justify-center mb-4">
          <v-btn-toggle v-model="periodoSeleccionado" color="blue-darken-1" mandatory rounded="xl" group
            density="compact" class="elevation-0 bg-blue-lighten-5">
            <v-btn value="dia" class="px-4 text-caption font-weight-bold">Día</v-btn>
            <v-btn value="semana" class="px-4 text-caption font-weight-bold">Semana</v-btn>
            <v-btn value="mes" class="px-4 text-caption font-weight-bold">Mes</v-btn>
          </v-btn-toggle>
        </div>

        <v-sheet height="150" class="d-flex align-end justify-space-between pt-4 pb-2 relative">

          <div v-if="loadingGrafica" class="w-100 h-100 d-flex justify-center align-center position-absolute"
            style="z-index: 2; background: rgba(255,255,255,0.7);">
            <v-progress-circular indeterminate color="blue" size="32"></v-progress-circular>
          </div>

          <div v-if="!loadingGrafica && maxChartValue === 1 && consumoTotal === 0"
            class="w-100 text-center text-caption text-grey position-absolute" style="bottom: 50%;">
            Sin consumo en este nivel / horario
          </div>

          <div v-for="(altura, i) in datosGraficaAlturas" :key="i"
            class="d-flex flex-column justify-end align-center h-100 chart-bar-container"
            :style="{ width: `${100 / datosGraficaAlturas.length}%` }">
            <v-tooltip activator="parent" location="top">{{ datosGraficaValores[i].toFixed(2) }} kWh</v-tooltip>
            <div class="bg-blue-lighten-3 rounded-t-sm w-100 mx-px chart-bar" :style="{ height: altura + '%' }"></div>
            <span class="text-grey-darken-1 mt-1 chart-label">{{ etiquetasGrafica[i] }}</span>
          </div>
        </v-sheet>
      </v-card>

      <!-- SECCIÓN: Consumo Dinámico por Dispositivo -->
      <v-card class="rounded-xl pa-5 mb-4 elevation-1 border-light">
        <p class="text-subtitle-1 text-grey-darken-1 mb-4">Desglose por Dispositivos</p>

        <div v-if="desgloseDispositivos.length === 0" class="text-center text-caption text-grey my-4">
          No hay dispositivos registrados o consumo en este horario.
        </div>

        <div v-else v-for="(disp, index) in desgloseDispositivos" :key="index" class="mb-4">
          <div class="d-flex justify-space-between align-center mb-1">
            <span class="text-body-2 font-weight-medium text-grey-darken-3">{{ disp.nombre }}</span>
            <span class="text-caption font-weight-bold text-grey-darken-1">{{ disp.porcentaje }}% ({{ disp.valor }}
              kWh)</span>
          </div>
          <v-progress-linear :model-value="disp.porcentaje"
            :color="coloresDispositivos[index % coloresDispositivos.length]" height="8" rounded></v-progress-linear>
        </div>
      </v-card>

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

const { edificios, loading: loadingBuildings } = storeToRefs(buildingStore);

const loading = ref(false);
const loadingGrafica = ref(false);
const edificioSeleccionado = ref(null);

const fechasDisponibles = ref([]);
const anioSeleccionado = ref(null);
const mesSeleccionado = ref(null);

const nombresMeses = {
  1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril', 5: 'Mayo', 6: 'Junio',
  7: 'Julio', 8: 'Agosto', 9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
};

const aniosDisponibles = computed(() => {
  const anios = fechasDisponibles.value.map(f => f.anio);
  return [...new Set(anios)].sort((a, b) => b - a);
});

const mesesDisponiblesFiltrados = computed(() => {
  if (!anioSeleccionado.value) return [];
  const mesesDelAnio = fechasDisponibles.value.filter(f => f.anio === anioSeleccionado.value).map(f => f.mes);
  const mesesUnicos = [...new Set(mesesDelAnio)].sort((a, b) => a - b);
  return mesesUnicos.map(m => ({ text: nombresMeses[m], value: m }));
});

const tarifaSeleccionada = ref('GDMTH');
const periodoSeleccionado = ref('dia');
const nivelSeleccionado = ref('General'); // Nuevo filtro
const editandoHorarios = ref(false);

const horariosTarifas = ref({
  GDMTH: [
    { nivel: 'Base', bloques: [{ inicio: '00:00', fin: '06:00' }], color: 'green' },
    { nivel: 'Intermedio', bloques: [{ inicio: '06:00', fin: '20:00' }, { inicio: '22:00', fin: '23:59' }], color: 'orange' },
    { nivel: 'Punta', bloques: [{ inicio: '20:00', fin: '22:00' }], color: 'red' }
  ],
  GDMTO: [
    { nivel: 'Base', bloques: [{ inicio: '00:00', fin: '06:00' }], color: 'green' },
    { nivel: 'Intermedio', bloques: [{ inicio: '06:00', fin: '20:00' }, { inicio: '22:00', fin: '23:59' }], color: 'orange' },
    { nivel: 'Punta', bloques: [{ inicio: '20:00', fin: '22:00' }], color: 'red' }
  ]
});

const horariosActuales = computed(() => horariosTarifas.value[tarifaSeleccionada.value]);

// Extraemos los bloques de hora exactos del nivel seleccionado
const rangosFiltro = computed(() => {
  if (nivelSeleccionado.value === 'General') return null;
  const horario = horariosActuales.value.find(h => h.nivel === nivelSeleccionado.value);
  if (!horario) return null;
  return horario.bloques.map(b => `${b.inicio}-${b.fin}`).join(',');
});

const datosGraficaValores = ref([]);
const etiquetasGrafica = ref([]);

const maxChartValue = computed(() => {
  if (datosGraficaValores.value.length === 0) return 1;
  return Math.max(...datosGraficaValores.value) || 1;
});

const datosGraficaAlturas = computed(() => {
  return datosGraficaValores.value.map(v => (v / maxChartValue.value) * 100);
});

const consumoTotal = ref(0);
const dispositivosCrudos = ref([]);
const coloresDispositivos = ['blue', 'cyan', 'indigo', 'teal', 'purple'];

const nombreEdificioMostrado = computed(() => {
  const edif = edificios.value.find(e => e.codigoEdificio === edificioSeleccionado.value);
  return edif ? edif.nombreEdificio : edificioSeleccionado.value;
});

const desgloseDispositivos = computed(() => {
  if (consumoTotal.value === 0 || dispositivosCrudos.value.length === 0) return [];
  return dispositivosCrudos.value.map(d => {
    const valor = parseFloat(d.total_valor || 0);
    return {
      nombre: d.nombre_dispositivo || 'Desconocido',
      valor: valor.toFixed(2),
      porcentaje: Math.round((valor / consumoTotal.value) * 100)
    };
  });
});

const cargarFechasDisponibles = async () => {
  if (!edificioSeleccionado.value) return;
  try {
    const res = await axios.get(`/monitoring/fechas-disponibles/${edificioSeleccionado.value}`);
    fechasDisponibles.value = res.data.data || [];

    if (fechasDisponibles.value.length > 0) {
      anioSeleccionado.value = fechasDisponibles.value[0].anio;
      setTimeout(() => {
        mesSeleccionado.value = fechasDisponibles.value[0].mes;
      }, 50);
    } else {
      anioSeleccionado.value = null;
      mesSeleccionado.value = null;
    }
  } catch (error) {
    console.error("Error cargando fechas:", error);
  }
};

const cargarGrafica = async () => {
  if (!edificioSeleccionado.value || !mesSeleccionado.value || !anioSeleccionado.value) return;
  loadingGrafica.value = true;

  const id = edificioSeleccionado.value;
  let queryParams = `?mes=${mesSeleccionado.value}&anio=${anioSeleccionado.value}&periodo=${periodoSeleccionado.value}`;
  if (rangosFiltro.value) queryParams += `&rangos=${rangosFiltro.value}`;

  try {
    const res = await axios.get(`/monitoring/chart/${id}${queryParams}`);
    const rawData = res.data.data || [];

    if (periodoSeleccionado.value === 'dia') {
      let valores = new Array(24).fill(0);
      let etiquetas = Array.from({ length: 24 }, (_, i) => i % 4 === 0 ? `${i}h` : '');
      rawData.forEach(row => { valores[row.etiqueta] = parseFloat(row.total_valor); });
      datosGraficaValores.value = valores;
      etiquetasGrafica.value = etiquetas;
    } else if (periodoSeleccionado.value === 'semana') {
      let valores = new Array(7).fill(0);
      let etiquetas = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
      rawData.forEach(row => { valores[row.etiqueta] = parseFloat(row.total_valor); });
      datosGraficaValores.value = valores;
      etiquetasGrafica.value = etiquetas;
    } else if (periodoSeleccionado.value === 'mes') {
      const diasEnMes = new Date(anioSeleccionado.value, mesSeleccionado.value, 0).getDate();
      let valores = new Array(diasEnMes).fill(0);
      let etiquetas = Array.from({ length: diasEnMes }, (_, i) => (i + 1) % 5 === 0 ? `${i + 1}` : '');
      rawData.forEach(row => { valores[row.etiqueta - 1] = parseFloat(row.total_valor); });
      datosGraficaValores.value = valores;
      etiquetasGrafica.value = etiquetas;
    }
  } catch (error) {
    console.error("Error cargando gráfica real:", error);
    datosGraficaValores.value = [];
  } finally {
    loadingGrafica.value = false;
  }
};

const cargarDatos = async () => {
  if (!edificioSeleccionado.value || !mesSeleccionado.value || !anioSeleccionado.value) return;

  loading.value = true;
  const id = edificioSeleccionado.value;
  let queryParams = `?mes=${mesSeleccionado.value}&anio=${anioSeleccionado.value}`;
  if (rangosFiltro.value) queryParams += `&rangos=${rangosFiltro.value}`;

  try {
    const [resGral, resDispositivos] = await Promise.all([
      axios.get(`/monitoring/general/${id}${queryParams}`),
      axios.get(`/monitoring/devices/${id}${queryParams}`)
    ]);

    const dataGral = resGral.data.data;
    consumoTotal.value = dataGral[0]?.total || dataGral[0]?.['sum(l.valor)'] || 0;
    dispositivosCrudos.value = resDispositivos.data.data || [];

    cargarGrafica();
  } catch (error) {
    console.error("Error cargando datos:", error);
    consumoTotal.value = 0;
    dispositivosCrudos.value = [];
  } finally {
    setTimeout(() => { loading.value = false; }, 400);
  }
};

onMounted(() => {
  const userId = userStore.usuario?.idUsuario;
  if (userId) {
    buildingStore.listarEdificiosPorUsuario({
      id: userId,
      onComplete: () => {
        if (edificios.value?.length > 0) {
          edificioSeleccionado.value = edificios.value[0].codigoEdificio;
        }
      }
    });
  }
});

// Refrescar al cambiar filtros
watch(edificioSeleccionado, cargarFechasDisponibles);
watch([mesSeleccionado, anioSeleccionado, nivelSeleccionado, tarifaSeleccionada], cargarDatos);
watch(periodoSeleccionado, cargarGrafica);

// Si el usuario termina de editar horarios y no está en 'General', recargamos con las nuevas horas
watch(editandoHorarios, (nuevoValor) => {
  if (!nuevoValor && nivelSeleccionado.value !== 'General') {
    cargarDatos();
  }
});
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

.border-dashed {
  border: 2px dashed #d1d5db !important;
}

.border {
  border: 1px solid #e0e0e0 !important;
}

.border-light {
  border: 1px solid #f5f5f5 !important;
}

.mx-px {
  margin-left: 1px;
  margin-right: 1px;
}

.bg-purple-lighten-5 {
  background-color: #f3e5f5 !important;
}

/* Ajustes para inputs de hora nativos */
.time-input {
  width: 105px;
}

:deep(.time-input input[type="time"]) {
  font-size: 0.85rem;
  padding: 4px;
  cursor: pointer;
}

/* Gráfica */
.relative {
  position: relative;
}

.chart-bar-container {
  min-width: 0;
}

.chart-bar {
  transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 2px;
}

.chart-bar:hover {
  background-color: #1976D2 !important;
}

.chart-label {
  font-size: 0.55rem;
  white-space: nowrap;
  height: 12px;
}
</style>