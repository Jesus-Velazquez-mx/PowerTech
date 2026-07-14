<template>
  <v-container class="mt-8 px-4 main-container" fluid>
    
    <!-- Titulo -->
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

    <!-- Placeholder por si no hay dispositivos -->
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
        <!-- Tarjetas de dispositivos -->
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
            @click="abrirModalDetalles(item)"
          >
          <!-- Botón de eliminar -->
          <v-btn
              icon="mdi-close-circle"
              variant="text"
              color="red-lighten-2"
              size="small"
              class="delete-btn"
              @click.stop="confirmarEliminar(item.codigoDispositivo)"
            ></v-btn>

            <!-- Icono representativo del tipo de dispositivo -->
            <v-avatar color="blue-lighten-5" size="64" class="mb-3">
              <v-icon size="32" color="blue-darken-2">
                {{ item.tipo === 'C' ? 'mdi-laptop' : 'mdi-air-conditioner' }}
              </v-icon>
            </v-avatar>
            
            <!-- Código y nombre del dispositivo -->
            <div class="text-caption font-weight-bold text-blue-darken-2 text-uppercase">
              {{ item.codigoDispositivo }}
            </div>
            <div class="text-subtitle-2 font-weight-bold text-grey-darken-2 text-truncate w-100 px-1">
              {{ item.nombre }}
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div class="fab-container">
      <!-- Botón flotante para agregar nuevo dispositivo -->
      <v-btn
        color="blue-darken-2"
        icon="mdi-plus"
        size="large"
        elevation="4"
        @click="dialogoVisible = true"
      ></v-btn>
    </div>

    <!-- Modal para agregar nuevo dispositivo -->
    <v-dialog v-model="dialogoVisible" max-width="500px" persistent>
      <v-card class="rounded-xl pa-4 elevation-12">
        <!-- Titulo -->
        <v-card-title class="text-h5 font-weight-bold text-center" style="color: #3b6fb6;">
          Nuevo Dispositivo
        </v-card-title>
        
        <v-card-text>
          <v-form ref="formRef" v-model="formValido">
            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 text-grey-darken-2">Tipo de Dispositivo</div>
            <!-- Seleccionar tipo de dispositivo-->
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
            
            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2 text-grey-darken-2">Código</div>
            <!-- Codigo -->
            <v-text-field
              v-model="nuevoDispositivo.codigoDispositivo"
              placeholder="Ej: PC-01"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="reglas.codigo"
              required
            />

            <!-- Nombre-->
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
                  <!-- Tipo de unidad (ej: Minisplit, Ventana, etc) -->
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
                  <!-- Eficiencia SEER -->
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
          <!-- Botón para cancelar -->
          <v-btn variant="text" color="black" @click="cerrarModal" class="text-none">Cancelar</v-btn>
          <!-- Botón para guardar nuevo dispositivo -->
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

    <v-dialog v-model="dialogoDetallesVisible" max-width="500px">
      <!-- Modal para mostrar detalles del dispositivo seleccionado -->
      <v-card class="rounded-xl pa-4 elevation-12">
        <!-- Titulo -->
        <v-card-title class="text-h5 font-weight-bold text-center mb-2" style="color: #3b6fb6;">
          Detalles del Equipo
        </v-card-title>
        
        <v-card-text class="pt-2" v-if="dispositivoSeleccionado">
          <div class="d-flex align-center mb-6">
            <!-- Icono representativo del tipo de dispositivo -->
            <v-avatar color="blue-lighten-5" size="56" class="mr-4">
              <v-icon size="28" color="blue-darken-2">
                {{ dispositivoSeleccionado.tipo === 'C' ? 'mdi-laptop' : 'mdi-air-conditioner' }}
              </v-icon>
            </v-avatar>
            <!-- Código y nombre del dispositivo -->
            <div>
              <div class="text-subtitle-1 font-weight-bold text-grey-darken-3" style="line-height: 1.2;">
                {{ dispositivoSeleccionado.nombre }}
              </div>
              <div class="text-caption font-weight-bold text-blue-darken-2 mt-1">
                {{ dispositivoSeleccionado.codigoDispositivo }}
              </div>
            </div>
          </div>

          <v-divider class="mb-4"></v-divider>

          <div class="text-subtitle-2 font-weight-bold mb-3 text-grey-darken-2">Sensores y Lecturas</div>
          
          <!-- Si no hay sensores vinculados al dispositivo -->
          <div v-if="!dispositivoSeleccionado.sensores || dispositivoSeleccionado.sensores.length === 0" class="text-center pa-4 text-grey">
            <v-icon size="32" class="mb-2">mdi-leak-off</v-icon>
            <div class="text-caption">No hay sensores vinculados</div>
          </div>
          
          <div v-else>
            <!-- Listado de sensores con su última lectura -->
            <v-card 
              v-for="sensor in dispositivoSeleccionado.sensores" 
              :key="sensor.codigoSensor"
              class="mb-3 pa-3 rounded-lg"
              style="background-color: #f8f9fb; border: 1px solid rgba(0,0,0,0.05);"
              elevation="0"
            >
              <div class="d-flex justify-space-between align-center mb-1">
                <!-- Nombre del sensor con icono -->
                <span class="text-body-2 font-weight-bold text-grey-darken-3">
                  <v-icon size="16" color="grey-darken-1" class="mr-1">mdi-access-point</v-icon>
                  {{ sensor.nombreSensor }}
                </span>
                
                <!-- Última lectura del sensor -->
                <span v-if="sensor.ultimaLectura" class="text-subtitle-1 font-weight-black text-green-accent-4">
                  {{ Number(sensor.ultimaLectura.valor).toFixed(1) }} {{ sensor.unidadMedida }}
                </span>
                <span v-else class="text-caption text-grey">Sin datos</span>
              </div>
              
              <!-- Fecha de la última lectura -->
              <div class="text-caption text-grey-darken-1 mt-1 text-right">
                <v-icon size="12" class="mr-1">mdi-clock-outline</v-icon>
                {{ formatearFecha(sensor.ultimaLectura?.fechaHora) }}
              </div>
            </v-card>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn 
            color="blue-darken-2" 
            class="text-none rounded-pill px-6" 
            variant="flat"
            @click="dialogoDetallesVisible = false"
          >
            Cerrar
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

/* Estados para el Modal de Detalles */
const dialogoDetallesVisible = ref(false);
const dispositivoSeleccionado = ref(null);

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

/* Formateador de fechas para las lecturas */
const formatearFecha = (fechaISO) => {
  if (!fechaISO) return "Esperando registro...";
  const opciones = { 
    day: '2-digit', month: 'short', 
    hour: '2-digit', minute: '2-digit' 
  };
  return new Date(fechaISO).toLocaleDateString('es-MX', opciones);
};

/* Función para abrir detalles */
const abrirModalDetalles = (dispositivo) => {
  dispositivoSeleccionado.value = dispositivo;
  dialogoDetallesVisible.value = true;
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
  cursor: pointer; /* Añadido para que al pasar el mouse indique que se puede dar clic */
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