import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useRoomStore = defineStore("room", () => {
  const API_BASE = "/room";
  const salas = ref([]);
  const sala = ref({});
  const loading = ref(false);

  // GET /room/building/:id
  // Obtiene la lista de salas vinculadas a un edificio específico
  const listarSalasPorEdificio = ({ id, onComplete, onError }) => {
    loading.value = true;
    axios
      .get(`${API_BASE}/building/${id}`)
      .then((res) => {
        // Guardamos la lista de salas en el estado
        salas.value = res.data.data;
        if (onComplete) onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  // POST /room
  // Registra una nueva sala en la base de datos
  const agregarSala = ({ datos, onComplete, onError }) => {
    loading.value = true;
    axios
      .post(API_BASE, datos)
      .then((res) => {
        if (onComplete) onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  // DELETE /room/:id
  // Elimina una sala y sus referencias vinculadas
  const eliminarSala = ({ id, onComplete, onError }) => {
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
    salas,
    sala,
    loading,
    listarSalasPorEdificio,
    agregarSala,
    eliminarSala
  };
});