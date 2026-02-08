<template>
  <v-container class="mt-8 px-4 main-container" fluid>
    <div class="text-center mb-10">
      <h1 class="text-h3 font-weight-bold mb-2" style="color: #3b6fb6;">Otros</h1>
      <p class="text-subtitle-1 text-grey-darken-1">
        Test para otros. Usuario logueado: {{ nombreFormateado ? ` ${nombreFormateado}` : '' }}
      </p>    
    </div>

    <v-card class="pa-6 rounded-xl mb-6 d-flex align-center justify-space-between" elevation="1">
      <div>
        <div class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-1">Test de la pestaña "Otros"</div>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from "@/stores/users";

const userStore = useUserStore();
const ahorro = ref(null);

  // Propiedad computada para formatear el nombre del usuario
const nombreFormateado = computed(() => {
  // Obtenemos el nombre desde el objeto usuario en el store
  const nombreCompleto = userStore.usuario?.nombre;
  
  if (!nombreCompleto) return "";
  // Solamente el primer nombre
  const primerNombre = nombreCompleto.split(" ")[0];
  // Primera en Mayúscula, el resto en minúsculas
  return primerNombre.charAt(0).toUpperCase() + primerNombre.slice(1).toLowerCase();
});

const ahorroPrediccion = computed(() => {
  return ahorro.value == null ? '- kWh' : `${ahorro.value} kWh`
});
</script>

<style scoped>
/* Mantener este tamaño del contenedor en todas las pestañas que no sean el log in ni el sign up */
.main-container {
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;

}

/* Efecto para las tarjetas */
.v-card {
  transition: transform 0.2s ease;
  border: 1px solid rgba(0,0,0,0.05) !important;
}

.v-card:active {
  transform: scale(0.98);
}
</style>