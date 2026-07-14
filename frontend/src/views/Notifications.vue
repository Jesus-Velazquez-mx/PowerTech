<template>
  <v-container class="mt-8 px-4 main-container" fluid>
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold">Notificaciones</h1>
      <p class="text-subtitle-2 text-grey-darken-1">Alertas de tus edificios</p>
    </div>

    <v-row v-if="loading">
      <v-col cols="12" v-for="n in 3" :key="n">
         <v-skeleton-loader
           type="list-item-avatar-three-line"
           class="rounded-xl mb-3"
         ></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-card
      v-else-if="!alarmas || alarmas.length === 0"
      class="pa-8 text-center rounded-xl bg-transparent elevation-0 border-dashed"
    >
      <v-icon size="64" color="grey-lighten-1" class="mb-4">
        mdi-bell-sleep-outline
      </v-icon>
      <div class="text-h6 text-grey-darken-2">Sin novedades</div>
      <div class="text-body-2 text-grey">Todo parece estar en orden por ahora.</div>
    </v-card>

    <div v-else class="notification-list">
      <AlarmCard
        v-for="(alarma, index) in alarmas"
        :key="alarma.codigoAlarma || index"
        :alarma="alarma"
      />
    </div>
  </v-container>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/users';
import { useAlarmStore } from '@/stores/alarms';
import AlarmCard from '@/components/AlarmCard.vue';

const userStore = useUserStore();
const alarmStore = useAlarmStore();

// Extraemos las propiedades reactivas de los stores
const { usuario } = storeToRefs(userStore);
const { alarmas, loading } = storeToRefs(alarmStore);

/**
 * Función encargada de solicitar las alarmas al backend
 */
const cargarNotificaciones = () => {
  const userId = usuario.value?.idUsuario;

  if (userId) {
    alarmStore.listarAlarmas({ id: userId });
  } else {
    console.warn("Esperando datos del usuario o usuario no logueado...");
  }
};

// Intentar cargar al montar el componente
onMounted(() => {
  cargarNotificaciones();
});

/**
 * Observador (Watch): Si el usuario no estaba listo al montar,
 * cargamos las alarmas en cuanto el ID esté disponible.
 */
watch(() => usuario.value?.idUsuario, (newId) => {
  if (newId) {
    cargarNotificaciones();
  }
}, { immediate: true });
</script>

<style scoped>
/* Contenedor centrado para mantener consistencia visual */
.main-container {
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

.notification-list {
    background-color: transparent;
}

/* Borde punteado para el estado vacío (v-card) */
.border-dashed {
    border: 2px dashed rgba(0, 0, 0, 0.1) !important;
}
</style>