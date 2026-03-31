<template>
  <main>
    <section id="inicio" class="seccion-pantalla">
      <v-container class="fill-height d-flex flex-column justify-center align-center text-center">
        <h1 class="text-h3 font-weight-black mb-6 text-blue-darken-2">
          Bienvenido a PowerTech
        </h1>
        <p class="text-h6 text-grey-darken-1 mb-10" style="max-width: 600px;">
          Explora nuestras soluciones tecnológicas para potenciar tu negocio.
        </p>
        <div class="d-flex justify-center flex-wrap ga-4">
          <v-btn color="blue-darken-2" @click="hacerScroll('nosotros')" size="large" class="text-none font-weight-bold rounded-pill" elevation="2">Conócenos</v-btn>
          <v-btn color="blue-grey-darken-3" @click="hacerScroll('foda')" size="large" class="text-none font-weight-bold rounded-pill" elevation="2">Análisis FODA</v-btn>
          <v-btn color="green-darken-2" @click="hacerScroll('costos')" size="large" class="text-none font-weight-bold rounded-pill" elevation="2">Costos</v-btn>
          <v-btn color="orange-darken-3" @click="hacerScroll('contacto')" size="large" class="text-none font-weight-bold rounded-pill" elevation="2">Contáctanos</v-btn>
        </div>
      </v-container>
    </section>

    <section id="nosotros" class="seccion-pantalla bg-grey-lighten-4">
      <AboutView />
    </section>

    <section id="foda" class="seccion-pantalla bg-white">
      <FODAView />
    </section>

    <section id="costos" class="seccion-pantalla bg-grey-lighten-4">
      <CostsView />
    </section>

    <section id="contacto" class="seccion-pantalla bg-white">
      <ContactView />
    </section>
  </main>
</template>

<script setup>
// Importamos los componentes de las otras vistas
import AboutView from '@/views/AboutView.vue';
import FODAView from '@/views/FODAView.vue';
import CostsView from '@/views/CostsView.vue';
import ContactView from '@/views/ContactView.vue';

// Función para el scroll suave de los botones centrales
const hacerScroll = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};
</script>

<style scoped>
.seccion-pantalla {
  min-height: 100vh; /* Garantiza que cada sección ocupe toda la pantalla */
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 64px 0; /* Espacio extra arriba para que la barra del menú no tape el título */
}
</style>