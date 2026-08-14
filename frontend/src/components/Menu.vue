<template>
  <div class="menu-wrap">
    <v-bottom-navigation class="menu-bar" :elevation="2" height="56">

      <v-btn to="/" exact>
        <v-icon>mdi-home-outline</v-icon>
      </v-btn>

      <v-btn to="/notifications">
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>

      <v-btn to="/monitoring">
        <v-icon>mdi-laptop</v-icon>
      </v-btn>

      <v-btn to="/all-devices">
        <v-icon>mdi-devices</v-icon>
      </v-btn>

      <v-btn to="/sensors">
        <v-icon>mdi-access-point</v-icon>
      </v-btn>

      <v-btn to="/others">
        <v-icon>mdi-dots-grid</v-icon>
      </v-btn>

      <template v-if="!userStore.usuario">
        <v-btn to="/login">
          <v-icon>mdi-login</v-icon>
          <span class="text-caption font-weight-bold">Entrar</span>
        </v-btn>

        <v-btn to="/signup">
          <v-icon>mdi-account-plus-outline</v-icon>
          <span class="text-caption font-weight-bold">Registro</span>
        </v-btn>
      </template>

      <v-btn v-else @click="cerrarSesion" color="red-darken-1">
        <v-icon>mdi-logout</v-icon>
        <span class="text-caption font-weight-bold">Salir</span>
      </v-btn>

    </v-bottom-navigation>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/users';
const userStore = useUserStore();

const cerrarSesion = () => {
  // Limpiamos el estado y el localStorage físicamente
  userStore.logout();

  // Hard reset para limpiar la RAM por completo
  window.location.href = '/login';
};
</script>

<style scoped>
/* Contenedor fijo abajo */
.menu-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 14px;
  display: flex;
  justify-content: center;
  z-index: 1000;
  /* Para que el menú quede arriba del todo*/
}

/* Barra redondeada tipo */
.menu-bar {
  width: min(520px, calc(100% - 24px));
  border-radius: 9999px;
  overflow: hidden;
  background: white;
}

/* Separa un poquito los botones y los centra */
.menu-bar :deep(.v-btn) {
  /* :deep permite aplicar estilos CSS a elementos internos de componentes Vue, incluso cuando se usan estilos scoped */
  min-width: 0;
}

/* “tap” más cómodo en móvil */
.menu-bar :deep(.v-btn__content) {
  padding: 0 18px;
}
</style>