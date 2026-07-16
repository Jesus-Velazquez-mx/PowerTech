<template>
  <div class="chatbot-wrapper">
    <v-expand-transition>
      <v-card v-if="isOpen" class="chat-window rounded-xl elevation-12 d-flex flex-column" width="360" height="550">
        <v-toolbar color="green-darken-1" flat>
          <v-avatar size="32" class="ml-2 bg-white">
            <v-icon color="green-darken-1">mdi-robot-outline</v-icon>
          </v-avatar>
          <v-toolbar-title class="text-subtitle-1 font-weight-bold text-white">
            PowerBot Assistant
          </v-toolbar-title>
          <v-btn icon="mdi-close" variant="text" color="white" @click="isOpen = false"></v-btn>
        </v-toolbar>

        <v-card-text ref="chatContainer" class="flex-grow-1 overflow-y-auto bg-grey-lighten-4 pa-4 shadow-inner">
          <div v-for="msg in mensajes" :key="msg.id"
            :class="['d-flex mb-4', msg.esBot ? 'justify-start' : 'justify-end']">
            <v-avatar v-if="msg.esBot" size="28" color="green-lighten-4" class="mr-2 mt-1">
              <v-icon size="16" color="green-darken-2">mdi-robot</v-icon>
            </v-avatar>

            <div :class="[
              'message-bubble pa-3 rounded-lg text-body-2',
              msg.esBot ? 'bot-message shadow-sm' : 'user-message elevation-1'
            ]">
              <div v-if="msg.esBot" v-html="renderMarkdown(msg.texto)" class="markdown-content"></div>
              <div v-else>{{ msg.texto }}</div>
            </div>
          </div>

          <div v-if="cargando" class="d-flex align-center mb-4">
            <v-progress-circular indeterminate color="green-darken-1" size="18" width="2"></v-progress-circular>
            <span class="ml-2 text-caption text-grey-darken-1 italic">PowerBot analizando datos...</span>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-3 bg-white">
          <v-text-field v-model="nuevoMensaje" placeholder="Pregunta sobre el consumo..." variant="solo-filled"
            density="compact" rounded="pill" hide-details flat bg-color="grey-lighten-3" @keyup.enter="enviarMensaje">
            <template v-slot:append-inner>
              <v-btn icon="mdi-send" variant="text" size="small" :color="nuevoMensaje ? 'green-darken-1' : 'grey'"
                :disabled="!nuevoMensaje || cargando" @click="enviarMensaje"></v-btn>
            </template>
          </v-text-field>
        </v-card-actions>
      </v-card>
    </v-expand-transition>

    <v-btn v-if="!isOpen" color="green-darken-1" icon="mdi-robot" size="large" elevation="4" class="chat-trigger-btn"
      @click="isOpen = true"></v-btn>
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

const mensajes = ref([
  { id: 1, texto: '¡Hola! Soy **PowerBot**. Estoy conectado a la base de datos de **PowerTech**. ¿Qué deseas consultar?', esBot: true }
]);

const renderMarkdown = (texto) => md.render(texto);

const enviarMensaje = async () => {
  if (!nuevoMensaje.value.trim() || cargando.value) return;

  const userText = nuevoMensaje.value;
  mensajes.value.push({ id: Date.now(), texto: userText, esBot: false });
  nuevoMensaje.value = '';
  cargando.value = true;
  await scrollToBottom();

  try {
    const res = await axios.post('api/ai/consejo', {
      datos: { consulta: userText }
    });
    mensajes.value.push({ id: Date.now() + 1, texto: res.data.mensaje, esBot: true });
  } catch (e) {
    mensajes.value.push({ id: Date.now() + 1, texto: '⚠️ Error de conexión con el servidor.', esBot: true });
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
.chatbot-wrapper {
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 1000;
}

.chat-window {
  position: absolute;
  bottom: 75px;
  right: 0;
}

.message-bubble {
  max-width: 85%;
  line-height: 1.5;
}

.bot-message {
  background-color: white;
  color: #333;
}

.user-message {
  background-color: #2e7d32;
  color: white;
}

/* Estilos para el Markdown dentro del chat */
.markdown-content :deep(p) {
  margin-bottom: 8px;
}

.markdown-content :deep(ul) {
  padding-left: 20px;
  margin-bottom: 8px;
}

.markdown-content :deep(strong) {
  color: #1b5e20;
  font-weight: 700;
}
</style>