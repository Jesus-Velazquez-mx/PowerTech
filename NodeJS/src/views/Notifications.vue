<template>
  <v-container class="mt-8 px-4 main-container" fluid>
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold"">Notificaciones</h1>
      <p class="text-subtitle-2 text-grey-darken-1">Alertas de tus edificios</p>
    </div>

    <v-row v-if="loading">
      <v-col cols="12" v-for="n in 3" :key="n">
         <v-skeleton-loader type="list-item-avatar-three-line" class="rounded-xl mb-3"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-card 
      v-else-if="!alarmas || alarmas.length === 0"
      class="pa-8 text-center rounded-xl bg-transparent elevation-0 border-dashed"
    >
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-bell-sleep-outline</v-icon>
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
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/users';
import { useAlarmStore } from '@/stores/alarms';
import AlarmCard from '@/components/AlarmCard.vue'; // Importamos el componente hijo

const userStore = useUserStore();
const alarmStore = useAlarmStore();

// Usamos storeToRefs para mantener la reactividad de los datos y el loading
const { alarmas, loading } = storeToRefs(alarmStore);

onMounted(() => {
  // Obtenemos el ID del usuario logueado desde el store de usuarios
  const userId = userStore.usuario?.idUsuario;

  if (userId) {
    // Pedimos al store de notificaciones que traiga los datos
    alarmStore.listarAlarmas({ id: userId });
  } else {
    // Manejo opcional: redirigir al login si no hay usuario
    console.warn("No hay usuario logueado para cargar notificaciones");
  }
});
</script>

<style scoped>
/* Mantener este tamaño del contenedor en todas las pestañas que no sean el log in ni el sign up */
.main-container {
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

.notification-list {
    /* Asegura que el fondo transparente se mantenga si es necesario */
    background-color: transparent;
}

/* Borde punteado para el estado vacío */
.border-dashed {
    border: 2px dashed rgba(0, 0, 0, 0.1) !important;
}
</style>