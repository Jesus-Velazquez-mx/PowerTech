<template>
  <v-container class="fill-height bg-transparent" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4" lg="3">
        <v-card class="pa-8 rounded-xl" elevation="1">
          <div class="text-center mb-8">
            <v-avatar color="white" size="80" class="elevation-1 border-multicolor">
              <v-icon size="40" color="blue-darken-2">mdi-account-plus</v-icon>
            </v-avatar>
            <h1 class="text-h4 font-weight-bold mt-4" style="color: #3b6fb6;">Registro</h1>
          </div>

          <v-form ref="formRef" v-model="esValido" @submit.prevent="registrar">
            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1">Nombre Completo</div>
            <v-text-field
              v-model="nombre"
              placeholder="Tu nombre"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="reglas.nombre"
              required
            />

            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2">Correo Electrónico</div>
            <v-text-field
              v-model="email"
              placeholder="nombre@ejemplo.com"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="reglas.email"
              required
            />

            <div class="text-subtitle-2 font-weight-bold mb-1 ml-1 mt-2">Contraseña</div>
            <v-text-field
              v-model="contrasena"
              type="password"
              placeholder="••••••••"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              :rules="reglas.contrasena"
              required
            />

            <v-btn
              block
              size="large"
              color="blue-darken-2"
              class="text-none rounded-pill mt-4 mb-4"
              :loading="loading"
              :disabled="!esValido"
              type="submit"
            >
              Crear cuenta
            </v-btn>
          </v-form>

          <div class="text-center mt-4">
            <span class="text-caption text-grey-darken-1">¿Ya tienes una cuenta?</span>
            <br />
            <v-btn 
              variant="text" 
              class="text-none text-caption font-weight-bold pa-0" 
              color="blue-darken-2"
              :to="{name: 'login'}"
            >
              Iniciar Sesión
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/users";
import { useNotifyStore } from "@/stores/notify";

const router = useRouter();
const userStore = useUserStore();
const notify = useNotifyStore();
const { loading } = storeToRefs(userStore);

const formRef = ref(null);
const esValido = ref(false);

const nombre = ref("");
const email = ref("");
const contrasena = ref("");

const reglas = {
  nombre: [v => !!v || "El nombre es obligatorio", v => v.length <= 50 || "Máximo 50 caracteres"],
  email: [v => !!v || "El correo es obligatorio", v => /.+@.+\..+/.test(v) || "Correo no válido"],
  contrasena: [v => !!v || "La contraseña es obligatoria", v => v.length >= 6 || "Mínimo 6 caracteres"]
};

const registrar = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  const datos = {
    nombre: nombre.value.trim(),
    email: email.value.trim(),
    contrasena: contrasena.value.trim()
  };

await userStore.agregarUsuario({
  datos,
  onComplete: () => {
    notify.show("Cuenta creada exitosamente", "success");
    router.push("/login");
  },
  onError: (error) => {
    const msg = error.response?.data?.mensaje || "Ya existe este usuario";
    notify.show(msg, "error");
  }
});
};
</script>

<style scoped>
.border-multicolor {
  border: 4px solid transparent !important;
  background-image: linear-gradient(white, white), linear-gradient(to right, #4285F4, #EA4335, #FBBC05, #34A853);
  background-origin: border-box;
  background-clip: content-box, border-box;
}
:deep(.v-field__outline) { --v-field-border-opacity: 0.15; }
</style>