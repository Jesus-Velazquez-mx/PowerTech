import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useReportStore = defineStore("report", () => {
  const API_BASE = "/report";
  const reporteData = ref(null);
  const loading = ref(false);

  /**
   * Obtiene las métricas de la vista VISTA_REPORTE_SALA para una sala específica.
   * Endpoint: GET /report/room/:id
   */
  const obtenerReporteSala = ({ id, onComplete, onError }) => {
    loading.value = true;
    axios
      .get(`${API_BASE}/room/${id}`)
      .then((res) => {
        reporteData.value = res.data.data;
        if (onComplete) onComplete(res);
      })
      .catch((err) => {
        console.error("Error al obtener el reporte:", err);
        if (onError) onError(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  /**
   * Limpia los datos del reporte actual
   */
  const limpiarReporte = () => {
    reporteData.value = null;
  };

  return {
    reporteData,
    loading,
    obtenerReporteSala,
    limpiarReporte
  };
});