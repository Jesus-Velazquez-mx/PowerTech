<template>
  <v-app class="bg-white pa-3">
    <Menu />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import Menu from './components/Menu.vue';
</script>

<style>
/* Importamos la fuente (ejemplo con Outfit que pusimos en el menú) */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&display=swap');

/* Le decimos a Vuetify que TODO use esa fuente */
.v-application {
  font-family: 'Outfit', sans-serif !important;
}

/* Aseguramos que los encabezados (h1, h2, etc.) también la respeten */
h1, h2, h3, h4, h5, h6,
.text-h1, .text-h2, .text-h3, .text-h4, .text-h5, .text-h6 {
  font-family: 'Outfit', sans-serif !important;
}
</style>