import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useAlarmStore = defineStore("alarm", () => {
  const API_BASE = "http://localhost:3000/alarm";
  const alarmas = ref([]);
  const loading = ref(false);

  const listarAlarmas = ({ id, onComplete, onError }) => {
    loading.value = true;
    axios
      .get(`${API_BASE}/user/${id}`)
      .then((res) => {
        alarmas.value = res.data.data;
        if (onComplete) onComplete(res);
      })
      .catch(onError)
      .finally(() => (loading.value = false));
  };

  return {
    alarmas,
    loading,
    listarAlarmas
  };
});