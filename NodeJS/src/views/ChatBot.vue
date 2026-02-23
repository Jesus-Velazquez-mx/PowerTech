<template>
  <div class="chatbot-wrapper">
    <v-expand-transition>
      <v-card
          v-if="isOpen"
          class="chat-window rounded-xl elevation-12 d-flex flex-column"
          width="340"
          height="500"
      >
        <v-toolbar color="green-darken-1" flat>
          <v-avatar size="32" class="ml-2 bg-white">
            <v-icon color="green-darken-1">mdi-robot-outline</v-icon>
          </v-avatar>
          <v-toolbar-title class="text-subtitle-1 font-weight-bold text-white">
            PowerBot Assistant
          </v-toolbar-title>
          <v-btn icon="mdi-close" variant="text" color="white" @click="isOpen = false"></v-btn>
        </v-toolbar>

        <v-card-text
            ref="chatContainer"
            class="flex-grow-1 overflow-y-auto bg-grey-lighten-4 pa-4 shadow-inner"
        >
          <div
              v-for="msg in mensajes"
              :key="msg.id"
              :class="['d-flex mb-4', msg.esBot ? 'justify-start' : 'justify-end']"
          >
            <v-avatar v-if="msg.esBot" size="28" color="green-lighten-4" class="mr-2 mt-1">
              <v-icon size="16" color="green-darken-2">mdi-robot</v-icon>
            </v-avatar>

            <div
                :class="[
                'message-bubble pa-3 rounded-lg text-body-2',
                msg.esBot ? 'bot-message shadow-sm' : 'user-message elevation-1'
              ]"
            >
              {{ msg.texto }}
            </div>
          </div>

          <div v-if="cargando" class="d-flex align-center mb-4">
            <v-progress-circular indeterminate color="green-darken-1" size="18" width="2"></v-progress-circular>
            <span class="ml-2 text-caption text-grey-darken-1 italic">PowerBot está pensando...</span>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-3 bg-white">
          <v-text-field
              v-model="nuevoMensaje"
              placeholder="Escribe tu consulta aquí..."
              variant="solo-filled"
              density="compact"
              rounded="pill"
              hide-details
              flat
              bg-color="grey-lighten-3"
              @keyup.enter="enviarMensaje"
          >
            <template v-slot:append-inner>
              <v-btn
                  icon="mdi-send"
                  variant="text"
                  size="small"
                  :color="nuevoMensaje ? 'green-darken-1' : 'grey'"
                  :disabled="!nuevoMensaje || cargando"
                  @click="enviarMensaje"
              ></v-btn>
            </template>
          </v-text-field>
        </v-card-actions>
      </v-card>
    </v-expand-transition>

    <v-btn
        v-if="!isOpen"
        color="green-darken-1"
        icon="mdi-robot"
        size="large"
        elevation="4"
        class="chat-trigger-btn"
        @click="isOpen = true"
    ></v-btn>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import axios from 'axios';

// Estados reactivos
const isOpen = ref(false);
const nuevoMensaje = ref('');
const cargando = ref(false);
const chatContainer = ref(null);

// Historial inicial
const mensajes = ref([
  {
    id: 1,
    texto: '¡Hola! Soy PowerBot. ¿En qué puedo ayudarte con el consumo de tus edificios hoy?',
    esBot: true
  }
]);

// Función para manejar el envío de mensajes
const enviarMensaje = async () => {
  if (!nuevoMensaje.value.trim() || cargando.value) return;

  const textoUsuario = nuevoMensaje.value;

  // 1. Agregar mensaje del usuario a la lista
  mensajes.value.push({
    id: Date.now(),
    texto: textoUsuario,
    esBot: false
  });

  nuevoMensaje.value = ''; // Limpiar input
  cargando.value = true;   // Mostrar "pensando"
  await scrollToBottom();

  try {
    // 2. Petición a tu servidor Express
    // Ajusta la URL si tu servidor corre en otro puerto
    const response = await axios.post('http://localhost:3000/api/ai/consejo', {
      datos: { consulta: textoUsuario }
    });

    // 3. Agregar respuesta de la IA
    mensajes.value.push({
      id: Date.now() + 1,
      texto: response.data.mensaje,
      esBot: true
    });
  } catch (error) {
    console.error("Error al conectar con el servidor:", error);
    mensajes.value.push({
      id: Date.now() + 1,
      texto: 'Hubo un problema al conectar con el servidor. Por favor, asegúrate de que el backend esté corriendo.',
      esBot: true
    });
  } finally {
    cargando.value = false;
    await scrollToBottom();
  }
};

// Función para desplazar el scroll al último mensaje
const scrollToBottom = async () => {
  await nextTick(); // Esperamos a que el DOM se actualice
  if (chatContainer.value) {
    // chatContainer.value.$el accede al elemento del DOM si es un componente de Vuetify
    const container = chatContainer.value.$el || chatContainer.value;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    });
  }
};
</script>

<style scoped>
.chatbot-wrapper {
  position: fixed;
  bottom: 100px; /* Separación del menú inferior */
  right: 20px;
  z-index: 1000;
}

.chat-window {
  position: absolute;
  bottom: 75px;
  right: 0;
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chat-trigger-btn {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}

.chat-trigger-btn:hover {
  transform: scale(1.1);
}

/* Burbujas de chat */
.message-bubble {
  max-width: 85%;
  line-height: 1.4;
  word-wrap: break-word;
}

.bot-message {
  background-color: white;
  color: #333;
  border-bottom-left-radius: 4px !important;
}

.user-message {
  background-color: #2e7d32; /* Verde oscuro (v-green-darken-1) */
  color: white;
  border-bottom-right-radius: 4px !important;
}

.shadow-inner {
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);
}

.shadow-sm {
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* Scrollbar personalizado */
.overflow-y-auto::-webkit-scrollbar {
  width: 5px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #bdbdbd;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9e9e9e;
}
</style>