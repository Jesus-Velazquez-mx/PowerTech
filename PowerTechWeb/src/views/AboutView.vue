<template>
  <v-container class="px-4 py-12">
    
    <v-row justify="center" class="text-center mb-16">
      <v-col cols="12" md="8">
        <h2 v-scroll-animate class="text-h4 text-md-h3 font-weight-black text-gradient mb-4 custom-font before-enter-up">
          Conoce PowerTech
        </h2>
        <p v-scroll-animate class="text-h6 text-grey-darken-1 before-enter-up" style="line-height: 1.6;">
          Nacimos para transformar la manera en que las empresas consumen y entienden su energía.
        </p>
      </v-col>
    </v-row>

    <v-row align="center" justify="space-between" class="mb-16 pb-8">
      <v-col cols="12" md="5" class="order-2 order-md-1">
        <div v-scroll-animate class="before-enter-left">
          <v-chip color="red-darken-1" variant="tonal" class="mb-4 font-weight-bold" size="small">
            EL DESAFÍO
          </v-chip>
          <h3 class="text-h4 font-weight-bold mb-4 text-grey-darken-4 custom-font">
            Dejamos atrás la gestión reactiva.
          </h3>
          <p class="text-body-1 text-grey-darken-2" style="line-height: 1.7;">
            Actualmente, las pequeñas y medianas empresas gestionan el alto gasto eléctrico de forma reactiva y manual, basando sus decisiones únicamente en la revisión de la facturación mensual sin contar con mecanismos técnicos que permitan optimizar la operación.
          </p>
        </div>
      </v-col>
      <v-col cols="12" md="6" class="order-1 order-md-2 mb-6 mb-md-0 text-center">
        <div v-scroll-animate class="visual-block bg-red-lighten-5 rounded-circle d-flex justify-center align-center mx-auto before-enter-right">
          <v-icon color="red-darken-2" size="80" class="floating-icon">mdi-chart-timeline-variant-shimmer</v-icon>
        </div>
      </v-col>
    </v-row>

    <v-row align="center" justify="space-between" class="mb-16 pb-8">
      <v-col cols="12" md="6" class="mb-6 mb-md-0 text-center">
        <div v-scroll-animate class="visual-block bg-teal-lighten-5 rounded-circle d-flex justify-center align-center mx-auto before-enter-left">
          <v-icon color="teal-darken-2" size="80" class="floating-icon">mdi-shield-home-outline</v-icon>
        </div>
      </v-col>
      <v-col cols="12" md="5">
        <div v-scroll-animate class="before-enter-right">
          <v-chip color="teal-darken-1" variant="tonal" class="mb-4 font-weight-bold" size="small">
            NUESTRA SOLUCIÓN
          </v-chip>
          <h3 class="text-h4 font-weight-bold mb-4 text-grey-darken-4 custom-font">
            Visibilidad total en tiempo real.
          </h3>
          <p class="text-body-1 text-grey-darken-2" style="line-height: 1.7;">
            Proponemos un ecosistema de sensores inteligentes, dispositivos IoT y sistemas de automatización orientados al monitoreo. Nuestra meta es lograr una reducción de entre un 20% y un 30% en el consumo energético de los edificios comerciales, fortaleciendo la cultura de eficiencia.
          </p>
        </div>
      </v-col>
    </v-row>

    <v-row align="center" justify="space-between">
      <v-col cols="12" md="5" class="order-2 order-md-1">
        <div v-scroll-animate class="before-enter-left">
          <v-chip color="amber-darken-4" variant="tonal" class="mb-4 font-weight-bold" size="small">
            LA TECNOLOGÍA
          </v-chip>
          <h3 class="text-h4 font-weight-bold mb-4 text-grey-darken-4 custom-font">
            Accesible y escalable.
          </h3>
          <p class="text-body-1 text-grey-darken-2" style="line-height: 1.7;">
            Diseñamos PowerTech utilizando hardware abierto de bajo costo y el análisis de datos mediante tecnologías emergentes. De esta manera, respondemos a la necesidad de las PyMEs de contar con tecnología de vanguardia sin realizar inversiones prohibitivas.
          </p>
        </div>
      </v-col>
      <v-col cols="12" md="6" class="order-1 order-md-2 mb-6 mb-md-0 text-center">
        <div v-scroll-animate class="visual-block bg-amber-lighten-5 rounded-circle d-flex justify-center align-center mx-auto before-enter-right">
          <v-icon color="amber-darken-4" size="80" class="floating-icon">mdi-micro-sd</v-icon>
        </div>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
// DIRECTIVA DE ANIMACIÓN (Optimizada para múltiples direcciones)
const vScrollAnimate = {
  mounted: (el) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('enter-active');
          } else {
            el.classList.remove('enter-active');
          }
        });
      },
      {
        threshold: 0.15, 
        rootMargin: "0px 0px -50px 0px" 
      }
    );
    observer.observe(el);
  },
};
</script>

<style scoped>
/* =========================================
   ESTILOS DE TEXTO
========================================= */
.text-gradient {
  background: linear-gradient(135deg, #0D47A1 0%, #1976D2 50%, #42A5F5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: shine 5s linear infinite;
}

@keyframes shine {
  to { background-position: 200% center; }
}

/* =========================================
   BLOQUES VISUALES (Círculos con íconos)
========================================= */
.visual-block {
  width: 250px;
  height: 250px;
  position: relative;
  transition: transform 0.4s ease;
  /* Sombra suave con el color respectivo de cada bloque */
  box-shadow: 0 20px 40px rgba(0,0,0,0.05);
}

.visual-block:hover {
  transform: scale(1.05);
}

.floating-icon {
  animation: floatIcon 6s ease-in-out infinite;
}

@keyframes floatIcon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

/* =========================================
   ANIMACIONES ON SCROLL (Múltiples direcciones)
========================================= */

/* 1. Elementos que entran desde ABAJO (Para títulos) */
.before-enter-up {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

/* 2. Elementos que entran desde la IZQUIERDA */
.before-enter-left {
  opacity: 0;
  transform: translateX(-60px);
  transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

/* 3. Elementos que entran desde la DERECHA */
.before-enter-right {
  opacity: 0;
  transform: translateX(60px);
  transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

/* Estado Activo para TODOS */
.enter-active {
  opacity: 1 !important;
  transform: translate(0, 0) !important;
}

/* Orden responsive de columnas (Para móviles) */
@media (max-width: 959px) {
  .visual-block {
    width: 180px;
    height: 180px;
  }
}
</style>