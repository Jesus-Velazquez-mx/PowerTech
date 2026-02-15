import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
 const API_BASE = "http://localhost:3000";
  /* Al iniciar, intentamos recuperar el usuario del localStorage */
  const usuario = ref(JSON.parse(localStorage.getItem("powertech_user")) || null);
  const edificiosYSalas = ref([]);
  const loading = ref(false);

  // POST /login
  const login = ({ datos, onComplete, onError }) => {
    loading.value = true;
    axios
      .post(`${API_BASE}/user/login`, datos)
      .then((res) => {
        const userData = res.data.data;
        usuario.value = userData;

        /* Guardamos los datos en localStorage al iniciar sesión */
        localStorage.setItem("powertech_user", JSON.stringify(userData));
        
        onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  // POST /user
  const agregarUsuario = ({ datos, onComplete, onError }) => {
  loading.value = true;
  axios
    .post(`${API_BASE}/user`, datos)
    .then((res) => {
      if (onComplete) onComplete(res);
    })
    .catch(onError)
    .finally(() => (loading.value = false));
};

  // GET /user/:id/perfil
  const obtenerDatosRelacionados = ({ id, onComplete, onError }) => {
    loading.value = true;
    axios
      .get(`${API_BASE}/user/${id}/perfil`)
      .then((res) => {
        edificiosYSalas.value = res.data.data;
        if (onComplete) onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  // Función para cerrar sesión
    const logout = () => {
    usuario.value = null;
    edificiosYSalas.value = [];
    
    // 3. Limpiamos el localStorage al salir
    localStorage.removeItem("powertech_user");
  };

  return {
    usuario,
    edificiosYSalas,
    loading,
    login,
    obtenerDatosRelacionados,
    logout,
    agregarUsuario
  };
});