<template>
  <v-container class="mt-8 px-4 main-container" fluid>
    
    <div class="mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" color="blue-darken-2" @click="$router.back()"></v-btn>
      <span class="text-subtitle-1 font-weight-bold ml-2">Regresar</span>   
      <h1 class="text-h4 font-weight-bold">Mis edificios</h1>
      <p class="text-subtitle-2 text-grey-darken-1">Gestiona tus sedes</p>
    </div>


    <!-- Loading -->
    <v-row v-if="loading">
      <v-col cols="12" v-for="n in 3" :key="n">
        <v-skeleton-loader type="list-item-two-line" class="rounded-xl mb-3"></v-skeleton-loader>
      </v-col>
    </v-row>

    <!-- Si no hay edificios -->
    <v-card 
      v-else-if="!edificios || edificios.length === 0"
      class="pa-8 text-center rounded-xl bg-transparent elevation-0 border-dashed"
    >
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-office-building-marker-outline</v-icon>
      <div class="text-h6 text-grey-darken-2">No hay edificios</div>
      <div class="text-body-2 text-grey">Aún no has registrado ninguna propiedad en tu cuenta.</div>
    </v-card>

    <div v-else>
      <v-card 
        v-for="item in edificios" 
        :key="item.codigoEdificio"
        class="building-card pa-4 rounded-xl mb-4 d-flex align-center justify-space-between" 
        elevation="0"
        hover
        @click="verSalas(item.codigoEdificio)"
      >
        <div class="d-flex align-center overflow-hidden">
          <!-- Icono-->
          <v-avatar color="blue-lighten-5" size="52" class="mr-4 flex-shrink-0">
            <v-icon color="blue-darken-2" size="28">mdi-office-building</v-icon>
          </v-avatar>

          <!-- Codigo -->
          <div class="overflow-hidden">
            <div class="text-overline font-weight-bold text-blue-darken-2" style="line-height: 1;">
              {{ item.codigoEdificio }}
            </div>
          <!-- Nombre -->
            <h3 class="text-subtitle-1 font-weight-bold text-truncate" style="color: #3b6fb6;">
              {{ item.nombreEdificio }}
            </h3>
            <!-- Horario y Fecha -->
            <div class="text-caption text-grey-darken-1 d-flex align-center">
              <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
              Horario: {{ formatearHora(item.horarioEntrada) }} - {{ formatearHora(item.horarioSalida) }}
            </div>
          </div>
        </div>

        <!-- Eliminar -->
        <div class="d-flex align-center">
          <v-btn 
            icon="mdi-delete-outline" 
            variant="text" 
            color="red-lighten-1"
            class="mr-1"
            @click.stop="confirmarEliminar(item.codigoEdificio)"
          ></v-btn>
          <v-btn icon="mdi-chevron-right" variant="text" color="grey-darken-1"></v-btn>
        </div>
      </v-card>
    </div>

    <!-- Botón para agregar -->
    <div class="fab-container">
      <v-btn
        color="blue-darken-2"
        icon="mdi-plus"
        size="large"
        elevation="4"
        @click="dialogoVisible = true"
      ></v-btn>
    </div>

    <!-- Modal -->
    <v-dialog v-model="dialogoVisible" max-width="500px" persistent>
      <v-card class="rounded-xl pa-4 elevation-12">
        <!-- Titulo -->
        <v-card-title class="text-h5 font-weight-bold text-center" style="color: #3b6fb6;">
          Nuevo Edificio
        </v-card-title>
        
        <v-card-text>
          <!-- Código -->
          <v-form ref="formRef" v-model="formValido">
            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 text-grey-darken-2">Código del Edificio</div>
            <v-text-field
              v-model="nuevoEdificio.codigoEdificio"
              placeholder="Ej: EDIF-01"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="reglas.codigo"
              required
            />

            <!-- Nombre -->
            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2 text-grey-darken-2">Nombre del Edificio</div>
            <v-text-field
              v-model="nuevoEdificio.nombreEdificio"
              placeholder="Nombre de la sede"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="reglas.nombre"
              required
            />

            <!-- Hora de entrada -->
            <v-row>
              <v-col cols="6">
                <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2 text-grey-darken-2">Entrada</div>
                <v-text-field
                  v-model="nuevoEdificio.horarioEntrada"
                  type="time"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :rules="reglas.entrada"
                  required
                />
              </v-col>

              <!-- Hora de salida -->
              <v-col cols="6">
                <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2 text-grey-darken-2">Salida</div>
                <v-text-field
                  v-model="nuevoEdificio.horarioSalida"
                  type="time"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :rules="reglas.salida"
                  required
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <!-- Botón cancelar -->
          <v-btn variant="text" color="black" @click="cerrarModal" class="text-none">Cancelar</v-btn>
          <!-- Botón guardar -->
          <v-btn 
            color="blue-darken-2" 
            class="text-none rounded-pill px-6" 
            variant="flat"
            :disabled="!formValido"
            :loading="loading"
            @click="guardarEdificio"
          >
            Guardar Edificio
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia';
import { useUserStore } from "@/stores/users";
import { useBuildingStore } from "@/stores/buildings";
import { useNotifyStore } from "@/stores/notify";

const router = useRouter();
const userStore = useUserStore();
const buildingStore = useBuildingStore();
const notify = useNotifyStore();

const { edificios, loading } = storeToRefs(buildingStore);

const dialogoVisible = ref(false);
const formRef = ref(null);
const formValido = ref(false);

const nuevoEdificio = ref({
  codigoEdificio: '',
  nombreEdificio: '',
  horarioEntrada: '',
  horarioSalida: '',
  idUsuario: null
});

/* Validaciones */
const reglas = {
  codigo: [
    v => !!v || "El código es obligatorio",
    v => (v && v.length <= 10) || "Máximo 10 caracteres"
  ],
  nombre: [
    v => !!v || "El nombre es obligatorio",
    v => (v && v.length <= 120) || "Máximo 120 caracteres"
  ],
  entrada: [v => !!v || "Obligatorio"],
  salida: [
    v => !!v || "Obligatorio",
    v => (v > nuevoEdificio.value.horarioEntrada) || "Debe ser después de la entrada"
  ]
};

/* Formatear hora */
const formatearHora = (hora) => {
  if (!hora) return "00:00";
  return hora.substring(0, 5);
};

const verSalas = (codigoEdificio) => {
  router.push({ name: 'rooms', params: { id: codigoEdificio } });
};

const cerrarModal = () => {
  dialogoVisible.value = false;
  nuevoEdificio.value = { codigoEdificio: '', nombreEdificio: '', horarioEntrada: '', horarioSalida: '', idUsuario: null };
  if (formRef.value) formRef.value.resetValidation();
};

const guardarEdificio = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  nuevoEdificio.value.idUsuario = userStore.usuario.idUsuario;

  buildingStore.agregarEdificio({
    datos: nuevoEdificio.value,
    onComplete: (res) => {
      notify.show("Edificio registrado con éxito", "success");
      cerrarModal();
      buildingStore.listarEdificiosPorUsuario({ id: userStore.usuario.idUsuario });
    },
    onError: (error) => {
      const msg = error.response?.data?.mensaje || "Error al registrar edificio";
      notify.show(msg, "error");
    }
  });
};

const confirmarEliminar = (id) => {
  if (confirm("¿Estás seguro de eliminar este edificio? Se borrarán todas sus salas, dispositivos y alarmas relacionadas.")) {
    buildingStore.eliminarEdificio({
      id: id,
      onComplete: () => {
        notify.show("Edificio eliminado con éxito", "success");
        buildingStore.listarEdificiosPorUsuario({ id: userStore.usuario.idUsuario });
      },
      onError: (error) => {
        const msg = error.response?.data?.mensaje || "Error al eliminar el edificio";
        notify.show(msg, "error");
      }
    });
  }
};

onMounted(() => {
  const userId = userStore.usuario?.idUsuario;
  if (userId) {
    buildingStore.listarEdificiosPorUsuario({ id: userId });
  }
});
</script>

<style scoped>
/* [REGLA DE CONSISTENCIA]: Mantener max-width 520px para alineación visual centralizada */
.main-container {
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 120px;
}

/* [REGLA DE CONSISTENCIA]: Tarjetas con fondo #f8f9fb y transición de escala al presionar */
.building-card {
  transition: transform 0.2s ease, background-color 0.2s ease;
  background-color: #f8f9fb !important;
  border: none !important;
  cursor: pointer;
}

.building-card:hover {
  background-color: #f0f7ff !important;
  transform: translateY(-2px);
}

.building-card:active {
  transform: scale(0.98);
}

.fab-container {
  position: fixed;
  bottom: 84px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
}

.border-dashed {
    border: 2px dashed rgba(0, 0, 0, 0.08) !important;
}
</style>