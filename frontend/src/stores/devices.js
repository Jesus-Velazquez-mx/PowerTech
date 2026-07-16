import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useDeviceStore = defineStore("device", () => {
  const API_BASE = "/device";
  const dispositivos = ref([]);
  const dispositivo = ref({});
  const loading = ref(false);

  // GET /device/room/:id
  // Obtiene la lista de dispositivos de una sala específica
  const listarDispositivosPorSala = ({ id, onComplete, onError }) => {
    loading.value = true;
    axios
      .get(`${API_BASE}/room/${id}`)
      .then((res) => {
        // Guardamos la lista en el estado reactivo
        dispositivos.value = res.data.data;
        if (onComplete) onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  // POST /device
  // Registra un nuevo dispositivo (Computadora o Aire)
  const agregarDispositivo = ({ datos, onComplete, onError }) => {
    loading.value = true;
    axios
      .post(API_BASE, datos)
      .then((res) => {
        if (onComplete) onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  // DELETE /device/:id
  // Elimina un dispositivo y limpia sus alarmas
  const eliminarDispositivo = ({ id, onComplete, onError }) => {
    loading.value = true;
    axios
      .delete(`${API_BASE}/${id}`)
      .then((res) => {
        if (onComplete) onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  // GET /device/user/:id
  // Obtiene la lista de todos los dispositivos de un usuario
  const listarDispositivosPorUsuario = ({ id, onComplete, onError }) => {
    loading.value = true;
    axios
      .get(`${API_BASE}/user/${id}`)
      .then((res) => {
        // Guardamos la lista en el estado reactivo
        dispositivos.value = res.data.data;
        if (onComplete) onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  return {
    dispositivos,
    dispositivo,
    loading,
    listarDispositivosPorSala,
    agregarDispositivo,
    eliminarDispositivo,
    listarDispositivosPorUsuario
  };
});