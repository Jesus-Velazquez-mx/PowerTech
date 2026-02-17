<template>
  <v-container class="mt-8 px-4 main-container" fluid>
    
    <div class="mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" color="blue-darken-2" @click="$router.back()"></v-btn>
      <span class="text-subtitle-1 font-weight-bold ml-2">Volver a salas</span>     
      <h1 class="text-h4 font-weight-bold">Mis dispositivos</h1>
      <p class="text-subtitle-2 text-grey-darken-1">Sala: {{ $route.params.id }}</p>
    </div>

    <!-- Loading -->
    <v-row v-if="loading">
      <v-col cols="6" sm="4" v-for="n in 4" :key="n">
        <v-skeleton-loader type="card" class="rounded-xl"></v-skeleton-loader>
      </v-col>
    </v-row>

    <!-- Si no hay dispositivos -->
    <v-card 
      v-else-if="!dispositivos || dispositivos.length === 0"
      class="pa-8 text-center rounded-xl bg-transparent elevation-0 border-dashed w-100"
    >
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-devices</v-icon>
      <div class="text-h6 text-grey-darken-2">No hay equipos</div>
      <div class="text-body-2 text-grey">Aún no has registrado dispositivos en esta sala.</div>
    </v-card>

    <div v-else>
      <v-row>
        <v-col 
          v-for="item in dispositivos" 
          :key="item.codigoDispositivo"
          cols="6" 
          sm="4"
        >
          <v-card 
            class="device-card pa-4 rounded-xl text-center h-100 d-flex flex-column align-center justify-center" 
            elevation="0"
            hover
          >
          <!-- Botón Eliminar -->  
          <v-btn
              icon="mdi-close-circle"
              variant="text"
              color="red-lighten-2"
              size="small"
              class="delete-btn"
              @click.stop="confirmarEliminar(item.codigoDispositivo)"
            ></v-btn>

            <!-- Icono -->
            <v-avatar color="blue-lighten-5" size="64" class="mb-3">
              <v-icon size="32" color="blue-darken-2">
                {{ item.tipo === 'C' ? 'mdi-laptop' : 'mdi-air-conditioner' }}
              </v-icon>
            </v-avatar>
            
            <!-- Código -->
            <div class="text-caption font-weight-bold text-blue-darken-2 text-uppercase">
              {{ item.codigoDispositivo }}
            </div>
            <!-- Nombre -->
            <div class="text-subtitle-2 font-weight-bold text-grey-darken-2 text-truncate w-100 px-1">
              {{ item.nombre }}
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Botón Agregar -->
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
        <!-- Título -->
        <v-card-title class="text-h5 font-weight-bold text-center" style="color: #3b6fb6;">
          Nuevo Dispositivo
        </v-card-title>
        
        <v-card-text>
          <v-form ref="formRef" v-model="formValido">
            <!-- Tipo de dispositivo -->
            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 text-grey-darken-2">Tipo de Dispositivo</div>
            <v-select
              v-model="nuevoDispositivo.tipo"
              :items="categorias"
              item-title="text"
              item-value="value"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="[v => !!v || 'Selecciona una categoría']"
              required
            ></v-select>
            
            <!-- Código -->
            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2 text-grey-darken-2">Código</div>
            <v-text-field
              v-model="nuevoDispositivo.codigoDispositivo"
              placeholder="Ej: PC-01"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="reglas.codigo"
              required
            />

            <!-- Nombre -->
            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2 text-grey-darken-2">Nombre / Etiqueta</div>
            <v-text-field
              v-model="nuevoDispositivo.nombre"
              placeholder="Ej: Estación de trabajo 1"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="reglas.nombre"
              required
            />

            <template v-if="nuevoDispositivo.tipo === 'A'">
              <v-row>
                <v-col cols="6">
                  <!-- Unidad -->
                  <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2 text-grey-darken-2">Unidad</div>
                  <v-text-field
                    v-model="nuevoDispositivo.tipoUnidad"
                    placeholder="Minisplit"
                    variant="outlined"
                    density="comfortable"
                    rounded="lg"
                  />
                </v-col>
                <v-col cols="6">
                <!-- Seer -->
                  <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2 text-grey-darken-2">SEER</div>
                  <v-text-field
                    v-model="nuevoDispositivo.eficienciaSEER"
                    type="number"
                    variant="outlined"
                    density="comfortable"
                    rounded="lg"
                  />
                </v-col>
              </v-row>
            </template>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <!-- Botón Cancelar -->
          <v-btn variant="text" color="black" @click="cerrarModal" class="text-none">Cancelar</v-btn>
          <!-- Botón Guardar -->
          <v-btn 
            color="blue-darken-2" 
            class="text-none rounded-pill px-6" 
            variant="flat"
            :disabled="!formValido"
            :loading="loading"
            @click="guardarDispositivo"
          >
            Guardar
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
import { useDeviceStore } from "@/stores/devices"
import { useNotifyStore } from "@/stores/notify"

const route = useRoute();
const deviceStore = useDeviceStore();
const notify = useNotifyStore();

const { dispositivos, loading } = storeToRefs(deviceStore);

/* Estados para el Modal */
const dialogoVisible = ref(false);
const formRef = ref(null);
const formValido = ref(false);

const categorias = [
  { text: 'Computadora', value: 'C' },
  { text: 'Aire Acondicionado', value: 'A' }
];

const nuevoDispositivo = ref({
  codigoDispositivo: '',
  codigoSala: route.params.id,
  nombre: '',
  marca: '',
  tipo: 'C',
  tipoUnidad: '',
  eficienciaSEER: null
});

/* Validaciones */
const reglas = {
  codigo: [
    v => !!v || "Obligatorio",
    v => (v && v.length <= 10) || "Máximo 10 caracteres"
  ],
  nombre: [
    v => !!v || "Obligatorio",
    v => (v && v.length <= 100) || "Máximo 100 caracteres"
  ]
};

const cerrarModal = () => {
  dialogoVisible.value = false;
  nuevoDispositivo.value = { 
    codigoDispositivo: '', 
    codigoSala: route.params.id, 
    nombre: '', 
    marca: '', 
    tipo: 'C',
    tipoUnidad: '',
    eficienciaSEER: null
  };
  if (formRef.value) formRef.value.resetValidation();
};

const guardarDispositivo = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  deviceStore.agregarDispositivo({
    datos: nuevoDispositivo.value,
    onComplete: () => {
      notify.show("Dispositivo registrado", "success");
      cerrarModal();
      deviceStore.listarDispositivosPorSala({ id: route.params.id });
    },
    onError: (error) => {
      const msg = error.response?.data?.mensaje || "Error al registrar";
      notify.show(msg, "error");
    }
  });
};

const confirmarEliminar = (id) => {
  if (confirm("¿Eliminar este dispositivo? Se borrarán sus sensores y alarmas relacionadas.")) {
    deviceStore.eliminarDispositivo({
      id: id,
      onComplete: () => {
        notify.show("Dispositivo eliminado", "success");
        deviceStore.listarDispositivosPorSala({ id: route.params.id });
      },
      onError: () => notify.show("Error al eliminar", "error")
    });
  }
};

onMounted(() => {
  const salaId = route.params.id;
  if (salaId) {
    deviceStore.listarDispositivosPorSala({ id: salaId });
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
.device-card {
  aspect-ratio: 1 / 1;
  transition: transform 0.2s ease, background-color 0.2s ease;
  background-color: #f8f9fb !important;
  border: none !important;
  position: relative;
}

.device-card:hover {
  background-color: #f0f7ff !important;
  transform: translateY(-4px);
}

.device-card:active {
  transform: scale(0.96);
}

.delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 2;
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