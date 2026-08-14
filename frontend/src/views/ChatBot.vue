<template>
  <div class="copilot-container">
    <!-- El Asistente ahora es un panel lateral robusto -->
    <v-navigation-drawer v-model="isOpen" location="right" width="420" temporary elevation="8"
      class="powerbot-drawer border-s">
      <div class="d-flex flex-column h-100 bg-surface">

        <!-- Cabecera de Impacto -->
        <div class="bot-header pa-4 text-white elevation-2">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="d-flex align-center">
              <v-avatar size="44" class="bg-white elevation-2 mr-3">
                <v-icon color="green-darken-3" size="28">mdi-lightning-bolt</v-icon>
              </v-avatar>
              <div>
                <h2 class="text-h6 font-weight-bold mb-0 leading-tight">PowerBot</h2>
                <span class="text-caption text-green-lighten-4 d-flex align-center">
                  <v-icon size="12" color="green-lighten-2" class="mr-1">mdi-circle</v-icon>
                  Análisis energético en línea
                </span>
              </div>
            </div>
            <v-btn icon="mdi-close" variant="text" color="white" @click="isOpen = false" size="small"></v-btn>
          </div>

          <!-- Sugerencias proactivas (Aparecen solo al inicio) -->
          <v-slide-group show-arrows class="mt-2" v-if="mensajes.length === 1">
            <v-slide-group-item v-for="sug in sugerenciasRapidas" :key="sug">
              <v-chip size="small" class="mr-2 bg-green-darken-1 text-white action-chip" @click="usarSugerencia(sug)">
                {{ sug }}
              </v-chip>
            </v-slide-group-item>
          </v-slide-group>
        </div>

        <!-- Área de Conversación -->
        <v-card-text ref="chatContainer" class="chat-body flex-grow-1 overflow-y-auto pa-4 bg-grey-lighten-4">
          <div v-for="msg in mensajes" :key="msg.id"
            :class="['d-flex mb-6', msg.esBot ? 'justify-start' : 'justify-end']">

            <v-avatar v-if="msg.esBot" size="32" color="green-lighten-5" class="mr-3 mt-1 border">
              <v-icon size="20" color="green-darken-3">mdi-robot-outline</v-icon>
            </v-avatar>

            <div :class="[
              'message-bubble pa-4 text-body-2',
              msg.esBot ? 'bot-message rounded-te-xl rounded-b-xl' : 'user-message rounded-ts-xl rounded-b-xl'
            ]">
              <div v-if="msg.esBot" v-html="renderMarkdown(msg.texto)" class="markdown-content"></div>
              <div v-else class="text-white">{{ msg.texto }}</div>
            </div>
          </div>

          <!-- Indicador de escritura -->
          <div v-if="cargando" class="d-flex align-center mb-4 pl-2">
            <v-avatar size="32" color="transparent" class="mr-3">
              <v-progress-circular indeterminate color="green-darken-2" size="20" width="2"></v-progress-circular>
            </v-avatar>
            <span class="text-caption text-grey-darken-1 font-italic">Procesando métricas de la red...</span>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <!-- Área de Input Mejorada -->
        <div class="pa-4 bg-white">
          <v-text-field v-model="nuevoMensaje" placeholder="Pregunta sobre consumos, tarifas o anomalías..."
            variant="outlined" color="green-darken-2" density="comfortable" rounded="xl" hide-details
            bg-color="grey-lighten-5" @keyup.enter="enviarMensaje">
            <template v-slot:append-inner>
              <v-scale-transition>
                <v-btn v-if="nuevoMensaje" icon="mdi-arrow-up" color="green-darken-3" size="small" variant="flat"
                  class="ml-2" :loading="cargando" @click="enviarMensaje"></v-btn>
              </v-scale-transition>
            </template>
          </v-text-field>
          <div class="text-center mt-2">
            <span class="text-micro text-grey">PowerBot puede cometer errores. Verifica las lecturas.</span>
          </div>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- Botón disparador rediseñado con animación de energía -->
    <v-fab-transition>
      <v-btn v-if="!isOpen" color="green-darken-3" icon="mdi-robot-outline" size="x-large"
        class="floating-trigger energy-pulse" @click="isOpen = true"></v-btn>
    </v-fab-transition>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import axios from 'axios';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();
const isOpen = ref(false);
const nuevoMensaje = ref('');
const cargando = ref(false);
const chatContainer = ref(null);

// Sugerencias iniciales para guiar al usuario
const sugerenciasRapidas = [
  "Analizar el pico de demanda de hoy",
  "¿Cómo va mi Factor de Potencia?",
  "Proyectar recibo de este mes"
];

const mensajes = ref([
  {
    id: 1,
    texto: '¡Hola! Soy **PowerBot**. Estoy monitoreando continuamente la base de datos y los sensores. ¿En qué te ayudo hoy?',
    esBot: true
  }
]);

const renderMarkdown = (texto) => md.render(texto);

const usarSugerencia = (texto) => {
  nuevoMensaje.value = texto;
  enviarMensaje();
};

const enviarMensaje = async () => {
  if (!nuevoMensaje.value.trim() || cargando.value) return;

  const userText = nuevoMensaje.value;
  mensajes.value.push({ id: Date.now(), texto: userText, esBot: false });
  nuevoMensaje.value = '';
  cargando.value = true;
  await scrollToBottom();

  try {
    const res = await axios.post('/api/ai/consejo', {
      datos: { consulta: userText }
    });
    mensajes.value.push({ id: Date.now() + 1, texto: res.data.mensaje, esBot: true });
  } catch (e) {
    mensajes.value.push({ id: Date.now() + 1, texto: '⚠️ Error al conectar con el servidor de análisis.', esBot: true });
  } finally {
    cargando.value = false;
    await scrollToBottom();
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    const el = chatContainer.value.$el || chatContainer.value;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }
};
</script>

<style scoped>
.copilot-container {
  z-index: 1000;
}

.floating-trigger {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 999;
}

/* 1. El Botón Flotante: Efecto "Pulso de Energía" */
@keyframes glowing-energy {
  0% {
    box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.6);
  }

  70% {
    box-shadow: 0 0 0 15px rgba(46, 125, 50, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(46, 125, 50, 0);
  }
}

.energy-pulse {
  animation: glowing-energy 2s infinite;
  border: 2px solid #a5d6a7;
}

.powerbot-drawer {
  border-left: 1px solid rgba(0, 0, 0, 0.08);
}

/* 2. La Cabecera: Gradiente Animado */
.bot-header {
  background: linear-gradient(-45deg, #1b5e20, #2e7d32, #43a047, #1b5e20);
  background-size: 400% 400%;
  animation: gradientFlow 8s ease infinite;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.message-bubble {
  max-width: 88%;
  line-height: 1.6;
}

/* 3. Burbujas de Chat: Acento Tecnológico */
.bot-message {
  background-color: #ffffff;
  color: #374151;
  border: none !important;
  border-left: 4px solid #43a047 !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}

.user-message {
  background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
  box-shadow: 0 4px 6px -1px rgba(46, 125, 50, 0.4) !important;
}

/* 4. Sugerencias Rápidas: Efecto Neón al pasar el mouse */
.action-chip {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
}

.action-chip:hover {
  background-color: #ffffff !important;
  color: #1b5e20 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.4);
}

.text-micro {
  font-size: 0.65rem;
}

/* Tipografía y Markdown pulido */
.markdown-content :deep(p) {
  margin-bottom: 10px;
}

.markdown-content :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 24px;
  margin-bottom: 12px;
}

.markdown-content :deep(li) {
  margin-bottom: 4px;
}

.markdown-content :deep(strong) {
  color: #1b5e20;
  font-weight: 700;
}
</style>