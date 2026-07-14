import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useMonitoringStore = defineStore("device", () => {
    const API_BASE = "http://localhost:3000/monitoring";
    const lectura = ref([]);
    const loading = ref(false);

    const listarLecturaMensual = ({ id, onComplete, onError }) => {
        axios
            .get(`${API_BASE}/general`)
            .then((res) => {
                lectura.value = res.data.data;
                if (onComplete) onComplete(res);
            })
            .catch(onError)
            .finally(() => (loading.value = false));
    };
});

