<template>
  <v-container class="mt-8 px-4 main-container" fluid>

    <v-btn icon="mdi-arrow-left" variant="text" color="blue-darken-2" @click="$router.back()"></v-btn>
    <span class="text-subtitle-1 font-weight-bold ml-2">Regresar</span>
    <div class="text-center mb-10">
      <h1 class="text-h3 font-weight-bold mb-2" style="color: #3b6fb6;">Generar Reporte</h1>
      <p class="text-subtitle-1 text-grey-darken-1">
        Selecciona la ubicación para visualizar los datos
      </p>
    </div>

    <v-card class="standard-card pa-6 rounded-xl" elevation="0">
      <v-form v-model="formValido">

        <div class="text-subtitle-2 font-weight-bold mb-2 ml-1 text-grey-darken-3">Edificio</div>
        <v-select v-model="seleccion.edificioId" :items="edificios" item-title="nombreEdificio"
          item-value="codigoEdificio" placeholder="Selecciona una sede" variant="outlined" density="comfortable"
          rounded="lg" prepend-inner-icon="mdi-office-building-outline" :loading="loadingBuildings"
          @update:model-value="alCambiarEdificio"></v-select>

        <div class="text-subtitle-2 font-weight-bold mb-2 ml-1 mt-4 text-grey-darken-3">Sala</div>
        <v-select v-model="seleccion.salaId" :items="salas" item-title="nombreSala" item-value="codigoSala"
          placeholder="Selecciona un espacio" variant="outlined" density="comfortable" rounded="lg"
          prepend-inner-icon="mdi-door-open" :disabled="!seleccion.edificioId" :loading="loadingRooms">
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :subtitle="item.raw.codigoSala"></v-list-item>
          </template>
        </v-select>

        <v-btn block color="blue-darken-2" size="large" class="mt-8 text-none rounded-pill font-weight-bold"
          elevation="2" :disabled="!seleccion.edificioId || !seleccion.salaId" @click="irAlReporte">
          Visualizar Reporte
        </v-btn>
      </v-form>
    </v-card>

    <div class="text-center mt-6">
      <v-icon size="16" color="grey" class="mr-1">mdi-information-outline</v-icon>
      <span class="text-caption text-grey">
        Debes seleccionar una sala para habilitar la generación.
      </span>
    </div>

  </v-container>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useBuildingStore } from "@/stores/buildings"
import { useRoomStore } from "@/stores/rooms"
import { useUserStore } from "@/stores/users"

const router = useRouter()
const buildingStore = useBuildingStore()
const roomStore = useRoomStore()
const userStore = useUserStore()

// Extraemos los estados de los stores
const { edificios, loading: loadingBuildings } = storeToRefs(buildingStore)
const { salas, loading: loadingRooms } = storeToRefs(roomStore)

const formValido = ref(false)
const seleccion = reactive({
  edificioId: null,
  salaId: null
})

/**
 * Cuando cambia el edificio, cargamos las salas correspondientes
 */
const alCambiarEdificio = (id) => {
  seleccion.salaId = null; // Reiniciamos la sala seleccionada
  if (id) {
    roomStore.listarSalasPorEdificio({ id });
  }
}

/**
 * Navega a la vista final del reporte con los parámetros
 */
const irAlReporte = () => {
  router.push({
    name: 'reports',
    params: {
      buildingId: seleccion.edificioId,
      roomId: seleccion.salaId
    }
  })
}

onMounted(() => {
  const userId = userStore.usuario?.idUsuario;
  if (userId) {
    buildingStore.listarEdificiosPorUsuario({ id: userId });
  }
})
</script>

<style scoped>
/* [REGLA DE CONSISTENCIA]: Alineación visual */
.main-container {
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

/* === CLASE DE DISEÑO ESTÁNDAR POWERTECH === */
.standard-card {
  background-color: #f8f9fb !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
  transition: all 0.3s ease !important;
}

/* Sobrescribimos el hover para que la tarjeta no flote tanto en formularios */
.standard-card:hover {
  background-color: #f8f9fb !important;
  box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1) !important;
}
</style>