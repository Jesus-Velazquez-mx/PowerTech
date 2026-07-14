<template>
  <v-container class="mt-8 px-4 main-container" fluid>
    
    <div class="mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" color="blue-darken-2" @click="$router.back()"></v-btn>
      <span class="text-subtitle-1 font-weight-bold ml-2">Volver</span>
      <h1 class="text-h4 font-weight-bold">Mis Sensores</h1>
      <p class="text-subtitle-2 text-grey-darken-1">Vista global de tu hardware</p>
    </div>

    <!-- Loading -->
    <v-row v-if="loading">
      <v-col cols="6" v-for="n in 4" :key="n">
        <v-skeleton-loader type="card" class="rounded-xl"></v-skeleton-loader>
      </v-col>
    </v-row>

    <!-- Si no hay sensores -->
    <v-card 
      v-else-if="!sensores || sensores.length === 0"
      class="pa-8 text-center rounded-xl bg-transparent elevation-0 border-dashed w-100"
    >
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-access-point-network-off</v-icon>
      <div class="text-h6 text-grey-darken-2">No hay sensores</div>
      <div class="text-body-2 text-grey">Tus dispositivos aún no tienen sensores vinculados.</div>
    </v-card>

    <div v-else>
      <v-row>
        <!-- Tarjetas -->
        <v-col 
          v-for="item in sensores" 
          :key="item.codigoSensor"
          cols="6" 
        >
        <v-card 
            class="sensor-card pa-4 rounded-xl text-center h-100 d-flex flex-column align-center justify-center" 
            :class="item.activo ? 'bg-green-lighten-5' : 'bg-red-lighten-5'"
            elevation="0"
            @click="abrirModalDetalles(item)"
          >
          <!-- Botón de eliminar -->
          <v-btn
              icon="mdi-close-circle"
              variant="text"
              color="red-lighten-2"
              size="small"
              class="delete-btn"
              @click.stop="confirmarEliminar(item.codigoSensor)"
            ></v-btn>

            <!-- Avatar del sensor -->
            <v-avatar :color="item.activo ? 'green-lighten-4' : 'red-lighten-4'" size="56" class="mb-2">
              <v-icon size="28" :color="item.activo ? 'green-darken-3' : 'red-darken-3'">
                mdi-access-point
              </v-icon>
            </v-avatar>
            
            <!-- Código -->
            <div class="text-caption font-weight-bold text-uppercase" :class="item.activo ? 'text-green-darken-3' : 'text-red-darken-3'">
              {{ item.codigoSensor }}
            </div>
            <!-- Nombre -->
            <div class="text-subtitle-2 font-weight-bold text-grey-darken-3 text-truncate w-100 px-1" style="line-height: 1.2;">
              {{ item.nombreSensor }}
            </div>
            <!-- Tipo -->
            <div class="text-caption font-weight-bold text-grey-darken-1 text-truncate w-100 mt-1">
              {{ item.tipoSensor }}
            </div>
            <div class="text-caption text-grey-darken-1 text-truncate w-100 mb-2">
              <v-icon size="12" class="mr-1">mdi-devices</v-icon> {{ item.nombreDispositivo || item.codigoDispositivo }}
            </div>

            <!-- Switch de estado -->
            <v-switch
              v-model="item.activo"
              :true-value="1"
              :false-value="0"
              color="green-darken-3"
              hide-details
              density="compact"
              class="mt-auto"
              @click.stop
              @change="cambiarEstado(item)"
            ></v-switch>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Botón flotante para agregar -->
    <div class="fab-container">
      <v-btn color="blue-darken-2" icon="mdi-plus" size="large" elevation="4" @click="dialogoVisible = true"></v-btn>
    </div>

    <v-dialog v-model="dialogoVisible" max-width="500px" persistent>
      <v-card class="rounded-xl pa-4 elevation-12">
        <!-- Título -->
        <v-card-title class="text-h5 font-weight-bold text-center" style="color: #3b6fb6;">Nuevo Sensor</v-card-title>
        
        <v-card-text>
          <v-form ref="formRef" v-model="formValido">
            
            <!-- Código -->
            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2 text-grey-darken-2">Código del Sensor</div>
            <v-text-field v-model="nuevoSensor.codigoSensor" placeholder="Ej: SENS-01" variant="outlined" density="comfortable" rounded="lg" :rules="reglas.codigo" required />

            <!-- Dispositivo Vinculado -->
            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2 text-grey-darken-2">Dispositivo Vinculado</div>
            <v-select
              v-model="nuevoSensor.codigoDispositivo"
              :items="dispositivos"
              :item-title="item => item?.codigoDispositivo ? `${item.codigoDispositivo} - ${item.nombre}` : ''"
              item-value="codigoDispositivo"
              placeholder="Selecciona a qué equipo pertenece"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="[v => !!v || 'Debes seleccionar un dispositivo']"
              required
            >
            <!-- Si no hay dispositivos disponibles -->
              <template v-slot:no-data>
                <div class="pa-4 text-caption text-grey">No hay dispositivos registrados</div>
              </template>
            </v-select>

            <!-- Nombre -->
            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2 text-grey-darken-2">Nombre del Sensor</div>
            <v-text-field v-model="nuevoSensor.nombreSensor" placeholder="Ej: Sensor de Computadora" variant="outlined" density="comfortable" rounded="lg" :rules="reglas.nombre" required />

            <!-- Tipo y Unidad -->
            <v-row>
              <v-col cols="6">
                <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2 text-grey-darken-2">Tipo</div>
                <v-text-field v-model="nuevoSensor.tipoSensor" placeholder="Ej: De medida" variant="outlined" density="comfortable" rounded="lg" :rules="reglas.tipo" required />
              </v-col>
              <v-col cols="6">
                <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2 text-grey-darken-2">Unidad</div>
                <v-text-field v-model="nuevoSensor.unidadMedida" placeholder="Ej: W" variant="outlined" density="comfortable" rounded="lg" />
              </v-col>
            </v-row>

            <!-- Estado Inicial -->
            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-4 text-grey-darken-2">Estado Inicial</div>
            <v-switch v-model="nuevoSensor.activo" :label="nuevoSensor.activo ? 'Activado (Monitoreando)' : 'Desactivado (Apagado)'" color="green-darken-2" inset hide-details></v-switch>
          </v-form>
        </v-card-text>

        <!-- Botones -->
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="black" @click="cerrarModal" class="text-none">Cancelar</v-btn>
          <v-btn color="blue-darken-2" class="text-none rounded-pill px-6" variant="flat" :disabled="!formValido" :loading="loading" @click="guardarSensor">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de detalles -->
    <v-dialog v-model="dialogoDetallesVisible" max-width="500px">
      <v-card class="rounded-xl pa-4 elevation-12">
        <!-- Título -->
        <v-card-title class="text-h5 font-weight-bold text-center mb-2" style="color: #3b6fb6;">
          Detalles de Ubicación
        </v-card-title>
        
        <v-card-text class="pt-2" v-if="sensorSeleccionado">
          <div class="d-flex align-center mb-6">
            <v-avatar :color="sensorSeleccionado.activo ? 'green-lighten-4' : 'red-lighten-4'" size="56" class="mr-4">
              <v-icon size="28" :color="sensorSeleccionado.activo ? 'green-darken-3' : 'red-darken-3'">mdi-access-point</v-icon>
            </v-avatar>
            <div>
              <!-- Nombre -->
                <div class="text-subtitle-1 font-weight-bold text-grey-darken-3" style="line-height: 1.2;">
                {{ sensorSeleccionado.nombreSensor }}
              </div>
              <!-- Código y estado -->
              <div class="text-caption font-weight-bold" :class="sensorSeleccionado.activo ? 'text-green-darken-3' : 'text-red-darken-3'">
                {{ sensorSeleccionado.codigoSensor }} | {{ sensorSeleccionado.activo ? 'Activo' : 'Inactivo' }}
              </div>
            </div>
          </div>

          <v-divider class="mb-4"></v-divider>

          <div class="mb-4">
            <!-- Edificio -->
            <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">Edificio</div>
            <div class="text-body-1 font-weight-bold text-grey-darken-3 d-flex align-center">
              <v-icon size="20" color="blue-darken-2" class="mr-2">mdi-office-building</v-icon>
              {{ sensorSeleccionado.nombreEdificio || 'No especificado' }}
            </div>
          </div>

          <div class="mb-4">
            <!-- Sala -->
            <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">Sala</div>
            <div class="text-body-1 font-weight-bold text-grey-darken-3 d-flex align-center">
              <v-icon size="20" color="blue-darken-2" class="mr-2">mdi-door-open</v-icon>
              {{ sensorSeleccionado.nombreSala || 'No especificada' }}
            </div>
          </div>

          <div>
           <!-- Dispositivo -->
            <div class="text-caption font-weight-bold text-grey-darken-1 mb-1">Dispositivo Vinculado</div>
            <div class="text-body-1 font-weight-bold text-grey-darken-3 d-flex align-center">
              <v-icon size="20" color="blue-darken-2" class="mr-2">mdi-devices</v-icon>
              {{ sensorSeleccionado.nombreDispositivo || sensorSeleccionado.codigoDispositivo }}
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-2" class="text-none rounded-pill px-6" variant="flat" @click="dialogoDetallesVisible = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSensorStore } from "@/stores/sensors"
import { useDeviceStore } from "@/stores/devices"
import { useUserStore } from "@/stores/users"
import { useNotifyStore } from "@/stores/notify"

const sensorStore = useSensorStore();
const deviceStore = useDeviceStore();
const userStore = useUserStore();
const notify = useNotifyStore();

const { sensores, loading } = storeToRefs(sensorStore);
const { dispositivos } = storeToRefs(deviceStore);

const dialogoVisible = ref(false);
const formRef = ref(null);
const formValido = ref(false);

const dialogoDetallesVisible = ref(false);
const sensorSeleccionado = ref(null);

const nuevoSensor = ref({
  codigoSensor: '',
  codigoDispositivo: null,
  nombreSensor: '',
  tipoSensor: '',
  unidadMedida: '',
  activo: true 
});

const reglas = {
  codigo: [ v => !!v || "Obligatorio", v => (v && v.length <= 10) || "Máximo 10 caracteres" ],
  nombre: [ v => !!v || "Obligatorio", v => (v && v.length <= 80) || "Máximo 80 caracteres" ],
  tipo: [ v => !!v || "Obligatorio", v => (v && v.length <= 40) || "Máximo 40 caracteres" ]
};

const abrirModalDetalles = (sensor) => {
  sensorSeleccionado.value = sensor;
  dialogoDetallesVisible.value = true;
};

const cerrarModal = () => {
  dialogoVisible.value = false;
  nuevoSensor.value = { 
    codigoSensor: '', codigoDispositivo: null, nombreSensor: '', 
    tipoSensor: '', unidadMedida: '', activo: true
  };
  if (formRef.value) formRef.value.resetValidation();
};

const guardarSensor = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  const payload = {
    ...nuevoSensor.value,
    activo: nuevoSensor.value.activo ? 1 : 0
  };

  sensorStore.agregarSensor({
    datos: payload,
    onComplete: () => {
      notify.show("Sensor registrado", "success");
      cerrarModal();
      sensorStore.listarSensoresPorUsuario({ id: userStore.usuario.idUsuario });
    },
    onError: (error) => {
      const msg = error.response?.data?.mensaje || "Error al registrar";
      notify.show(msg, "error");
    }
  });
};

const confirmarEliminar = (id) => {
  if (confirm("¿Eliminar este sensor? Se borrarán sus lecturas y alarmas relacionadas.")) {
    sensorStore.eliminarSensor({
      id: id,
      onComplete: () => {
        notify.show("Sensor eliminado", "success");
        sensorStore.listarSensoresPorUsuario({ id: userStore.usuario.idUsuario });
      },
      onError: () => notify.show("Error al eliminar", "error")
    });
  }
};

const cambiarEstado = (sensor) => {
  sensorStore.actualizarEstadoSensor({
    id: sensor.codigoSensor,
    activo: sensor.activo,
    onComplete: () => notify.show("Estado actualizado", "success"),
    onError: () => notify.show("Error de conexión", "error")
  });
};

onMounted(() => {
  if (userStore.usuario?.idUsuario) {
    sensorStore.listarSensoresPorUsuario({ id: userStore.usuario.idUsuario });
    deviceStore.listarDispositivosPorUsuario({ id: userStore.usuario.idUsuario });
  }
});
</script>

<style scoped>
.main-container { max-width: 520px; margin-left: auto; margin-right: auto; padding-bottom: 120px; }
.sensor-card { aspect-ratio: 1 / 1.1; transition: transform 0.2s ease, filter 0.2s ease; border: none !important; position: relative; cursor: pointer; }
.sensor-card:hover { transform: translateY(-4px); filter: brightness(0.97); }
.delete-btn { position: absolute; top: 4px; right: 4px; z-index: 2; }
.fab-container { position: fixed; bottom: 84px; left: 50%; transform: translateX(-50%); z-index: 99; }
.border-dashed { border: 2px dashed rgba(0, 0, 0, 0.08) !important; }
</style>