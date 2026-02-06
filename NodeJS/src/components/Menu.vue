<template>
  <div class="menu-wrap">
    <!-- Bottom-navigation es un componente preconstruido para hacer un menú inferior con botones-->
    <v-bottom-navigation
      class="menu-bar"
      :elevation="2"
      height="56"
    >

    <!-- Cada botón lleva un icono. "to" sirve para el router-->
      <v-btn to="/" exact>
        <v-icon>mdi-home-outline</v-icon>
      </v-btn>

      <v-btn to="/notificaciones">
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>

      <v-btn to="/mensajes">
        <v-icon>mdi-email-outline</v-icon>
      </v-btn>

      <v-btn to="/apps">
        <v-icon>mdi-dots-grid</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<style scoped>
/* Contenedor fijo abajo */
.menu-wrap{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 14px;
  display: flex;
  justify-content: center;
  z-index: 1000; /* Para que el menú quede arriba del todo*/
}

/* Barra redondeada tipo */
.menu-bar{
  width: min(520px, calc(100% - 24px));
  border-radius: 9999px;
  overflow: hidden;
  background: white;
}

/* Separa un poquito los botones y los centra */
.menu-bar :deep(.v-btn){ 
  /* :deep permite aplicar estilos CSS a elementos internos de componentes Vue, incluso cuando se usan estilos scoped */
  min-width: 0;
}

/* opcional: “tap” más cómodo en móvil */
.menu-bar :deep(.v-btn__content){
  padding: 0 18px;
}
</style>
