import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useBuildingStore = defineStore("building", () => {
  const API_BASE = "http://localhost:3000/building";
  const edificios = ref([]);
  const edificio = ref({});
  const loading = ref(false);

  // GET /building/user/:id
  // Obtiene la lista de edificios de un usuario específico
  const listarEdificiosPorUsuario = ({ id, onComplete, onError }) => {
    loading.value = true;
    axios
      .get(`${API_BASE}/user/${id}`)
      .then((res) => {
        // Guardamos la lista de edificios en el estado
        edificios.value = res.data.data;
        if (onComplete) onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  // POST /building
  // Registra un nuevo edificio en la base de datos
  const agregarEdificio = ({ datos, onComplete, onError }) => {
    loading.value = true;
    axios
      .post(API_BASE, datos)
      .then((res) => {
        if (onComplete) onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  // DELETE /building/:id
  // Borra un edificio de la base de datos
  const eliminarEdificio = ({ id, onComplete, onError }) => {
  loading.value = true;
  axios
    .delete(`${API_BASE}/${id}`)
    .then((res) => {
      if (onComplete) onComplete(res);
    })
    .catch(onError)
    .finally(() => (loading.value = false));
};

  return {
    edificios,
    edificio,
    loading,
    listarEdificiosPorUsuario,
    agregarEdificio,
    eliminarEdificio
  };
});