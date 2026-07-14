<template>
  <v-container class="mt-8 px-4 main-container" fluid>
    
    <div class="mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" color="blue-darken-2" @click="$router.back()"></v-btn>
      <span class="text-subtitle-1 font-weight-bold ml-2">Volver a edificios</span>      
      <h1 class="text-h4 font-weight-bold">Mis salas</h1>
      <p class="text-subtitle-2 text-grey-darken-1">Edificio: {{ $route.params.id }}</p>
    </div>

    <!-- Loading -->
    <v-row v-if="loading">
      <v-col cols="12" v-for="n in 3" :key="n">
        <v-skeleton-loader type="list-item-two-line" class="rounded-xl mb-3"></v-skeleton-loader>
      </v-col>
    </v-row>

    <!-- Si no hay salas-->
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
        class="room-card pa-4 rounded-xl mb-4 d-flex align-center justify-space-between" 
        elevation="0"
        hover
        @click="verDispositivos(item.codigoSala)"
      >
        <div class="d-flex align-center overflow-hidden">
          <!-- Icono -->
          <v-avatar color="blue-lighten-5" size="52" class="mr-4 flex-shrink-0">
            <v-icon color="blue-darken-2" size="28">mdi-door-open</v-icon>
          </v-avatar>
          <!-- Código -->
          <div class="overflow-hidden">
            <div class="text-overline font-weight-bold text-blue-darken-2" style="line-height: 1;">
              {{ item.codigoSala }}
            </div>
            <!-- Nombre -->
            <h3 class="text-subtitle-1 font-weight-bold text-truncate" style="color: #3b6fb6;">
              {{ item.nombreSala || 'Sala sin nombre' }}
            </h3>
          </div>
        </div>

        <div class="d-flex align-center">
          <!-- Botón de eliminar -->
          <v-btn 
            icon="mdi-delete-outline" 
            variant="text" 
            color="red-lighten-1"
            class="mr-1"
            @click.stop="confirmarEliminar(item.codigoSala)"
          ></v-btn>
          <v-btn icon="mdi-chevron-right" variant="text" color="grey-darken-1"></v-btn>
        </div>
      </v-card>
    </div>

    <div class="fab-container">
      <!-- Botón para agregar-->
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
        <!-- Título -->
        <v-card-title class="text-h5 font-weight-bold text-center" style="color: #3b6fb6;">
          Nueva Sala
        </v-card-title>
        
        <v-card-text>
          <v-form ref="formRef" v-model="formValido">
            <!-- Código -->
            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 text-grey-darken-2">Código de la Sala</div>
            <v-text-field
              v-model="nuevaSala.codigoSala"
              placeholder="Ej: SALA-01"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="reglas.codigo"
              required
            />

            <!-- Nombre -->
            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2 text-grey-darken-2">Nombre de la Sala</div>
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

        <!-- Botón Cancelar -->
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="black" @click="cerrarModal" class="text-none">Cancelar</v-btn>
          <!-- Botón Guardar -->
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
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRoomStore } from "@/stores/rooms"
import { useNotifyStore } from "@/stores/notify"

const router = useRouter();
const route = useRoute();
const roomStore = useRoomStore();
const notify = useNotifyStore();

const { salas, loading } = storeToRefs(roomStore);

const dialogoVisible = ref(false);
const formRef = ref(null);
const formValido = ref(false);

const nuevaSala = ref({
  codigoSala: '',
  nombreSala: '',
  codigoEdificio: route.params.id 
});

/* Validaciones */
const reglas = {
  codigo: [
    v => !!v || "El código es obligatorio",
    v => (v && v.length <= 10) || "Máximo 10 caracteres"
  ],
  nombre: [
    v => (!v || v.length <= 60) || "Máximo 60 caracteres"
  ]
};

const verDispositivos = (id) => {
  router.push({ name: 'devices', params: { id: id } });
};

const cerrarModal = () => {
  dialogoVisible.value = false;
  nuevaSala.value = { codigoSala: '', nombreSala: '', codigoEdificio: route.params.id };
  if (formRef.value) formRef.value.resetValidation();
};

const guardarSala = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  roomStore.agregarSala({
    datos: nuevaSala.value,
    onComplete: () => {
      notify.show("Sala registrada con éxito", "success");
      cerrarModal();
      roomStore.listarSalasPorEdificio({ id: route.params.id });
    },
    onError: (error) => {
      const msg = error.response?.data?.mensaje || "Error al registrar la sala";
      notify.show(msg, "error");
    }
  });
};

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
    roomStore.listarSalasPorEdificio({ id: buildingId });
  }
});
</script>

<style scoped>
/* [REGLA DE CONSISTENCIA]: Mantener max-width 520px para alineación visual */
.main-container {
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 120px;
}

/* [REGLA DE CONSISTENCIA]: Tarjetas con fondo #f8f9fb y animación táctil */
.room-card {
  transition: transform 0.2s ease, background-color 0.2s ease;
  background-color: #f8f9fb !important;
  border: none !important;
  cursor: pointer;
}

.room-card:hover {
  background-color: #f0f7ff !important;
  transform: translateY(-2px);
}

.room-card:active {
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