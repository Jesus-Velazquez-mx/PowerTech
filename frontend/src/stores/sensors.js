import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useSensorStore = defineStore("sensor", () => {
  const API_BASE = "/sensor";
  const sensores = ref([]);
  const sensor = ref({});
  const loading = ref(false);

  const listarSensoresPorDispositivo = ({ id, onComplete, onError }) => {
    loading.value = true;
    axios.get(`${API_BASE}/device/${id}`)
      .then((res) => {
        sensores.value = res.data.data;
        if (onComplete) onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  const listarSensoresPorUsuario = ({ id, onComplete, onError }) => {
    loading.value = true;
    axios.get(`${API_BASE}/user/${id}`)
      .then((res) => {
        sensores.value = res.data.data;
        if (onComplete) onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  const agregarSensor = ({ datos, onComplete, onError }) => {
    loading.value = true;
    axios.post(API_BASE, datos)
      .then((res) => { if (onComplete) onComplete(res); })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  const eliminarSensor = ({ id, onComplete, onError }) => {
    loading.value = true;
    axios.delete(`${API_BASE}/${id}`)
      .then((res) => { if (onComplete) onComplete(res); })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  const actualizarEstadoSensor = ({ id, activo, onComplete, onError }) => {
    axios.patch(`${API_BASE}/${id}/estado`, { activo })
      .then((res) => { if (onComplete) onComplete(res); })
      .catch(onError);
  };

  // NUEVO: Petición rápida para traer lecturas sin bloquear la pantalla con el loading global
  const obtenerLecturasSensor = (id) => {
    return axios.get(`${API_BASE}/${id}/readings`).then(res => res.data.data);
  };

  return {
    sensores,
    sensor,
    loading,
    listarSensoresPorDispositivo,
    listarSensoresPorUsuario,
    agregarSensor,
    eliminarSensor,
    actualizarEstadoSensor,
    obtenerLecturasSensor // Exportamos la nueva función
  };
});