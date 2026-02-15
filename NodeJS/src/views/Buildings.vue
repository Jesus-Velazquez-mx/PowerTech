<template>
  <v-container class="mt-8 px-4 main-container" fluid>
    <div class="text-center mb-10">
      <h1 class="text-h3 font-weight-bold mb-2" style="color: #3b6fb6;">Mis edificios</h1>
      <p class="text-subtitle-1 text-grey-darken-1">
        Bienvenido{{ nombreFormateado ? `, ${nombreFormateado}` : '' }}. Aquí puedes gestionar tus sedes.
      </p>    
    </div>

    <v-row v-if="loading">
      <v-col cols="12" v-for="n in 3" :key="n">
        <v-skeleton-loader type="list-item-two-line" class="rounded-xl mb-3"></v-skeleton-loader>
      </v-col>
    </v-row>

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
        class="building-card pa-5 rounded-xl mb-4 d-flex align-center justify-space-between" 
        elevation="1"
        hover
        @click="verSalas(item.codigoEdificio)"
      >
        <div class="d-flex align-center overflow-hidden">
          <v-avatar color="blue-lighten-5" size="56" class="mr-4 flex-shrink-0">
            <v-icon color="blue-darken-2">mdi-office-building</v-icon>
          </v-avatar>
          <div class="overflow-hidden">
            <div class="text-overline font-weight-bold text-blue-darken-2" style="line-height: 1;">
              {{ item.codigoEdificio }}
            </div>
            <h2 class="text-h6 font-weight-bold text-truncate">{{ item.nombreEdificio }}</h2>
            <div class="text-caption text-grey-darken-1 d-flex align-center">
              <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
              Horario: {{ formatearHora(item.horarioEntrada) }} - {{ formatearHora(item.horarioSalida) }}
            </div>
          </div>
        </div>

        <div class="d-flex align-center">
          <v-btn 
            icon="mdi-delete-outline" 
            variant="text" 
            color="red-lighten-1"
            class="mr-2"
            @click.stop="confirmarEliminar(item.codigoEdificio)"
          ></v-btn>
          <v-btn icon="mdi-chevron-right" variant="text" color="grey-darken-1"></v-btn>
        </div>
      </v-card>
    </div>

    <div class="fab-container">
      <v-btn
        color="blue-darken-2"
        icon="mdi-plus"
        size="large"
        elevation="4"
        @click="dialogoVisible = true"
      ></v-btn>
    </div>

    <v-dialog v-model="dialogoVisible" max-width="500px" persistent>
      <v-card class="rounded-xl pa-4">
        <v-card-title class="text-h5 font-weight-bold text-center" style="color: #3b6fb6;">
          Nuevo Edificio
        </v-card-title>
        
        <v-card-text>
          <v-form ref="formRef" v-model="formValido">
            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1">Código del Edificio</div>
            <v-text-field
              v-model="nuevoEdificio.codigoEdificio"
              placeholder="Ej: EDIF-01"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="reglas.codigo"
              required
            />

            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2">Nombre del Edificio</div>
            <v-text-field
              v-model="nuevoEdificio.nombreEdificio"
              placeholder="Nombre de la sede"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="reglas.nombre"
              required
            />

            <v-row>
              <v-col cols="6">
                <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2">Entrada</div>
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
              <v-col cols="6">
                <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2">Salida</div>
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
          <v-btn variant="text" color="grey" @click="cerrarModal" class="text-none">Cancelar</v-btn>
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
import { ref, computed, onMounted } from 'vue'
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

/* Estados para el Modal */
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

/* Reglas de validación */
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

/* Para formatear la hora */
const formatearHora = (hora) => {
  if (!hora) return "00:00";
  return hora.substring(0, 5); // Recorta HH:mm:ss a HH:mm
};

/* Para formatear el nombre de usuario (se quitará si se quita el mensaje de bienvenida) */
const nombreFormateado = computed(() => {
  const nombreCompleto = userStore.usuario?.nombre;
  if (!nombreCompleto) return "";
  const primerNombre = nombreCompleto.split(" ")[0];
  return primerNombre.charAt(0).toUpperCase() + primerNombre.slice(1).toLowerCase();
});

/* Función para navegar al listado de rooms */
const verSalas = (codigoEdificio) => {
  router.push({ name: 'rooms', params: { id: codigoEdificio } });
};

/* Para cerrar el modal */
const cerrarModal = () => {
  dialogoVisible.value = false;
  nuevoEdificio.value = { codigoEdificio: '', nombreEdificio: '', horarioEntrada: '', horarioSalida: '', idUsuario: null };
  if (formRef.value) formRef.value.resetValidation();
};

/* Para agrgar el edificio a la base de datos */
const guardarEdificio = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  // Asignamos el ID del usuario logueado antes de enviar
  nuevoEdificio.value.idUsuario = userStore.usuario.idUsuario;

  buildingStore.agregarEdificio({
    datos: nuevoEdificio.value,
    onComplete: (res) => {
      notify.show("Edificio registrado con éxito", "success");
      cerrarModal();
      // Recargamos la lista
      buildingStore.listarEdificiosPorUsuario({ id: userStore.usuario.idUsuario });
    },
    onError: (error) => {
      const msg = error.response?.data?.mensaje || "Error al registrar edificio";
      notify.show(msg, "error");
    }
  });
};

/* Para confirmar la eliminación antes de borrar */
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
.main-container {
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 120px;
}

.v-card {
  transition: transform 0.2s ease;
  box-shadow: none !important;
  border: none !important;
  background-color: #f8f9fb;
}

.fab-container {
  position: fixed;
  bottom: 84px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
}

.building-card {
  transition: all 0.3s ease !important;
  border: none !important;
  cursor: pointer;
}

.building-card:hover {
  background-color: #f0f7ff !important;
  transform: translateY(-2px);
}

.border-dashed {
  border: none !important;
}
</style>