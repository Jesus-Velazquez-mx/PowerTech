<template>
  <v-container class="px-4 py-12 position-relative">
    
    <v-row justify="center" class="text-center mb-12">
      <v-col cols="12" md="8">
        <h2 v-scroll-animate class="text-h4 text-md-h3 font-weight-black text-gradient mb-4 custom-font before-enter-fade">
          Hablemos de tu Proyecto
        </h2>
        <p v-scroll-animate class="text-h6 text-grey-darken-1 before-enter-fade delay-1" style="line-height: 1.6;">
          ¿Listo para optimizar el consumo energético de tu empresa? Escríbenos y un ingeniero de PowerTech se pondrá en contacto contigo.
        </p>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" lg="10">
        <v-card class="rounded-xl overflow-hidden elevation-4" color="transparent">
          <v-row no-gutters>
            
            <v-col cols="12" md="7" class="bg-white pa-8 pa-md-12 position-relative">
              <div v-scroll-animate class="before-enter-slide-up delay-2">
                <h3 class="text-h5 font-weight-bold mb-6 text-blue-darken-3 custom-font">Envíanos un mensaje</h3>
                
                <v-form @submit.prevent="guardarMensaje" ref="formRef">
                  <v-text-field
                    v-model="formulario.nombre"
                    label="Nombre completo"
                    variant="outlined"
                    color="blue-darken-2"
                    prepend-inner-icon="mdi-account-outline"
                    class="mb-2 rounded-lg"
                    bg-color="grey-lighten-5"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="formulario.correo"
                    label="Correo electrónico"
                    type="email"
                    variant="outlined"
                    color="blue-darken-2"
                    prepend-inner-icon="mdi-email-outline"
                    class="mb-2 rounded-lg"
                    bg-color="grey-lighten-5"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="formulario.empresa"
                    label="Empresa / Institución"
                    variant="outlined"
                    color="blue-darken-2"
                    prepend-inner-icon="mdi-domain"
                    class="mb-2 rounded-lg"
                    bg-color="grey-lighten-5"
                  ></v-text-field>

                  <v-textarea
                    v-model="formulario.mensaje"
                    label="¿En qué podemos ayudarte?"
                    variant="outlined"
                    color="blue-darken-2"
                    prepend-inner-icon="mdi-message-text-outline"
                    rows="4"
                    class="mb-4 rounded-lg"
                    bg-color="grey-lighten-5"
                    required
                  ></v-textarea>

                  <v-btn 
                    type="submit"
                    color="blue-darken-2" 
                    size="x-large" 
                    block 
                    class="text-none font-weight-bold rounded-lg shadow-blue custom-font btn-hover"
                    elevation="2"
                    append-icon="mdi-send"
                  >
                    Enviar Mensaje
                  </v-btn>
                </v-form>
              </div>
            </v-col>

            <v-col cols="12" md="5" class="bg-blue-darken-3 pa-8 pa-md-12 d-flex flex-column justify-center position-relative overflow-hidden">
              <div class="circle-decoration circle-1"></div>
              <div class="circle-decoration circle-2"></div>

              <div v-scroll-animate class="position-relative z-index-1 before-enter-slide-down delay-3">
                <h3 class="text-h5 font-weight-bold mb-8 text-white custom-font">Información de Contacto</h3>
                
                <div class="d-flex align-start mb-8 contact-item">
                  <v-avatar color="blue-darken-1" size="48" class="mr-4 mt-1">
                    <v-icon color="white">mdi-map-marker-outline</v-icon>
                  </v-avatar>
                  <div>
                    <h4 class="text-subtitle-1 font-weight-bold text-white mb-1">Ubicación</h4>
                    <p class="text-body-2 text-blue-lighten-4 mb-0" style="line-height: 1.5;">
                      Instituto Tecnológico de Culiacán<br>
                      Culiacán Rosales, Sinaloa, México.
                    </p>
                  </div>
                </div>

                <div class="d-flex align-start mb-8 contact-item">
                  <v-avatar color="blue-darken-1" size="48" class="mr-4 mt-1">
                    <v-icon color="white">mdi-email-fast-outline</v-icon>
                  </v-avatar>
                  <div>
                    <h4 class="text-subtitle-1 font-weight-bold text-white mb-1">Correo Electrónico</h4>
                    <p class="text-body-2 text-blue-lighten-4 mb-0">
                      contactatech224@gmail.com
                    </p>
                  </div>
                </div>

                <div class="d-flex align-start mb-12 contact-item">
                  <v-avatar color="blue-darken-1" size="48" class="mr-4 mt-1">
                    <v-icon color="white">mdi-phone-outline</v-icon>
                  </v-avatar>
                  <div>
                    <h4 class="text-subtitle-1 font-weight-bold text-white mb-1">Llámanos</h4>
                    <p class="text-body-2 text-blue-lighten-4 mb-0">
                      +52 (667) 142 1191
                    </p>
                  </div>
                </div>

                <div>
                  <h4 class="text-subtitle-2 font-weight-bold text-white mb-4 custom-font text-uppercase tracking-wide">Síguenos</h4>
                  <div class="d-flex ga-3">
                    
                    <v-btn 
                      href="https://www.instagram.com/contactotech224/" 
                      target="_blank"
                      icon="mdi-instagram" 
                      variant="tonal" 
                      color="white" 
                      class="social-btn"
                    ></v-btn>

                    <v-btn 
                      href="https://github.com/Jesus-Velazquez-mx/PowerTech" 
                      target="_blank"
                      icon="mdi-github" 
                      variant="tonal" 
                      color="white" 
                      class="social-btn"
                    ></v-btn>

                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <div class="floating-container">
      
      <transition name="slide-fade">
        <v-card v-if="panelAbierto" class="messages-panel rounded-xl elevation-6 mb-4 d-flex flex-column" width="350">
          <div class="bg-blue-darken-3 pa-4 text-white d-flex justify-space-between align-center">
            <span class="font-weight-bold custom-font text-h6">Bandeja de Entrada</span>
            <v-btn icon="mdi-close" variant="text" size="small" color="white" @click="panelAbierto = false"></v-btn>
          </div>
          
          <div class="pa-4 flex-grow-1 overflow-y-auto" style="max-height: 400px; background-color: #f8fafc;">
            <div v-if="mensajesGuardados.length === 0" class="text-center text-grey my-10">
              <v-icon size="40" color="grey-lighten-1" class="mb-2">mdi-inbox-outline</v-icon>
              <p>No hay mensajes aún.</p>
            </div>
            
            <v-card v-for="(msg, index) in mensajesGuardados" :key="index" class="mb-3 pa-3 rounded-lg border" elevation="0" color="white">
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="font-weight-bold text-blue-darken-3 text-subtitle-2">{{ msg.nombre }}</span>
                <span class="text-caption text-grey">{{ msg.hora }}</span>
              </div>
              <p class="text-caption text-grey-darken-2 mb-2"><v-icon size="x-small">mdi-domain</v-icon> {{ msg.empresa || 'Sin empresa' }}</p>
              <p class="text-body-2 text-grey-darken-4" style="line-height: 1.4;">"{{ msg.mensaje }}"</p>
            </v-card>
          </div>
        </v-card>
      </transition>

      <v-badge :content="mensajesGuardados.length" color="red" :model-value="mensajesGuardados.length > 0">
        <v-btn
          icon="mdi-message-text"
          color="blue-darken-3"
          size="x-large"
          class="shadow-blue bubble-btn"
          @click="panelAbierto = !panelAbierto"
        ></v-btn>
      </v-badge>

    </div>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

// Estado del formulario
const formRef = ref(null)
const formulario = ref({
  nombre: '',
  correo: '',
  empresa: '',
  mensaje: ''
})

// Lógica de la burbuja y mensajes
const mensajesGuardados = ref([])
const panelAbierto = ref(false)

const guardarMensaje = () => {
  // Validación muy básica para no guardar vacíos
  if (!formulario.value.nombre || !formulario.value.mensaje) return

  // Obtenemos la hora actual para darle realismo
  const horaActual = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })

  // Guardamos una copia del mensaje en nuestro arreglo
  mensajesGuardados.value.push({
    ...formulario.value,
    hora: horaActual
  })

  // Limpiamos el formulario para el siguiente uso
  formulario.value = { nombre: '', correo: '', empresa: '', mensaje: '' }
  
  // Abrimos el panel para que veas el resultado automáticamente (Opcional)
  panelAbierto.value = true
}

// DIRECTIVA DE ANIMACIÓN REPETITIVA
const vScrollAnimate = {
  mounted: (el) => {
    const initialClass = Array.from(el.classList).find(c => c.startsWith('before-enter-'));
    if (initialClass) el.classList.add(initialClass);

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
   TEXTOS Y COLORES
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

.tracking-wide {
  letter-spacing: 1.5px;
}

.z-index-1 {
  z-index: 1;
}

/* =========================================
   ELEMENTOS INTERACTIVOS
========================================= */
.shadow-blue {
  box-shadow: 0 8px 20px rgba(25, 118, 210, 0.25) !important;
}

.btn-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(25, 118, 210, 0.35) !important;
}

.contact-item {
  transition: transform 0.3s ease;
}
.contact-item:hover {
  transform: translateX(8px); 
}

.social-btn {
  transition: transform 0.3s ease, background-color 0.3s ease;
}
.social-btn:hover {
  transform: translateY(-4px);
  background-color: rgba(255, 255, 255, 0.2) !important;
}

/* =========================================
   DECORACIÓN DE FONDO
========================================= */
.circle-decoration {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  z-index: 0;
}
.circle-1 { width: 300px; height: 300px; top: -100px; right: -100px; }
.circle-2 { width: 200px; height: 200px; bottom: -50px; left: -50px; }

/* =========================================
    BURBUJA Y PANEL (NUEVO)
========================================= */

/* Fijamos el contenedor de la burbuja en la esquina inferior derecha (viewport) */
.floating-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

/* Estilo para que la burbuja se vea viva */
.bubble-btn {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.bubble-btn:hover {
  transform: scale(1.1);
}

/* Panel estilo bandeja de entrada */
.messages-panel {
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
  overflow: hidden; /* Para que el header azul respete las esquinas redondeadas */
}

/* Transición fluida para que el panel suba y aparezca desde la burbuja */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  transform-origin: bottom right; /* Anclado a la esquina para que crezca desde ahí */
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px) scale(0.5);
  opacity: 0;
}

/* =========================================
    ANIMACIONES ON SCROLL
========================================= */
.before-enter-fade {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.before-enter-slide-up {
  opacity: 0;
  transform: translateY(80px);
  transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.before-enter-slide-down {
  opacity: 0;
  transform: translateY(-80px);
  transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.enter-active {
  opacity: 1 !important;
  transform: translate(0, 0) !important;
}

.delay-1 { transition-delay: 0.1s; }
.delay-2 { transition-delay: 0.2s; }
.delay-3 { transition-delay: 0.3s; }
</style>