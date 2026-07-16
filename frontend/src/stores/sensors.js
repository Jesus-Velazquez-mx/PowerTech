import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useSensorStore = defineStore("sensor", () => {
  const API_BASE = "/sensor";
  const sensores = ref([]);
  const sensor = ref({});
  const loading = ref(false);

  // GET /sensor/device/:id
  // Obtiene la lista de sensores vinculados a un dispositivo específico
  const listarSensoresPorDispositivo = ({ id, onComplete, onError }) => {
    loading.value = true;
    axios
      .get(`${API_BASE}/device/${id}`)
      .then((res) => {
        // Guardamos la lista en el estado reactivo
        sensores.value = res.data.data;
        if (onComplete) onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  // GET /sensor/user/:id
  // Obtiene la lista de todos los sensores vinculados a los edificios de un usuario
  const listarSensoresPorUsuario = ({ id, onComplete, onError }) => {
    loading.value = true;
    axios
      .get(`${API_BASE}/user/${id}`)
      .then((res) => {
        // Guardamos la lista global en el estado reactivo
        sensores.value = res.data.data;
        if (onComplete) onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  // POST /sensor
  // Registra un nuevo sensor en la base de datos
  const agregarSensor = ({ datos, onComplete, onError }) => {
    loading.value = true;
    axios
      .post(API_BASE, datos)
      .then((res) => {
        if (onComplete) onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  // DELETE /sensor/:id
  // Elimina un sensor y limpia sus alarmas vinculadas
  const eliminarSensor = ({ id, onComplete, onError }) => {
    loading.value = true;
    axios
      .delete(`${API_BASE}/${id}`)
      .then((res) => {
        if (onComplete) onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  // PATCH /sensor/:id/estado
  const actualizarEstadoSensor = ({ id, activo, onComplete, onError }) => {
    axios
      .patch(`${API_BASE}/${id}/estado`, { activo })
      .then((res) => { if (onComplete) onComplete(res); })
      .catch(onError);
  };

  return {
    sensores,
    sensor,
    loading,
    listarSensoresPorDispositivo,
    listarSensoresPorUsuario,
    agregarSensor,
    eliminarSensor,
    actualizarEstadoSensor
  };
});