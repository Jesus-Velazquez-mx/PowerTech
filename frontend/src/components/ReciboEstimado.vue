<template>
    <div class="recibo-container">
        <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-subtitle-1 font-weight-bold">Reporte de costo en tiempo real</span>
            <v-btn icon="mdi-close" variant="text" color="grey-darken-2" @click="emit('cerrar')"></v-btn>
        </div>

        <!-- Aviso: datos no finales -->
        <div class="estimado-disclaimer">
            <v-icon color="#92400e" class="mr-2">mdi-alert-outline</v-icon>
            <div>
                <strong>Reporte preliminar — estos NO son los datos finales del recibo.</strong>
                Los montos se calculan con una lectura por hora (la del inicio de cada hora) de los dispositivos conectados,
                <template v-if="reporte.ultimaLectura">hasta el {{ formatoFechaHora(reporte.ultimaLectura) }}</template>
                <template v-else>hasta el momento</template>
                y con cuotas de referencia. El importe que emita CFE puede variar por lecturas pendientes, la
                actualización mensual de tarifas, el factor de potencia real medido, el DAP de tu municipio y otros
                ajustes.
            </div>
        </div>

        <div class="cfe-disclaimer">
            <strong>Aviso de Autoría:</strong> La estructura del recibo, definiciones y fórmulas de cálculo son
            propiedad de la <strong>Comisión Federal de Electricidad (CFE)</strong>. Las cuotas usadas son valores de
            referencia para Media Tensión.
        </div>

        <!-- Controles -->
        <header class="header">
            <div class="header-titles">
                <h1>Recibo Estimado del Periodo</h1>
                <p class="subtitle">Modalidad: <strong>{{ reporte.tarifa === 'GDMTH' ? 'Gran Demanda Horaria (>= 100kW)'
                    : 'Gran Demanda Ordinaria (< 100kW)' }}</strong>
                </p>
            </div>

            <div class="controls-wrapper">
                <div class="toggle-group">
                    <span class="toggle-label">Tarifa:</span>
                    <span class="tab-btn active">{{ reporte.tarifa }}</span>
                </div>
                <div class="toggle-group">
                    <span class="toggle-label">F.P. supuesto (%):</span>
                    <v-text-field v-model.number="fp" type="number" min="1" max="100" step="0.1" density="compact"
                        variant="outlined" hide-details class="fp-input bg-white"></v-text-field>
                </div>
                <div class="toggle-group">
                    <span class="toggle-label">Vista:</span>
                    <button :class="['tab-btn', { active: activeTab === 'frente' }]"
                        @click="activeTab = 'frente'">Frente</button>
                    <button :class="['tab-btn', { active: activeTab === 'reverso' }]"
                        @click="activeTab = 'reverso'">Reverso</button>
                </div>
            </div>
        </header>

        <div class="main-content">
            <div class="recibo-wrapper">

                <!-- ======================= FRENTE ======================= -->
                <div v-show="activeTab === 'frente'" class="recibo-mockup">
                    <div class="marca-agua">ESTIMADO</div>

                    <!-- Datos Principales -->
                    <div class="clickable-section" :class="{ selected: selectedSection === 'datosPrincipales' }"
                        @click="selectedSection = 'datosPrincipales'">
                        <div class="flex-row">
                            <div class="col-left">
                                <h2>{{ edificio?.nombreEdificio || 'Edificio' }}</h2>
                                <p><strong>CÓDIGO DE EDIFICIO:</strong> {{ edificio?.codigoEdificio }}</p>
                                <p><strong>TARIFA:</strong> {{ reporte.tarifa }} &nbsp;&nbsp;
                                    <strong>DISPOSITIVOS CONECTADOS:</strong> {{ reporte.dispositivos.length }}
                                </p>
                                <p><strong>PERIODO:</strong> 01 al {{ String(reporte.diasTranscurridos).padStart(2, '0') }}
                                    de {{ nombreMes(reporte.mes) }} {{ reporte.anio }}
                                    ({{ reporte.diasTranscurridos }} de {{ reporte.diasMes }} días)</p>
                                <p><strong>DEMANDA MÁXIMA:</strong> {{ kw(reporte.demandaMax) }}
                                    <template v-if="reporte.tarifa === 'GDMTH'">&nbsp;&nbsp;
                                        <strong>EN PUNTA:</strong> {{ kw(reporte.demandaPunta) }}</template>
                                </p>
                            </div>
                            <div class="col-right text-center">
                                <p class="total-pagar">TOTAL ESTIMADO<br>HASTA EL MOMENTO:<br>
                                    <span>{{ dinero(reporte.recibo.total) }}</span>
                                </p>
                                <p v-if="reporte.esParcial" class="proyeccion">
                                    Proyección al cierre del mes:<br><strong>{{ dinero(reporte.proyeccion.total)
                                    }}</strong>
                                </p>
                                <span class="sello-preliminar">PRELIMINAR</span>
                            </div>
                        </div>
                    </div>

                    <!-- Lecturas GDMTH -->
                    <div v-if="reporte.tarifa === 'GDMTH'" class="clickable-section"
                        :class="{ selected: selectedSection === 'lecturasHorarias' }"
                        @click="selectedSection = 'lecturasHorarias'">
                        <h3 class="section-title">Consumo de Energía y Demanda</h3>
                        <table class="mock-table">
                            <thead>
                                <tr>
                                    <th>Concepto</th>
                                    <th>Acumulado</th>
                                    <th>Prom. diario</th>
                                    <th>Proyección cierre</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="nivel in NIVELES" :key="nivel">
                                    <td>kWh {{ nivel }}</td>
                                    <td>{{ numero(reporte.energia[nivel]) }}</td>
                                    <td>{{ numero(reporte.energia[nivel] / reporte.diasTranscurridos) }}</td>
                                    <td>{{ numero(reporte.energia[nivel] * factorProyeccion) }}</td>
                                </tr>
                                <tr class="highlight-row">
                                    <td>kW Max (Demanda)</td>
                                    <td>{{ kw(reporte.demandaMax) }}</td>
                                    <td>—</td>
                                    <td>—</td>
                                </tr>
                                <tr>
                                    <td>kVArh (Reactiva)</td>
                                    <td colspan="3" class="text-grey">No medido por los sensores</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="flex-row justify-between metrics-bar" :class="{ bonus: fp >= FP_LIMITE }">
                            <span>Factor de Potencia (supuesto): {{ numero(fp) }}%</span>
                            <span>Demanda Máxima: {{ kw(reporte.demandaMax) }}</span>
                        </div>
                    </div>

                    <!-- Lecturas GDMTO -->
                    <div v-else class="clickable-section"
                        :class="{ selected: selectedSection === 'lecturasOrdinarias' }"
                        @click="selectedSection = 'lecturasOrdinarias'">
                        <h3 class="section-title">Consumo de Energía y Demanda</h3>
                        <table class="mock-table">
                            <thead>
                                <tr>
                                    <th>Concepto</th>
                                    <th>Acumulado</th>
                                    <th>Prom. diario</th>
                                    <th>Proyección cierre</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Energía (kWh)</td>
                                    <td>{{ numero(reporte.recibo.kwh) }}</td>
                                    <td>{{ numero(reporte.recibo.kwh / reporte.diasTranscurridos) }}</td>
                                    <td>{{ numero(reporte.proyeccion.kwh) }}</td>
                                </tr>
                                <tr class="highlight-row">
                                    <td>kW Max (Demanda)</td>
                                    <td>{{ kw(reporte.demandaMax) }}</td>
                                    <td>—</td>
                                    <td>—</td>
                                </tr>
                                <tr>
                                    <td>kVArh (Reactiva)</td>
                                    <td colspan="3" class="text-grey">No medido por los sensores</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="flex-row justify-between metrics-bar" :class="{ bonus: fp >= FP_LIMITE }">
                            <span>Factor de Potencia (supuesto): {{ numero(fp) }}%</span>
                            <span>Demanda Máxima: {{ kw(reporte.demandaMax) }}</span>
                        </div>
                    </div>

                    <!-- Costos y Desglose -->
                    <div class="split-row">
                        <div class="clickable-section half" :class="{ selected: selectedSection === 'costosMercado' }"
                            @click="selectedSection = 'costosMercado'">
                            <h3 class="section-title">Costos del Mercado</h3>
                            <p class="mock-line">Suministro <span>{{ dinero(cargos.suministro) }}</span></p>
                            <p class="mock-line">Distribución ({{ kw(reporte.recibo.kwDistribucion) }})
                                <span>{{ dinero(cargos.distribucion) }}</span></p>
                            <p class="mock-line">Transmisión <span>{{ dinero(cargos.transmision) }}</span></p>
                            <p class="mock-line">CENACE <span>{{ dinero(cargos.cenace) }}</span></p>
                            <p class="mock-line">Generación (Energía) <span>{{ dinero(cargos.generacion) }}</span></p>
                            <template v-if="reporte.recibo.generacionPorNivel">
                                <p v-for="nivel in NIVELES" :key="nivel" class="mock-line sub-line">
                                    · {{ nivel }} <span>{{ dinero(reporte.recibo.generacionPorNivel[nivel]) }}</span>
                                </p>
                            </template>
                            <p class="mock-line">Capacidad ({{ kw(reporte.recibo.kwCapacidad) }})
                                <span>{{ dinero(cargos.capacidad) }}</span></p>
                        </div>

                        <div class="clickable-section half" :class="{ selected: selectedSection === 'desglose' }"
                            @click="selectedSection = 'desglose'">
                            <h3 class="section-title">Desglose del importe</h3>
                            <p class="mock-line">Cargo Fijo <span>{{ dinero(reporte.recibo.cargoFijo) }}</span></p>
                            <p class="mock-line">Energía <span>{{ dinero(reporte.recibo.energiaImporte) }}</span></p>
                            <p v-if="ajusteFP.tipo === 'cargo'" class="mock-line">
                                Cargo {{ porcentaje(ajusteFP.porcentaje) }} (Bajo F.P.)
                                <span class="text-red">+{{ dinero(ajusteFP.monto) }}</span></p>
                            <p v-else-if="ajusteFP.tipo === 'bonificacion'" class="mock-line">
                                Bonific. {{ porcentaje(ajusteFP.porcentaje) }} (Buen F.P.)
                                <span class="text-green">-{{ dinero(-ajusteFP.monto) }}</span></p>
                            <p v-else class="mock-line">Ajuste F.P. <span>{{ dinero(0) }}</span></p>
                            <p class="mock-line">Subtotal <span>{{ dinero(reporte.recibo.subtotal) }}</span></p>
                            <p class="mock-line">IVA 16% <span>{{ dinero(reporte.recibo.iva) }}</span></p>
                            <p class="mock-line">DAP <span>{{ reporte.recibo.dap ? dinero(reporte.recibo.dap) :
                                'No incluido' }}</span></p>
                            <p class="mock-line"><strong>Total estimado <span>{{ dinero(reporte.recibo.total)
                            }}</span></strong></p>
                        </div>
                    </div>

                    <!-- Costo por dispositivo -->
                    <div class="clickable-section" :class="{ selected: selectedSection === 'dispositivos' }"
                        @click="selectedSection = 'dispositivos'">
                        <h3 class="section-title">Costo por Dispositivo Conectado</h3>
                        <div v-if="reporte.dispositivos.length === 0" class="text-caption text-grey">
                            No hay lecturas de dispositivos en este periodo.
                        </div>
                        <table v-else class="mock-table">
                            <thead>
                                <tr>
                                    <th>Dispositivo</th>
                                    <th>kWh</th>
                                    <th>%</th>
                                    <th>Costo estimado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="disp in reporte.dispositivos" :key="disp.codigo">
                                    <td>{{ disp.nombre }}</td>
                                    <td>{{ numero(disp.kwh) }}</td>
                                    <td>{{ numero(disp.porcentaje) }}%</td>
                                    <td>{{ dinero(disp.costo) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- ======================= REVERSO ======================= -->
                <div v-show="activeTab === 'reverso'" class="recibo-mockup">
                    <div class="marca-agua">ESTIMADO</div>

                    <div class="clickable-section" :class="{ selected: selectedSection === 'comportamientoDemanda' }"
                        @click="selectedSection = 'comportamientoDemanda'">
                        <h3 class="text-center">HISTORIAL DE DEMANDA Y COSTO ESTIMADO</h3>
                        <div class="flex-row items-center mt-10">
                            <div class="col-left w-50">
                                <table class="mock-table small-text">
                                    <thead>
                                        <tr>
                                            <th>Mes</th>
                                            <th>Demanda (kW)</th>
                                            <th>Costo est.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="h in reporte.historial" :key="`${h.anio}-${h.mes}`">
                                            <td>{{ mesCorto(h) }}</td>
                                            <td>{{ h.conDatos ? numero(h.demandaMax) : '—' }}</td>
                                            <td>{{ h.conDatos ? dinero(h.costo) : '—' }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-right w-50 chart-mockup fp-chart">
                                <svg viewBox="0 0 100 40" class="line-chart" preserveAspectRatio="none">
                                    <polyline fill="none" stroke="#00845a" stroke-width="2" :points="puntosDemanda" />
                                </svg>
                                <span class="chart-label">Demanda máxima por mes (kW)</span>
                            </div>
                        </div>
                    </div>

                    <div class="clickable-section" :class="{ selected: selectedSection === 'consumoHistorico' }"
                        @click="selectedSection = 'consumoHistorico'">
                        <h3 class="text-center">CONSUMO HISTÓRICO (kWh)</h3>

                        <div class="w-100 chart-mockup-bars">
                            <div v-for="h in reporte.historial" :key="`${h.anio}-${h.mes}`"
                                :class="['bar-group', { single: reporte.tarifa === 'GDMTO' }]">
                                <template v-if="reporte.tarifa === 'GDMTH'">
                                    <div class="bar base" :style="{ height: altura(h.energia.Base, maxNivel) }"
                                        :title="`Base: ${numero(h.energia.Base)} kWh`"></div>
                                    <div class="bar int" :style="{ height: altura(h.energia.Intermedio, maxNivel) }"
                                        :title="`Intermedia: ${numero(h.energia.Intermedio)} kWh`"></div>
                                    <div class="bar punta" :style="{ height: altura(h.energia.Punta, maxNivel) }"
                                        :title="`Punta: ${numero(h.energia.Punta)} kWh`"></div>
                                </template>
                                <div v-else class="bar base" :style="{ height: altura(h.kwh, maxTotal) }"
                                    :title="`${numero(h.kwh)} kWh`"></div>
                            </div>
                        </div>
                        <div class="flex-row bar-labels">
                            <span v-for="h in reporte.historial" :key="`${h.anio}-${h.mes}`">{{ mesCorto(h) }}</span>
                        </div>

                        <div class="legend flex-row justify-center mt-10">
                            <template v-if="reporte.tarifa === 'GDMTH'">
                                <span class="leg-item"><span class="box base"></span> Base</span>
                                <span class="leg-item"><span class="box int"></span> Intermedia</span>
                                <span class="leg-item"><span class="box punta"></span> Punta</span>
                            </template>
                            <span v-else class="leg-item"><span class="box base"></span> Energía Total Consumida</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PANEL DE INFORMACIÓN -->
            <div class="info-panel">
                <div v-if="selectedData" class="info-card">
                    <h2>{{ selectedData.title }}</h2>
                    <div class="info-content" v-html="selectedData.content"></div>
                </div>
                <div v-else class="empty-state">
                    <p>👆 Haz clic en cualquier sección del recibo para ver cómo se calculó la estimación.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { NIVELES, FP_LIMITE } from '@/utils/reciboCFE'

const props = defineProps({
    reporte: { type: Object, required: true },
    edificio: { type: Object, default: null }
})
const fp = defineModel('fp', { type: Number, default: 90 })
const emit = defineEmits(['cerrar'])

const activeTab = ref('frente')
const selectedSection = ref(null)

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre',
    'Noviembre', 'Diciembre']
const nombreMes = m => MESES[m - 1]
const mesCorto = h => `${MESES[h.mes - 1].slice(0, 3).toUpperCase()} ${String(h.anio).slice(2)}`

const fmtDinero = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })
const fmtNumero = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 })
const dinero = v => fmtDinero.format(v || 0)
const numero = v => fmtNumero.format(Number.isFinite(v) ? v : 0)
const kw = v => `${numero(v)} kW`
const porcentaje = v => `${numero(v * 100)}%`
const formatoFechaHora = d => d.toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })

const cargos = computed(() => props.reporte.recibo.cargos)
const ajusteFP = computed(() => props.reporte.recibo.ajusteFP)
const factorProyeccion = computed(() => props.reporte.diasMes / Math.max(props.reporte.diasTranscurridos, 1))

const maxNivel = computed(() => Math.max(1, ...props.reporte.historial.flatMap(h => NIVELES.map(n => h.energia[n]))))
const maxTotal = computed(() => Math.max(1, ...props.reporte.historial.map(h => h.kwh)))
const altura = (v, max) => `${Math.max((v / max) * 100, v > 0 ? 2 : 0)}%`

const puntosDemanda = computed(() => {
    const hist = props.reporte.historial
    const max = Math.max(1, ...hist.map(h => h.demandaMax))
    return hist.map((h, i) => `${(i / (hist.length - 1)) * 100},${38 - (h.demandaMax / max) * 34}`).join(' ')
})

const infoData = computed(() => ({
    datosPrincipales: {
        title: 'Datos del Periodo Estimado',
        content: `
      <ul>
        <li><strong>Periodo:</strong> Se toma desde el día 1 del mes hasta hoy (o el mes completo si ya terminó). CFE factura por su propio ciclo de lectura, que puede no coincidir con el mes calendario.</li>
        <li><strong>Total estimado:</strong> Lo que llevarías pagado con el consumo registrado hasta ahora. Incluye el cargo fijo de suministro completo.</li>
        <li><strong>Proyección al cierre:</strong> Extiende linealmente el ritmo de consumo actual a todos los días del mes.</li>
      </ul>`
    },
    lecturasHorarias: {
        title: 'Consumo y Demanda (GDMTH)',
        content: `
      <ul>
        <li><strong>Base, Intermedia, Punta:</strong> Se toma la lectura del inicio de cada hora (5:00, 6:00, 7:00...) y se clasifica según los horarios configurados en Monitoreo.</li>
        <li><strong>kW Max (Demanda):</strong> Se estima como la mayor lectura horaria del mes (kWh en 1 h = kW promedio). El medidor de CFE usa intervalos de 15 min, por lo que el valor real suele ser algo mayor.</li>
        <li><strong>kVArh / F.P.:</strong> Los sensores no miden energía reactiva, por eso el factor de potencia es un supuesto editable.</li>
      </ul>`
    },
    lecturasOrdinarias: {
        title: 'Consumo y Demanda (GDMTO)',
        content: `
      <ul>
        <li><strong>Energía (kWh):</strong> Suma de las lecturas del inicio de cada hora de los dispositivos conectados, sin importar el horario tarifario.</li>
        <li><strong>kW Max (Demanda):</strong> Mayor lectura horaria del mes (aproximación del kW promedio).</li>
        <li><strong>kVArh / F.P.:</strong> No se mide; el factor de potencia es un supuesto editable.</li>
      </ul>`
    },
    costosMercado: {
        title: 'Cómo se calculan los costos',
        content: `
      <ul>
        <li><strong>Distribución:</strong> $/kW × el menor entre la demanda máxima y kWh / (24 × días × factor de carga).</li>
        <li><strong>Capacidad:</strong> $/kW × demanda ${props.reporte.tarifa === 'GDMTH' ? 'en Punta (menor entre la demanda en Punta y kWh Punta / (horas Punta × días × factor de carga))' : 'facturable'}.</li>
        <li><strong>Transmisión y CENACE:</strong> $/kWh × energía total.</li>
        <li><strong>Generación:</strong> ${props.reporte.tarifa === 'GDMTH' ? 'Cada kWh se cobra con la cuota de su periodo (Base, Intermedia o Punta).' : 'Cuota única $/kWh para toda la energía.'}</li>
        <li>Las cuotas son de referencia y deben actualizarse con las publicadas por CFE cada mes.</li>
      </ul>`
    },
    desglose: {
        title: 'Desglose y Factor de Potencia',
        content: `
      <ul>
        <li><strong>F.P. menor a 90%:</strong> Recargo = 3/5 × (90/FP − 1), máximo 120%.</li>
        <li><strong>F.P. de 90% o más:</strong> Bonificación = 1/4 × (1 − 90/FP), máximo 2.5%.</li>
        <li><strong>DAP:</strong> El Derecho de Alumbrado Público depende de cada municipio, por eso no se incluye en la estimación.</li>
      </ul>`
    },
    dispositivos: {
        title: 'Costo por Dispositivo',
        content: `
      <ul>
        <li>A cada dispositivo se le asigna el costo de generación de su propia energía (según el horario en que la consumió) más la parte proporcional, por kWh, del resto de cargos e IVA.</li>
        <li>La suma de todos los dispositivos es igual al total estimado.</li>
      </ul>`
    },
    comportamientoDemanda: {
        title: 'Historial de Demanda',
        content: `
      <ul>
        <li>Muestra la demanda máxima estimada y el costo estimado de los últimos 6 meses con las cuotas y horarios actuales.</li>
        <li>Picos inusuales pueden indicar equipos encendidos simultáneamente o en mal estado.</li>
      </ul>`
    },
    consumoHistorico: {
        title: 'Comportamiento de Consumo',
        content: `
      <ul>
        <li><strong>En GDMTH:</strong> El objetivo es mover la operación pesada a Base/Intermedia para reducir la barra roja (Punta).</li>
        <li><strong>En GDMTO:</strong> El objetivo es reducir la barra mes a mes con prácticas generales de ahorro.</li>
      </ul>`
    }
}))

const selectedData = computed(() => selectedSection.value ? infoData.value[selectedSection.value] : null)
</script>

<style scoped>
.recibo-container {
    padding: 20px;
    font-family: 'Arial', sans-serif;
    color: #333;
    background: #fff;
}

.estimado-disclaimer {
    display: flex;
    align-items: flex-start;
    background-color: #fef3c7;
    color: #92400e;
    padding: 12px;
    border-radius: 8px;
    border-left: 5px solid #d97706;
    margin-bottom: 12px;
    font-size: 0.95rem;
}

.cfe-disclaimer {
    background-color: #e6f4ea;
    color: #00845a;
    padding: 12px;
    border-radius: 8px;
    border-left: 5px solid #00845a;
    margin-bottom: 20px;
    font-size: 0.85rem;
}

.header {
    margin-bottom: 25px;
    border-bottom: 2px solid #eee;
    padding-bottom: 15px;
}

.header-titles h1 {
    margin: 0;
    color: #00845a;
}

.subtitle {
    margin: 5px 0 15px 0;
    color: #666;
    font-size: 1.1rem;
}

.controls-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
    background: #f8fafc;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.toggle-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.toggle-label {
    font-weight: bold;
    color: #475569;
    font-size: 0.9rem;
}

.fp-input {
    width: 90px;
}

.tab-btn {
    padding: 8px 16px;
    border: 1px solid #cbd5e1;
    background-color: #fff;
    cursor: pointer;
    border-radius: 6px;
    font-weight: bold;
    transition: all 0.2s;
    color: #475569;
}

.tab-btn:hover {
    background-color: #f1f5f9;
}

.tab-btn.active {
    background-color: #00845a;
    color: white;
    border-color: #00845a;
}

.main-content {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 30px;
    align-items: start;
}

.recibo-mockup {
    position: relative;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
}

.marca-agua {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-25deg);
    font-size: 5rem;
    font-weight: bold;
    color: rgba(217, 119, 6, 0.08);
    pointer-events: none;
    white-space: nowrap;
    z-index: 0;
}

.clickable-section {
    position: relative;
    border: 2px dashed transparent;
    padding: 15px;
    border-radius: 8px;
    background-color: rgba(250, 250, 250, 0.85);
    cursor: pointer;
    transition: all 0.2s;
}

.clickable-section:hover {
    border-color: #4ade80;
    background-color: rgba(240, 253, 244, 0.9);
}

.clickable-section.selected {
    border-color: #00845a;
    background-color: rgba(230, 244, 234, 0.9);
    box-shadow: 0 0 0 2px rgba(0, 132, 90, 0.2);
}

.flex-row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.text-center {
    text-align: center;
}

.items-center {
    align-items: center;
}

.justify-between {
    justify-content: space-between;
}

.justify-center {
    justify-content: center;
}

.w-50 {
    width: 50%;
}

.w-100 {
    width: 100%;
}

.mt-10 {
    margin-top: 10px;
}

.split-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

h2,
h3 {
    margin-top: 0;
    color: #00845a;
}

.col-left p {
    font-size: 0.85rem;
    margin: 4px 0;
}

.mock-line {
    font-size: 0.85rem;
    color: #555;
    margin: 4px 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px dotted #ccc;
}

.sub-line {
    padding-left: 12px;
    font-size: 0.75rem;
    color: #777;
}

.total-pagar {
    font-size: 0.9rem;
    font-weight: bold;
}

.total-pagar span {
    font-size: 1.8rem;
    color: #333;
}

.proyeccion {
    font-size: 0.8rem;
    color: #64748b;
    margin-top: 6px;
}

.sello-preliminar {
    display: inline-block;
    margin-top: 8px;
    padding: 2px 10px;
    border: 2px solid #d97706;
    border-radius: 4px;
    color: #d97706;
    font-weight: bold;
    font-size: 0.75rem;
    letter-spacing: 2px;
    transform: rotate(-4deg);
}

.text-red {
    color: #dc2626;
    font-weight: bold;
}

.text-green {
    color: #16a34a;
    font-weight: bold;
}

.mock-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    margin-bottom: 10px;
}

.mock-table th {
    background-color: #00845a;
    color: white;
    padding: 6px;
    text-align: left;
}

.mock-table td {
    padding: 6px;
    border-bottom: 1px solid #eee;
}

.small-text {
    font-size: 0.75rem;
}

.highlight-row {
    background-color: #fef08a;
    font-weight: bold;
}

.metrics-bar {
    font-size: 0.85rem;
    font-weight: bold;
    background: #fee2e2;
    padding: 8px;
    border-radius: 4px;
    color: #991b1b;
}

.metrics-bar.bonus {
    background: #dcfce7;
    color: #166534;
}

.chart-mockup {
    height: 120px;
    border-left: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    padding: 5px;
    display: flex;
    align-items: flex-end;
    position: relative;
}

.fp-chart {
    justify-content: center;
    overflow: visible;
}

.line-chart {
    width: 100%;
    height: 100%;
}

.chart-label {
    position: absolute;
    bottom: -20px;
    font-size: 0.65rem;
    color: #666;
}

.chart-mockup-bars {
    display: flex;
    justify-content: space-around;
    height: 140px;
    border-bottom: 2px solid #ccc;
    padding-top: 20px;
    align-items: flex-end;
}

.bar-group {
    display: flex;
    gap: 2px;
    align-items: flex-end;
    height: 100%;
    width: 14%;
}

.bar-group.single {
    justify-content: center;
}

.bar-group.single .bar {
    width: 70%;
    flex-grow: 0;
}

.bar-group .bar {
    flex-grow: 1;
    transition: height 0.4s ease;
}

.bar-labels {
    justify-content: space-around;
    font-size: 0.7rem;
    color: #666;
    margin-top: 4px;
}

.base {
    background-color: #3b82f6;
}

.int {
    background-color: #eab308;
}

.punta {
    background-color: #ef4444;
}

.legend {
    font-size: 0.8rem;
    font-weight: bold;
    gap: 15px;
}

.leg-item {
    display: flex;
    align-items: center;
    gap: 5px;
}

.box {
    width: 12px;
    height: 12px;
    display: inline-block;
    border-radius: 2px;
}

.info-panel {
    position: sticky;
    top: 20px;
}

.info-card {
    background-color: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.info-card h2 {
    border-bottom: 2px solid #00845a;
    padding-bottom: 10px;
    margin-bottom: 15px;
    color: #00845a;
}

.info-content :deep(ul) {
    padding-left: 20px;
    margin-bottom: 10px;
}

.info-content :deep(li) {
    margin-bottom: 12px;
    line-height: 1.5;
}

.empty-state {
    background-color: #f8fafc;
    border: 2px dashed #cbd5e1;
    border-radius: 12px;
    padding: 40px 20px;
    text-align: center;
    color: #64748b;
    font-size: 1.1rem;
}

@media (max-width: 900px) {
    .main-content {
        grid-template-columns: 1fr;
    }

    .info-panel {
        position: static;
    }

    .split-row {
        grid-template-columns: 1fr;
    }

    .flex-row:not(.bar-labels):not(.legend):not(.metrics-bar) {
        flex-direction: column;
    }

    .w-50 {
        width: 100%;
    }
}
</style>
