<template>
  <v-container class="mt-8 px-4 main-container" fluid>
    <div class="text-center mb-10">
      <h1 class="text-h3 font-weight-bold mb-2" style="color: #3b6fb6;">Bienvenido</h1>
      <p class="text-subtitle-1 text-grey-darken-1">
        ¿Qué quieres hacer el día de hoy{{ nombreFormateado ? `, ${nombreFormateado}` : '' }}?
      </p>
    </div>

    <v-card class="pa-6 rounded-xl mb-6 d-flex align-center justify-space-between" elevation="1">
      <div>
        <div class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-1">Ahorro estimado hoy</div>
        <!-- El ahorro es reactivo, no fijo -->
        <div class="text-h4 font-weight-black text-green-accent-4">
          {{ ahorroPrediccion }}
        </div>
      </div>
      <v-avatar color="blue-lighten-5" size="64">
        <v-icon size="32" color="blue-darken-2">mdi-lightning-bolt-outline</v-icon>
      </v-avatar>
    </v-card>

    <v-row>
      <v-col cols="5">
        <!-- Reportes -->
        <v-card class="pa-4 rounded-xl mb-4 text-center d-flex flex-column align-center" elevation="1" ripple
          tag="router-link" :to="{ name: 'report-selection' }">
          <v-icon size="40" class="mb-2">mdi-file-document-outline</v-icon>
          <span class="text-caption font-weight-bold">Reportes</span>
        </v-card>

        <!-- Edificios -->
        <v-card class="pa-4 rounded-xl text-center d-flex flex-column align-center" elevation="1" ripple
          tag="router-link" :to="{ name: 'buildings' }">
          <v-icon size="40" class="mb-2">mdi-office-building-outline</v-icon>
          <span class="text-caption font-weight-bold">Mis edificios</span>
        </v-card>
      </v-col>

      <!-- Advertencias -->
      <v-col cols="7">
        <v-card class="pa-6 rounded-xl fill-height text-center d-flex flex-column align-center justify-center"
          elevation="1" ripple tag="router-link" :to="{ name: 'notifications' }">
          <div class="text-subtitle-1 font-weight-bold mb-4">Advertencias</div>

          <!-- Usamos alarmasActivas -->
          <v-icon size="60" :color="alarmasActivas.length > 0 ? 'red-darken-1' : 'grey-darken-1'" class="mb-4">
            {{ alarmasActivas.length > 0 ? 'mdi-alert-circle-outline' : 'mdi-thumb-up-outline' }}
          </v-icon>

          <div class="text-caption text-grey-darken-1">
            <template v-if="alarmasActivas.length > 0">
              Tienes <strong>{{ alarmasActivas.length }}</strong> alertas activas
            </template>
            <template v-else>
              Nada de que preocuparse por aquí
            </template>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia';
import { useUserStore } from "@/stores/users";
import { useAlarmStore } from '@/stores/alarms';

const userStore = useUserStore();
const alarmStore = useAlarmStore();

// Extraer alarmas de forma reactiva
const { alarmas } = storeToRefs(alarmStore);

// Filtramos únicamente las alarmas con estado 'ACTIVA'
const alarmasActivas = computed(() => {
  return alarmas.value?.filter(a => a.estado?.toUpperCase() === 'ACTIVA') || [];
});

const ahorro = ref(null);

// Cargar alarmas al iniciar para tener el conteo actualizado
onMounted(() => {
  const userId = userStore.usuario?.idUsuario;
  if (userId) {
    alarmStore.listarAlarmas({ id: userId });
  }
});

const nombreFormateado = computed(() => {
  const nombreCompleto = userStore.usuario?.nombre;
  if (!nombreCompleto) return "";
  const primerNombre = nombreCompleto.split(" ")[0];
  return primerNombre.charAt(0).toUpperCase() + primerNombre.slice(1).toLowerCase();
});

const ahorroPrediccion = computed(() => {
  return ahorro.value == null ? '- kWh' : `${ahorro.value} kWh`
});
</script>

<style scoped>
.main-container {
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

/* Efecto para las tarjetas */
.v-card {
  transition: transform 0.2s ease;
  box-shadow: none !important;
  border: none !important;
  background-color: #f8f9fb;
}

.v-card:active {
  transform: scale(0.98);
}
</style>