<template>
  <v-container class="px-4 py-12">
    
    <v-row justify="center" class="text-center mb-10">
      <v-col cols="12" md="8">
        <h2 v-scroll-animate class="text-h4 text-md-h3 font-weight-black text-gradient mb-4 custom-font before-enter-scale">
          Análisis Estratégico
        </h2>
        <p v-scroll-animate class="text-h6 text-grey-darken-1 before-enter-scale delay-1" style="line-height: 1.6;">
          Conoce nuestra posición frente al mercado y los retos tecnológicos mediante nuestra matriz FODA.
        </p>
      </v-col>
    </v-row>

    <v-row justify="center">
      
      <v-col cols="12" md="6" lg="5">
        <v-card v-scroll-animate class="foda-card card-blue h-100 pa-6 rounded-xl before-enter-scale delay-2" elevation="0">
          <div class="d-flex align-center mb-4">
            <v-avatar color="blue-darken-2" size="48" class="mr-4 elevation-2">
              <v-icon color="white">mdi-arm-flex</v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-black text-blue-darken-3 custom-font">Fortalezas</h3>
          </div>
          <ul class="custom-list list-blue">
            <li><v-icon size="small" class="list-icon">mdi-check-circle</v-icon> Bajo costo de implementación.</li>
            <li><v-icon size="small" class="list-icon">mdi-check-circle</v-icon> Soberanía tecnológica.</li>
            <li><v-icon size="small" class="list-icon">mdi-check-circle</v-icon> Instalación no invasiva.</li>
            <li><v-icon size="small" class="list-icon">mdi-check-circle</v-icon> Arquitectura modular.</li>
            <li><v-icon size="small" class="list-icon">mdi-check-circle</v-icon> Infraestructura ya existente.</li>
          </ul>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="5">
        <v-card v-scroll-animate class="foda-card card-purple h-100 pa-6 rounded-xl before-enter-scale delay-3" elevation="0">
          <div class="d-flex align-center mb-4">
            <v-avatar color="deep-purple-darken-1" size="48" class="mr-4 elevation-2">
              <v-icon color="white">mdi-lightbulb-on</v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-black text-deep-purple-darken-2 custom-font">Oportunidades</h3>
          </div>
          <ul class="custom-list list-purple">
            <li><v-icon size="small" class="list-icon">mdi-arrow-up-circle</v-icon> Nichos de mercado desatendidos.</li>
            <li><v-icon size="small" class="list-icon">mdi-arrow-up-circle</v-icon> Tendencias globales de sostenibilidad.</li>
            <li><v-icon size="small" class="list-icon">mdi-arrow-up-circle</v-icon> Falta de competencia local.</li>
            <li><v-icon size="small" class="list-icon">mdi-arrow-up-circle</v-icon> Monetización por ahorro, ideal para presupuestos reducidos.</li>
          </ul>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="5">
        <v-card v-scroll-animate class="foda-card card-brown h-100 pa-6 rounded-xl before-enter-scale delay-4" elevation="0">
          <div class="d-flex align-center mb-4">
            <v-avatar color="brown-darken-1" size="48" class="mr-4 elevation-2">
              <v-icon color="white">mdi-trending-down</v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-black text-brown-darken-2 custom-font">Debilidades</h3>
          </div>
          <ul class="custom-list list-brown">
            <li><v-icon size="small" class="list-icon">mdi-minus-circle</v-icon> Dependencia de la infraestructura Wi-Fi.</li>
            <li><v-icon size="small" class="list-icon">mdi-minus-circle</v-icon> Factor humano crítico.</li>
            <li><v-icon size="small" class="list-icon">mdi-minus-circle</v-icon> Limitaciones de procesamiento.</li>
            <li><v-icon size="small" class="list-icon">mdi-minus-circle</v-icon> Posibles fallas por factores ambientales o externos.</li>
          </ul>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="5">
        <v-card v-scroll-animate class="foda-card card-red h-100 pa-6 rounded-xl before-enter-scale delay-5" elevation="0">
          <div class="d-flex align-center mb-4">
            <v-avatar color="red-darken-1" size="48" class="mr-4 elevation-2">
              <v-icon color="white">mdi-shield-alert</v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-black text-red-darken-2 custom-font">Amenazas</h3>
          </div>
          <ul class="custom-list list-red">
            <li><v-icon size="small" class="list-icon">mdi-alert-circle</v-icon> Las restricciones presupuestales y políticas de las instituciones.</li>
            <li><v-icon size="small" class="list-icon">mdi-alert-circle</v-icon> Competencia industrial/robusta.</li>
            <li><v-icon size="small" class="list-icon">mdi-alert-circle</v-icon> Inestabilidad de precios.</li>
            <li><v-icon size="small" class="list-icon">mdi-alert-circle</v-icon> Rápido avance del IoT que exige actualizaciones constantes.</li>
          </ul>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup>
// DIRECTIVA DE ANIMACIÓN (Permite la repetición al hacer scroll)
const vScrollAnimate = {
  mounted: (el) => {
    el.classList.add('before-enter-scale');
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
   TEXTOS Y COLORES GLOBALES
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
   ESTILOS DE LAS TARJETAS (Bento Box)
========================================= */
.foda-card {
  border-width: 2px !important;
  border-style: solid !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
}

.foda-card:hover {
  transform: translateY(-5px) scale(1.02);
}

/* Colores dinámicos para los bordes y sombras de cada tarjeta */
.card-blue {
  border-color: #E3F2FD !important;
  box-shadow: 0 10px 30px rgba(25, 118, 210, 0.08) !important;
}
.card-blue:hover { border-color: #1976D2 !important; box-shadow: 0 15px 40px rgba(25, 118, 210, 0.15) !important; }

.card-purple {
  border-color: #EDE7F6 !important;
  box-shadow: 0 10px 30px rgba(94, 53, 177, 0.08) !important;
}
.card-purple:hover { border-color: #5E35B1 !important; box-shadow: 0 15px 40px rgba(94, 53, 177, 0.15) !important; }

.card-brown {
  border-color: #EFEBE9 !important;
  box-shadow: 0 10px 30px rgba(109, 76, 65, 0.08) !important;
}
.card-brown:hover { border-color: #6D4C41 !important; box-shadow: 0 15px 40px rgba(109, 76, 65, 0.15) !important; }

.card-red {
  border-color: #FFEBEE !important;
  box-shadow: 0 10px 30px rgba(229, 57, 53, 0.08) !important;
}
.card-red:hover { border-color: #E53935 !important; box-shadow: 0 15px 40px rgba(229, 57, 53, 0.15) !important; }


/* =========================================
   LISTAS PERSONALIZADAS
========================================= */
.custom-list {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
}

.custom-list li {
  font-size: 1rem;
  color: #424242; /* grey-darken-3 */
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  line-height: 1.5;
}

.list-icon {
  margin-right: 12px;
  margin-top: 2px;
}

/* Colorear los íconos de las listas según la tarjeta */
.list-blue .list-icon { color: #1976D2; }
.list-purple .list-icon { color: #5E35B1; }
.list-brown .list-icon { color: #6D4C41; }
.list-red .list-icon { color: #E53935; }


/* =========================================
    ANIMACIONES ON SCROLL (Efecto ZOOM / ESCALA)
========================================= */
.before-enter-scale {
  opacity: 0;
  transform: scale(0.85) translateY(30px); /* Empieza un poco más chiquito y abajo */
  transition: opacity 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
              transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.enter-active {
  opacity: 1 !important;
  transform: scale(1) translateY(0) !important;
}

/* Efecto en cascada para que las tarjetas no salgan todas al mismo tiempo */
.delay-1 { transition-delay: 0.1s; }
.delay-2 { transition-delay: 0.2s; }
.delay-3 { transition-delay: 0.3s; }
.delay-4 { transition-delay: 0.4s; }
.delay-5 { transition-delay: 0.5s; }
</style>