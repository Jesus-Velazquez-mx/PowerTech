<template>
    <v-container class="mt-8 px-4 main-container" fluid>

        <!-- Titulo -->
        <div class="mb-6">
            <v-btn icon="mdi-arrow-left" variant="text" color="blue-darken-2" @click="$router.back()"></v-btn>
            <span class="text-subtitle-1 font-weight-bold ml-2">Volver</span>
            <h1 class="text-h4 font-weight-bold">Todos los dispositivos</h1>
            <p class="text-subtitle-2 text-grey-darken-1">Vista global de hardware</p>
        </div>

        <!-- Loading -->
        <v-row v-if="loading">
            <v-col cols="6" sm="4" v-for="n in 4" :key="n">
                <v-skeleton-loader type="card" class="rounded-xl"></v-skeleton-loader>
            </v-col>
        </v-row>

        <!-- Placeholder por si no hay dispositivos -->
        <v-card v-else-if="!dispositivos || dispositivos.length === 0"
            class="pa-8 text-center rounded-xl bg-transparent elevation-0 border-dashed w-100">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-devices</v-icon>
            <div class="text-h6 text-grey-darken-2">No hay equipos</div>
            <div class="text-body-2 text-grey">Aún no has registrado dispositivos en ninguna sala.</div>
        </v-card>

        <div v-else>
            <v-row>
                <!-- Tarjetas de dispositivos -->
                <v-col v-for="item in dispositivos" :key="item.codigoDispositivo" cols="6" sm="4">
                    <v-card
                        class="device-card pa-4 rounded-xl text-center d-flex flex-column align-center justify-start"
                        elevation="0" hover @click="abrirModalDetalles(item)">

                        <!-- Botón de eliminar -->
                        <v-btn icon="mdi-close-circle" variant="text" color="red-lighten-2" size="small"
                            class="delete-btn" @click.stop="confirmarEliminar(item.codigoDispositivo)"></v-btn>

                        <!-- Icono general de dispositivo -->
                        <v-avatar :color="item.sensor ? 'blue-lighten-5' : 'grey-lighten-4'" size="56"
                            class="mb-2 mt-2">
                            <v-icon size="28"
                                :color="item.sensor ? 'blue-darken-2' : 'grey'">mdi-developer-board</v-icon>
                        </v-avatar>

                        <!-- Código -->
                        <div class="text-caption font-weight-bold text-blue-darken-2 text-uppercase mb-1">
                            {{ item.codigoDispositivo }}
                        </div>

                        <!-- Nombre del dispositivo -->
                        <div class="text-subtitle-2 font-weight-bold text-grey-darken-3 text-truncate w-100 px-1 mb-1"
                            style="line-height: 1.1;">
                            {{ item.nombre }}
                        </div>

                        <!-- Sensor vinculado (NUEVO) -->
                        <div class="text-caption text-truncate w-100 px-1 mb-2 font-weight-medium"
                            :class="item.sensor ? 'text-green-darken-3' : 'text-grey-darken-1'"
                            style="line-height: 1.1;">
                            <v-icon size="12" class="mr-1 pb-1">{{ item.sensor ? 'mdi-access-point' : 'mdi-link-off'
                                }}</v-icon>
                            {{ item.sensor ? item.sensor.nombreSensor : 'Sin sensor' }}
                        </div>

                        <v-spacer></v-spacer>

                        <!-- Ubicación (Edificio y Sala con truncado para evitar que se desborde) -->
                        <div class="text-caption text-grey-darken-1 w-100 mt-auto" style="line-height: 1.3;">
                            <div class="text-truncate w-100">
                                <v-icon size="14" class="mr-1 pb-1">mdi-domain</v-icon>{{ item.nombreEdificio }}
                            </div>
                            <div class="font-weight-bold text-truncate w-100">
                                {{ item.nombreSala }}
                            </div>
                        </div>

                    </v-card>
                </v-col>
            </v-row>
        </div>

        <!-- Botón flotante -->
        <div class="fab-container">
            <v-btn color="blue-darken-2" icon="mdi-plus" size="large" elevation="4"
                @click="dialogoVisible = true"></v-btn>
        </div>

        <!-- MODAL: AGREGAR NUEVO DISPOSITIVO -->
        <v-dialog v-model="dialogoVisible" max-width="500px" persistent>
            <v-card class="rounded-xl pa-4 elevation-12">
                <v-card-title class="text-h5 font-weight-bold text-center" style="color: #3b6fb6;">
                    Nuevo Equipo Global
                </v-card-title>

                <v-card-text>
                    <v-form ref="formRef" v-model="formValido">

                        <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2 text-grey-darken-2">Código del
                            Equipo</div>
                        <v-text-field v-model="nuevoDispositivo.codigoDispositivo" placeholder="Ej: EQ-01"
                            variant="outlined" density="comfortable" rounded="lg" :rules="reglas.codigo" required />

                        <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2 text-grey-darken-2">Nombre /
                            Etiqueta</div>
                        <v-text-field v-model="nuevoDispositivo.nombre" placeholder="Ej: Servidor Principal"
                            variant="outlined" density="comfortable" rounded="lg" :rules="reglas.nombre" required />

                        <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2 text-grey-darken-2">Código de Sala
                            Destino</div>
                        <v-text-field v-model="nuevoDispositivo.codigoSala" placeholder="Ej: SALA-01" variant="outlined"
                            density="comfortable" rounded="lg" :rules="[v => !!v || 'Debes especificar la sala']"
                            required />

                    </v-form>
                </v-card-text>

                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" color="black" @click="cerrarModal" class="text-none">Cancelar</v-btn>
                    <v-btn color="blue-darken-2" class="text-none rounded-pill px-6" variant="flat"
                        :disabled="!formValido" :loading="loading" @click="guardarDispositivo">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- MODAL: GESTIONAR DISPOSITIVO Y SENSOR -->
        <v-dialog v-model="dialogoDetallesVisible" max-width="500px">
            <v-card class="rounded-xl pa-4 elevation-12">
                <v-card-title class="text-h5 font-weight-bold text-center mb-2" style="color: #3b6fb6;">
                    Gestión del Equipo
                </v-card-title>

                <v-card-text class="pt-2" v-if="dispositivoSeleccionado">
                    <div class="d-flex align-center mb-6">
                        <v-avatar color="blue-lighten-5" size="56" class="mr-4">
                            <v-icon size="28" color="blue-darken-2">mdi-developer-board</v-icon>
                        </v-avatar>
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

                    <div class="text-subtitle-2 font-weight-bold mb-3 text-grey-darken-2">Reasignar Sensor Vinculado
                    </div>

                    <!-- Solo muestra sensores libres dentro de la misma sala -->
                    <v-select v-model="sensorTemporal" :items="opcionesSensoresDetalle" item-title="nombreSensor"
                        item-value="codigoSensor" placeholder="No hay sensor asignado" variant="outlined"
                        density="comfortable" rounded="lg" clearable></v-select>

                </v-card-text>

                <v-card-actions class="pa-4 pt-0">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" color="black" @click="dialogoDetallesVisible = false"
                        class="text-none">Cancelar</v-btn>
                    <v-btn color="blue-darken-2" class="text-none rounded-pill px-6" variant="flat"
                        @click="actualizarSensorDispositivo" :loading="loading">
                        Guardar Cambios
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDeviceStore } from "@/stores/devices"
import { useUserStore } from "@/stores/users"
import { useNotifyStore } from "@/stores/notify"

const deviceStore = useDeviceStore();
const userStore = useUserStore();
const notify = useNotifyStore();

const { dispositivos, loading } = storeToRefs(deviceStore);

/* Lista de sensores que no tienen ningún dispositivo asignado */
const sensoresDisponibles = ref([]);

/* Estados para el Modal Agregar */
const dialogoVisible = ref(false);
const formRef = ref(null);
const formValido = ref(false);

const nuevoDispositivo = ref({
    codigoDispositivo: '',
    codigoSala: '',
    nombre: '',
    marca: '',
    codigoSensor: null
});

/* Estados para el Modal Detalles (Reasignación) */
const dialogoDetallesVisible = ref(false);
const dispositivoSeleccionado = ref(null);
const sensorTemporal = ref(null);

/* Validaciones */
const reglas = {
    codigo: [v => !!v || "Obligatorio", v => (v && v.length <= 10) || "Máximo 10 caracteres"],
    nombre: [v => !!v || "Obligatorio", v => (v && v.length <= 100) || "Máximo 100 caracteres"]
};

const cargarSensoresLibres = async (codigoSala) => {
    try {
        const res = await deviceStore.obtenerSensoresLibres(codigoSala);
        sensoresDisponibles.value = res.data;
    } catch (error) {
        console.error("Error al cargar sensores libres", error);
    }
};

const opcionesSensoresDetalle = computed(() => {
    const opciones = [...sensoresDisponibles.value];
    if (dispositivoSeleccionado.value?.sensor) {
        opciones.push({
            codigoSensor: dispositivoSeleccionado.value.sensor.codigoSensor,
            nombreSensor: `(Actual) ${dispositivoSeleccionado.value.sensor.nombreSensor}`
        });
    }
    return opciones;
});

const abrirModalDetalles = (dispositivo) => {
    dispositivoSeleccionado.value = dispositivo;
    sensorTemporal.value = dispositivo.sensor ? dispositivo.sensor.codigoSensor : null;
    dialogoDetallesVisible.value = true;
    cargarSensoresLibres(dispositivo.codigoSala);
};

const cerrarModal = () => {
    dialogoVisible.value = false;
    nuevoDispositivo.value = { codigoDispositivo: '', codigoSala: '', nombre: '', marca: '', codigoSensor: null };
    if (formRef.value) formRef.value.resetValidation();
};

const cargarTodaLaLista = () => {
    if (userStore.usuario?.idUsuario) {
        deviceStore.listarDispositivosPorUsuario({ id: userStore.usuario.idUsuario });
    }
};

const guardarDispositivo = async () => {
    const { valid } = await formRef.value.validate();
    if (!valid) return;

    deviceStore.agregarDispositivo({
        datos: nuevoDispositivo.value,
        onComplete: () => {
            notify.show("Equipo registrado", "success");
            cerrarModal();
            cargarTodaLaLista();
        },
        onError: (error) => notify.show(error.response?.data?.mensaje || "Error al registrar", "error")
    });
};

const actualizarSensorDispositivo = async () => {
    deviceStore.asignarSensorADispositivo({
        codigoDispositivo: dispositivoSeleccionado.value.codigoDispositivo,
        codigoSensor: sensorTemporal.value,
        onComplete: () => {
            notify.show("Sensor actualizado", "success");
            dialogoDetallesVisible.value = false;
            cargarTodaLaLista();
        },
        onError: () => notify.show("Error al actualizar sensor", "error")
    });
};

const confirmarEliminar = (id) => {
    if (confirm("¿Eliminar este equipo? El sensor asociado quedará libre.")) {
        deviceStore.eliminarDispositivo({
            id: id,
            onComplete: () => {
                notify.show("Equipo eliminado", "success");
                cargarTodaLaLista();
            },
            onError: () => notify.show("Error al eliminar", "error")
        });
    }
};

onMounted(() => {
    cargarTodaLaLista();
});
</script>

<style scoped>
.main-container {
    max-width: 520px;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 120px;
}

.device-card {
    /* Ajustamos el min-height ligeramente para compensar la línea nueva */
    min-height: 215px;
    height: 100%;
    transition: transform 0.2s ease, background-color 0.2s ease;
    background-color: #f8f9fb !important;
    border: none !important;
    position: relative;
    cursor: pointer;
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