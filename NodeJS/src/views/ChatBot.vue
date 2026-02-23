<template>
  <div class="chatbot-wrapper">
    <v-expand-transition>
      <v-card
        v-if="isOpen"
        class="chat-window rounded-xl elevation-12 d-flex flex-column"
        width="320"
        height="450"
      >
        <!-- Toolbar que simula un chat -->
        <v-toolbar color="green-darken-1" flat>
          <!-- Icono -->
          <v-avatar size="32" class="ml-2 bg-white">
            <v-icon color="green-darken-1">mdi-robot-outline</v-icon>
          </v-avatar>
          <!-- Título -->
          <v-toolbar-title class="text-subtitle-1 font-weight-bold text-white">
            PowerBot Assistant
          </v-toolbar-title>
          <!-- Botón para cerrar -->
          <v-btn icon="mdi-close" variant="text" color="white" @click="isOpen = false"></v-btn>
        </v-toolbar>

         <!-- Chat -->
        <v-card-text class="flex-grow-1 overflow-y-auto bg-grey-lighten-4 pa-4">
          <div class="d-flex mb-4">
            <!-- Icono cuando responde un mensaje -->
            <v-avatar size="28" color="green-lighten-4" class="mr-2">
              <v-icon size="16" color="green-darken-2">mdi-robot</v-icon>
            </v-avatar>
            <!-- Primer mensaje-->
            <div class="message-bubble bot-message pa-3 rounded-lg text-body-2 shadow-sm">
              ¡Hola! Soy PowerBot. ¿En qué puedo ayudarte con el sistema hoy?
            </div>
          </div>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-3 bg-white">
          <!-- Textfield para escribir el mensaje -->
            <v-text-field
            placeholder="Escribe un mensaje..."
            variant="solo-filled"
            density="compact"
            rounded="pill"
            hide-details
            flat
            bg-color="grey-lighten-3"
          >
            <!-- Icono de mandar -->
            <template v-slot:append-inner>
              <v-icon color="green-darken-1">mdi-send</v-icon>
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
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<style scoped>
.chatbot-wrapper {
  position: fixed;
  bottom: 100px; /* Sobre el menú inferior */
  right: 80px;
  z-index: 1000;
}

.chat-window {
  position: absolute;
  bottom: 70px;
  right: 0;
  border: 1px solid rgba(0,0,0,0.1);
  overflow: hidden;
}

/* Efecto de "asomarse" para la bolita verde */
.chat-trigger-btn {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  transform: translate(15px, 15px); /* Se esconde un poco hacia la esquina */
}

.chat-trigger-btn:hover {
  transform: translate(0, 0) scale(1.1); /* Se asoma completamente al pasar el cursor */
}

.bot-message {
  background-color: white;
  color: #333;
  max-width: 80%;
  border: 1px solid rgba(0,0,0,0.05);
}

.shadow-sm {
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
</style>