<template>
  <main>
    <section id="inicio" class="seccion-pantalla hero-bg position-relative overflow-hidden">
      
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      
      <v-container class="fill-height d-flex flex-column justify-center align-center text-center z-index-1">
        
        <div v-scroll-animate class="mt-4 mb-8 position-relative logo-container anim-delay-1">
          <div class="logo-glow-behind"></div>
          
          <div class="text-center position-relative z-index-2">
            <div class="rainbow-border-static">
              <v-avatar color="white" size="90" class="elevation-3 logo-avatar-fixed">
                <v-icon size="45" color="blue-darken-2">mdi-flash</v-icon>
              </v-avatar>
            </div>
            
            <h1 class="text-h3 font-weight-black mt-4" style="color: #3b6fb6; letter-spacing: -1px;">
              PowerTech
            </h1>
          </div>
        </div>

        <div v-scroll-animate class="anim-delay-2">
          <v-chip color="blue-darken-2" variant="flat" class="mb-6 font-weight-bold text-uppercase px-4 py-5 elevation-2" size="large">
            <v-icon start icon="mdi-leaf" size="24"></v-icon>
            Eficiencia Energética IoT
          </v-chip>
        </div>

        <h1 v-scroll-animate class="text-h3 text-md-h2 font-weight-black mb-4 text-gradient anim-delay-3" style="line-height: 1.2;">
          El Control de tu Energía,<br>en Tiempo Real.
        </h1>
        
        <p v-scroll-animate class="text-h6 text-grey-darken-2 mb-8 anim-delay-4" style="max-width: 850px; line-height: 1.6;">
          PowerTech propone una solución accesible basada en sensores inteligentes, dispositivos IoT y automatización para monitorear y optimizar el uso de la electricidad en tiempo real. Implementar estas tecnologías puede reducir entre un 20% y un 30% el consumo en edificios comerciales.
        </p>
        
        <div v-scroll-animate class="d-flex justify-center flex-wrap ga-4 anim-delay-5">
          <v-btn color="blue-darken-2" @click="hacerScroll('nosotros')" size="x-large" class="text-none font-weight-bold rounded-pill shadow-blue" elevation="4" prepend-icon="mdi-rocket-launch">
            Descubre Cómo
          </v-btn>
          <v-btn color="white" @click="hacerScroll('costos')" size="x-large" variant="flat" class="text-none font-weight-bold rounded-pill text-blue-darken-3 border-blue" elevation="0" prepend-icon="mdi-currency-usd">
            Calcula tus Costos
          </v-btn>
        </div>

        <v-row v-scroll-animate class="mt-12 w-100 px-2 anim-delay-6" justify="center">
          <v-col cols="12" md="4">
            <v-card class="glass-card pa-6 text-left rounded-xl h-100" elevation="0">
              <v-avatar color="red-lighten-4" size="56" class="mb-4"><v-icon color="red-darken-2" size="32">mdi-alert-circle-outline</v-icon></v-avatar>
              <h3 class="text-h6 font-weight-bold mb-2 text-grey-darken-4 custom-font">El Problema Actual</h3>
              <p class="text-body-2 text-grey-darken-2">
                Las PyMEs enfrentan un alto consumo eléctrico por la operación de climatización e iluminación sin mecanismos de monitoreo. La falta de medición impide identificar desperdicios.
              </p>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-card class="glass-card pa-6 text-left rounded-xl h-100" elevation="0">
              <v-avatar color="blue-lighten-4" size="56" class="mb-4"><v-icon color="blue-darken-2" size="32">mdi-memory</v-icon></v-avatar>
              <h3 class="text-h6 font-weight-bold mb-2 text-grey-darken-4 custom-font">Hardware Abierto</h3>
              <p class="text-body-2 text-grey-darken-2">
                Utilizamos componentes de hardware abierto y software libre, garantizando alta escalabilidad sin necesidad de licencias costosas.
              </p>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="glass-card pa-6 text-left rounded-xl h-100" elevation="0">
              <v-avatar color="green-lighten-4" size="56" class="mb-4"><v-icon color="green-darken-2" size="32">mdi-eye-check-outline</v-icon></v-avatar>
              <h3 class="text-h6 font-weight-bold mb-2 text-grey-darken-4 custom-font">Visibilidad Total</h3>
              <p class="text-body-2 text-grey-darken-2">
                Buscamos transformar la percepción de la electricidad de un gasto fijo a un recurso gestionable con herramientas personalizadas.
              </p>
            </v-card>
          </v-col>
        </v-row>

      </v-container>
    </section>

    <section id="nosotros" class="seccion-pantalla bg-grey-lighten-4 overflow-hidden">
      <div v-scroll-animate class="w-100 h-100 d-flex align-center">
        <AboutView />
      </div>
    </section>

    <section id="foda" class="seccion-pantalla bg-white overflow-hidden">
      <div v-scroll-animate class="w-100 h-100 d-flex align-center">
        <FODAView />
      </div>
    </section>

    <section id="costos" class="seccion-pantalla bg-grey-lighten-4 overflow-hidden">
      <div v-scroll-animate class="w-100 h-100 d-flex align-center">
        <CostsView />
      </div>
    </section>

    <section id="contacto" class="seccion-pantalla bg-white overflow-hidden">
      <div v-scroll-animate class="w-100 h-100 d-flex align-center">
        <ContactView />
      </div>
    </section>
  </main>
</template>

<script setup>
import AboutView from '@/views/AboutView.vue';
import FODAView from '@/views/FODAView.vue';
import CostsView from '@/views/CostsView.vue';
import ContactView from '@/views/ContactView.vue';

const vScrollAnimate = {
  mounted: (el) => {
    el.classList.add('before-enter');
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
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
  },
};

const hacerScroll = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};
</script>

<style scoped>
/* ESTRUCTURA */
.seccion-pantalla { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 80px 0; position: relative; }
.z-index-1 { z-index: 1; position: relative; }
.z-index-2 { z-index: 2; position: relative; }

.text-gradient {
  background: linear-gradient(135deg, #0D47A1 0%, #1976D2 50%, #42A5F5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: shine 5s linear infinite;
}

.hero-bg { background-color: #f8fbff; }
.border-blue { border: 2px solid #1976D2 !important; }
.shadow-blue { box-shadow: 0 8px 20px rgba(25, 118, 210, 0.3) !important; }

.glass-card {
  background: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.glass-card:hover { transform: translateY(-8px); box-shadow: 0 15px 35px rgba(25, 118, 210, 0.1) !important; }

/* BLOBS */
.blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.5; z-index: 0; animation: float 10s ease-in-out infinite; }
.blob-1 { top: -10%; left: -10%; width: 500px; height: 500px; background: #bbdefb; }
.blob-2 { bottom: -10%; right: -5%; width: 600px; height: 600px; background: #e3f2fd; animation-delay: -5s; }

/* LOGO CONTAINER */
.logo-container { animation: floatLogo 6s ease-in-out infinite; display: inline-block; padding: 10px; }

/* 🌈 BORDE ARCOÍRIS: SOLO LOS COLORES GIRAN */
.rainbow-border-static {
  position: relative;
  display: inline-flex;
  padding: 5px; /* Grosor del borde */
  border-radius: 50%;
  overflow: hidden; /* Mantiene el giro dentro del círculo */
}

.rainbow-border-static::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  /* Gradiente arcoíris */
  background: conic-gradient(
    #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff, #ff0000
  );
  animation: spinBorder 4s linear infinite; /* Gira el fondo */
  z-index: 1;
}

.logo-avatar-fixed {
  position: relative;
  z-index: 2; /* Se coloca sobre el fondo giratorio */
}

/* RESPLANDOR Y ANIMACIONES */
.logo-glow-behind {
  position: absolute; top: 20%; left: 50%; transform: translate(-50%, -50%);
  width: 140px; height: 140px;
  background: radial-gradient(circle, rgba(100, 181, 246, 0.4) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%; z-index: 1; animation: pulseGlow 4s ease-in-out infinite;
}

@keyframes spinBorder { 
  0% { transform: rotate(0deg); } 
  100% { transform: rotate(360deg); } 
}

@keyframes floatLogo { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
@keyframes pulseGlow { 0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.9); } 50% { opacity: 1; transform: translate(-50%, -50%) scale(1.4); } }
@keyframes shine { to { background-position: 200% center; } }
@keyframes float { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-30px) scale(1.05); } }

/* ON SCROLL */
.before-enter { opacity: 0; transform: translateY(60px); transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1); }
.enter-active { opacity: 1 !important; transform: translateY(0) !important; }
.anim-delay-1 { transition-delay: 0.1s; } .anim-delay-2 { transition-delay: 0.2s; } .anim-delay-3 { transition-delay: 0.3s; }
.anim-delay-4 { transition-delay: 0.4s; } .anim-delay-5 { transition-delay: 0.5s; } .anim-delay-6 { transition-delay: 0.6s; }
</style>