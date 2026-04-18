<template>
  <v-container class="px-4 py-12">
    
    <v-row justify="center" class="text-center mb-10">
      <v-col cols="12" md="8">
        <h2 v-scroll-animate class="text-h4 text-md-h3 font-weight-black text-gradient mb-4 custom-font before-enter-fade">
          Cotizador Inteligente
        </h2>
        <p v-scroll-animate class="text-h6 text-grey-darken-1 before-enter-fade delay-1" style="line-height: 1.6;">
          Calcula la inversión necesaria para implementar PowerTech. Modifica los parámetros y descubre lo accesible que es transformar tu institución.
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" align="stretch">
      
      <v-col cols="12" md="5" class="mb-6 mb-md-0">
        <v-card v-scroll-animate class="h-100 pa-8 rounded-xl controls-card before-enter-slide-left delay-2" elevation="0">
          <h3 class="text-h5 font-weight-bold mb-8 text-blue-darken-3 custom-font">Parámetros de Instalación</h3>
          
          <div class="mb-8">
            <div class="d-flex justify-space-between align-center mb-2">
              <span class="text-subtitle-1 font-weight-bold text-grey-darken-3">Número de Edificios</span>
              <v-chip color="blue-darken-2" variant="flat" size="large" class="font-weight-bold">{{ numEdificios }}</v-chip>
            </div>
            <v-slider
              v-model="numEdificios"
              :min="1"
              :max="35"
              :step="1"
              color="blue-darken-2"
              track-color="blue-lighten-4"
              hide-details
              class="mt-2"
            ></v-slider>
            <p class="text-caption text-grey-darken-1 mt-2">
              <v-icon size="x-small" color="grey" class="mr-1">mdi-server-network</v-icon>
              1 Servidor Central (Raspberry Pi) por edificio.
            </p>
          </div>

          <div class="mb-8">
            <div class="d-flex justify-space-between align-center mb-2">
              <span class="text-subtitle-1 font-weight-bold text-grey-darken-3">Salas Totales</span>
              <v-chip color="teal-darken-2" variant="flat" size="large" class="font-weight-bold">{{ numSalones }}</v-chip>
            </div>
            <v-slider
              v-model="numSalones"
              :min="1"
              :max="300"
              :step="1"
              color="teal-darken-2"
              track-color="teal-lighten-4"
              hide-details
              class="mt-2"
            ></v-slider>
            <p class="text-caption text-grey-darken-1 mt-2">
              <v-icon size="x-small" color="grey" class="mr-1">mdi-google-classroom</v-icon>
              1 ESP32 y sensores ambientales por sala.
            </p>
          </div>

          <v-divider class="mb-6 opacity-20"></v-divider>

          <div class="mb-8">
            <div class="d-flex justify-space-between align-center mb-2">
              <span class="text-subtitle-1 font-weight-bold text-grey-darken-3">Aires Acondicionados (por sala)</span>
              <v-chip color="cyan-darken-2" variant="flat" size="large" class="font-weight-bold">{{ numAires }}</v-chip>
            </div>
            <v-slider
              v-model="numAires"
              :min="0"
              :max="5"
              :step="1"
              color="cyan-darken-2"
              track-color="cyan-lighten-4"
              hide-details
              class="mt-2"
            ></v-slider>
          </div>

          <div>
            <div class="d-flex justify-space-between align-center mb-2">
              <span class="text-subtitle-1 font-weight-bold text-grey-darken-3">Computadoras (por sala)</span>
              <v-chip color="orange-darken-2" variant="flat" size="large" class="font-weight-bold">{{ numComputadoras }}</v-chip>
            </div>
            <v-slider
              v-model="numComputadoras"
              :min="0"
              :max="40"
              :step="1"
              color="orange-darken-2"
              track-color="orange-lighten-4"
              hide-details
              class="mt-2"
            ></v-slider>
            <p class="text-caption text-grey-darken-1 mt-3">
              <v-icon size="x-small" color="grey" class="mr-1">mdi-information</v-icon>
              Cada aire, computadora e iluminación requieren 1 actuador Sonoff.
            </p>
          </div>

        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="5">
        <v-card v-scroll-animate class="h-100 pa-8 rounded-xl ticket-card before-enter-slide-right delay-3 d-flex flex-column" elevation="6">
          
          <div class="text-center mb-6">
            <v-avatar color="blue-lighten-5" size="64" class="mb-3">
              <v-icon color="blue-darken-2" size="32">mdi-receipt-text-outline</v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-bold text-grey-darken-4 custom-font">Resumen de Inversión</h3>
          </div>

          <v-divider class="mb-5 border-dashed"></v-divider>

          <div class="mb-5">
            <h4 class="text-caption text-uppercase text-grey-darken-1 font-weight-black mb-3 tracking-wide">Infraestructura Base</h4>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-body-2 text-grey-darken-3">{{ numEdificios }}x Raspberry Pi 4 (4GB)</span>
              <span class="text-body-2 font-weight-bold text-grey-darken-4">${{ formatPrice(numEdificios * precios.raspberry) }}</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-body-2 text-grey-darken-3">{{ numEdificios }}x Kit de Alimentación</span>
              <span class="text-body-2 font-weight-bold text-grey-darken-4">${{ formatPrice(numEdificios * precios.cableado) }}</span>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="text-caption text-uppercase text-grey-darken-1 font-weight-black mb-3 tracking-wide">Nodos de Monitoreo ({{ numSalones }} salas)</h4>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-body-2 text-grey-darken-3">{{ numSalones }}x ESP32-WROOM-32</span>
              <span class="text-body-2 font-weight-bold text-grey-darken-4">${{ formatPrice(numSalones * precios.esp32) }}</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-body-2 text-grey-darken-3">{{ numSalones }}x Sensor PIR HC-SR501</span>
              <span class="text-body-2 font-weight-bold text-grey-darken-4">${{ formatPrice(numSalones * precios.pir) }}</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-body-2 text-grey-darken-3">{{ numSalones }}x Sensor SCT-013-000</span>
              <span class="text-body-2 font-weight-bold text-grey-darken-4">${{ formatPrice(numSalones * precios.sct) }}</span>
            </div>
            
            <div class="d-flex justify-space-between mb-2">
              <span class="text-body-2 text-grey-darken-3">{{ numSalones * sonoffsPorSala }}x Sonoff Basic R2 (Actuadores)</span>
              <span class="text-body-2 font-weight-bold text-grey-darken-4">${{ formatPrice(numSalones * precios.sonoff * sonoffsPorSala) }}</span>
            </div>
          </div>

          <div class="mb-6 bg-green-lighten-5 pa-3 rounded-lg border-green-light">
            <div class="d-flex justify-space-between align-center">
              <div>
                <span class="text-body-2 text-green-darken-3 font-weight-bold d-block">Licencias de Software</span>
                <span class="text-caption text-green-darken-2">Node-RED, Tasmota, Grafana</span>
              </div>
              <v-chip color="green-darken-2" variant="flat" size="small" class="font-weight-bold">GRATIS</v-chip>
            </div>
          </div>

          <div class="mt-auto">
            <v-divider class="mb-5 border-dashed border-thick"></v-divider>

            <div class="d-flex justify-space-between align-center bg-blue-darken-3 pa-5 rounded-xl text-white elevation-3 mb-4">
              <div>
                <span class="text-subtitle-2 text-blue-lighten-4 d-block mb-1 text-uppercase">Total Estimado</span>
                <span class="text-caption text-blue-lighten-2">Aprox. ${{ formatPrice(costoPromedioSala) }} por sala</span>
              </div>
              <span class="text-h5 font-weight-black custom-font">${{ formatPrice(costoTotal) }}</span>
            </div>

            <div class="bg-grey-lighten-4 pa-3 rounded-lg border text-center">
              <v-icon size="small" color="grey-darken-2" class="mr-1 mb-1">mdi-alert-circle-outline</v-icon>
              <span class="text-caption text-grey-darken-2">
                Los precios reflejados representan únicamente la inversión en hardware. <strong>No incluyen</strong> costos de mano de obra ni material de instalación (canaletas, cableado eléctrico, etc.).
              </span>
            </div>
          </div>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

// Valores iniciales 
const numEdificios = ref(16)
const numSalones = ref(128)

// 🟢 NUEVAS VARIABLES REACTIVAS
const numAires = ref(2) 
const numComputadoras = ref(1)

// Precios unitarios 
const precios = {
  esp32: 185,
  pir: 59,
  sct: 129,
  sonoff: 150, 
  raspberry: 1800,
  cableado: 600
}

// 🟢 LÓGICA DE CÁLCULO ACTUALIZADA
// Se asume 1 Sonoff por Aire + 1 Sonoff por PC + 1 Sonoff para la Iluminación general
const sonoffsPorSala = computed(() => {
  return numAires.value + numComputadoras.value + 1 // El +1 es para la iluminación
})

const costoSalones = computed(() => {
  const costoPorSalon = precios.esp32 + precios.pir + precios.sct + (precios.sonoff * sonoffsPorSala.value)
  return costoPorSalon * numSalones.value
})

const costoEdificios = computed(() => {
  const costoPorEdificio = precios.raspberry + precios.cableado
  return costoPorEdificio * numEdificios.value
})

const costoTotal = computed(() => {
  return costoSalones.value + costoEdificios.value
})

const costoPromedioSala = computed(() => {
  return numSalones.value > 0 ? (costoTotal.value / numSalones.value).toFixed(0) : 0
})

const formatPrice = (value) => {
  return Number(value).toLocaleString('es-MX')
}

// DIRECTIVA DE ANIMACIÓN
const vScrollAnimate = {
  mounted: (el) => {
    el.classList.add(Array.from(el.classList).find(c => c.startsWith('before-enter-')));
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
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
  },
};
</script>

<style scoped>
/* =========================================
   TEXTOS Y COLORES
========================================= */
.text-gradient {
  background: linear-gradient(135deg, #0D47A1 0%, #1976D2 50%, #42A5F5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: shine 5s linear infinite;
}

@keyframes shine { to { background-position: 200% center; } }

.tracking-wide { letter-spacing: 1.5px; }
.opacity-20 { opacity: 0.2; }

/* =========================================
   ESTILOS DE TARJETAS
========================================= */
.controls-card {
  background-color: #f8fafc !important; 
  border: 1px solid #e2e8f0 !important;
}

.ticket-card {
  background-color: #ffffff !important;
  border-top: 8px solid #1976D2 !important; 
}

/* Divisores tipo recibo */
.border-dashed { border-top-style: dashed !important; border-color: #cbd5e1 !important; opacity: 1 !important; }
.border-thick { border-top-width: 2px !important; }
.border-green-light { border: 1px solid #bbf7d0 !important; }
.border { border: 1px solid #e2e8f0 !important; }

/* =========================================
    ANIMACIONES ON SCROLL
========================================= */
.before-enter-fade {
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.before-enter-slide-left {
  opacity: 0; transform: translateX(-80px);
  transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.before-enter-slide-right {
  opacity: 0; transform: translateX(80px);
  transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.enter-active {
  opacity: 1 !important; transform: translate(0, 0) !important;
}

.delay-1 { transition-delay: 0.1s; }
.delay-2 { transition-delay: 0.2s; }
.delay-3 { transition-delay: 0.3s; }
</style>