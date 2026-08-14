import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useDeviceStore = defineStore("device", () => {
  const API_BASE = "/device";
  const dispositivos = ref([]);
  const dispositivo = ref({});
  const loading = ref(false);

  // GET /device/room/:id
  // Obtiene la lista de dispositivos de una sala específica y su sensor vinculado
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
  // Registra un nuevo equipo general
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

  // PATCH /device/:id/sensor
  // Vincula, reasigna o desvincula un sensor de un equipo específico
  const asignarSensorADispositivo = ({ codigoDispositivo, codigoSensor, onComplete, onError }) => {
    loading.value = true;
    axios
      .patch(`${API_BASE}/${codigoDispositivo}/sensor`, { codigoSensor })
      .then((res) => {
        if (onComplete) onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  // DELETE /device/:id
  // Elimina un dispositivo (el sensor que tuviera queda libre)
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

  // GET /device/room/:id/available-sensors
  // Retorna una promesa con los sensores libres (sin equipo asignado) en la sala
  const obtenerSensoresLibres = (id) => {
    // No usamos el loading global aquí para que los selectores carguen en segundo plano sin bloquear la UI
    return axios
      .get(`${API_BASE}/room/${id}/available-sensors`)
      .then((res) => res.data);
  };

  return {
    dispositivos,
    dispositivo,
    loading,
    listarDispositivosPorSala,
    agregarDispositivo,
    asignarSensorADispositivo,
    eliminarDispositivo,
    listarDispositivosPorUsuario,
    obtenerSensoresLibres
  };
});