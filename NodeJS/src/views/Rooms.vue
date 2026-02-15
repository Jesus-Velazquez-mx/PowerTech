<template>
  <v-container class="mt-8 px-4 main-container" fluid>
    <div class="text-center mb-10">
      <div class="d-flex align-center mb-4">
        <v-btn icon="mdi-arrow-left" variant="text" color="blue-darken-2" @click="$router.back()"></v-btn>
        <span class="text-subtitle-1 font-weight-bold ml-2">Volver a edificios</span>
      </div>
      
      <h1 class="text-h3 font-weight-bold mb-2" style="color: #3b6fb6;">Salas</h1>
      <p class="text-subtitle-1 text-grey-darken-1">
        Gestionando salas para el edificio: <span class="font-weight-bold">{{ $route.params.id }}</span>
      </p>    
    </div>

    <v-row v-if="loading">
      <v-col cols="12" v-for="n in 3" :key="n">
        <v-skeleton-loader type="list-item-two-line" class="rounded-xl mb-3"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-card 
      v-else-if="!salas || salas.length === 0"
      class="pa-8 text-center rounded-xl bg-transparent elevation-0 border-dashed"
    >
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-door-closed-lock</v-icon>
      <div class="text-h6 text-grey-darken-2">No hay salas</div>
      <div class="text-body-2 text-grey">Aún no has registrado ninguna sala en este edificio.</div>
    </v-card>

    <div v-else>
      <v-card 
        v-for="item in salas" 
        :key="item.codigoSala"
        class="room-card pa-5 rounded-xl mb-4 d-flex align-center justify-space-between" 
        elevation="1"
        hover
      >
        <div class="d-flex align-center overflow-hidden">
          <v-avatar color="blue-lighten-5" size="56" class="mr-4 flex-shrink-0">
            <v-icon color="blue-darken-2">mdi-door-open</v-icon>
          </v-avatar>
          <div class="overflow-hidden">
            <div class="text-overline font-weight-bold text-blue-darken-2" style="line-height: 1;">
              {{ item.codigoSala }}
            </div>
            <h2 class="text-h6 font-weight-bold text-truncate">{{ item.nombreSala || 'Sala sin nombre' }}</h2>
          </div>
        </div>

        <div class="d-flex align-center">
          <v-btn 
            icon="mdi-delete-outline" 
            variant="text" 
            color="red-lighten-1"
            class="mr-2"
            @click.stop="confirmarEliminar(item.codigoSala)"
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
          Nueva Sala
        </v-card-title>
        
        <v-card-text>
          <v-form ref="formRef" v-model="formValido">
            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1">Código de la Sala</div>
            <v-text-field
              v-model="nuevaSala.codigoSala"
              placeholder="Ej: SALA-01"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="reglas.codigo"
              required
            />

            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2">Nombre de la Sala</div>
            <v-text-field
              v-model="nuevaSala.nombreSala"
              placeholder="Ej: Sala de Juntas"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="reglas.nombre"
            />
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
            @click="guardarSala"
          >
            Guardar Sala
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRoomStore } from "@/stores/rooms"
import { useNotifyStore } from "@/stores/notify"

const route = useRoute();
const roomStore = useRoomStore();
const notify = useNotifyStore();

const { salas, loading } = storeToRefs(roomStore);

/* Estados para el Modal */
const dialogoVisible = ref(false);
const formRef = ref(null);
const formValido = ref(false);

const nuevaSala = ref({
  codigoSala: '',
  nombreSala: '',
  codigoEdificio: route.params.id // Se asigna automáticamente del parámetro de la URL
});

/* Reglas de validación (basadas en el backend) */
const reglas = {
  codigo: [
    v => !!v || "El código es obligatorio",
    v => (v && v.length <= 10) || "Máximo 10 caracteres"
  ],
  nombre: [
    v => (!v || v.length <= 60) || "Máximo 60 caracteres"
  ]
};

/* Para cerrar el modal */
const cerrarModal = () => {
  dialogoVisible.value = false;
  nuevaSala.value = { codigoSala: '', nombreSala: '', codigoEdificio: route.params.id };
  if (formRef.value) formRef.value.resetValidation();
};

/* Para agregar la sala a la base de datos */
const guardarSala = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  roomStore.agregarSala({
    datos: nuevaSala.value,
    onComplete: () => {
      notify.show("Sala registrada con éxito", "success");
      cerrarModal();
      // Recargamos la lista filtrada por el edificio actual
      roomStore.listarSalasPorEdificio({ id: route.params.id });
    },
    onError: (error) => {
      const msg = error.response?.data?.mensaje || "Error al registrar la sala";
      notify.show(msg, "error");
    }
  });
};

/* Para confirmar la eliminación antes de borrar */
const confirmarEliminar = (id) => {
  if (confirm("¿Estás seguro de eliminar esta sala? Se borrarán todos sus dispositivos y alarmas relacionadas.")) {
    roomStore.eliminarSala({
      id: id,
      onComplete: () => {
        notify.show("Sala eliminada con éxito", "success");
        roomStore.listarSalasPorEdificio({ id: route.params.id });
      },
      onError: (error) => {
        const msg = error.response?.data?.mensaje || "Error al eliminar la sala";
        notify.show(msg, "error");
      }
    });
  }
};

onMounted(() => {
  const buildingId = route.params.id;
  if (buildingId) {
    // Pedimos al store que traiga las salas de este edificio específico
    roomStore.listarSalasPorEdificio({ id: buildingId });
  }
});
</script>

<style scoped>
/* Estilos idénticos a Buildings.vue para mantener el estándar visual */
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

.room-card {
  transition: all 0.3s ease !important;
  border: none !important;
}

.room-card:hover {
  background-color: #f0f7ff !important;
  transform: translateY(-2px);
}

.border-dashed {
  border: none !important;
}
</style>