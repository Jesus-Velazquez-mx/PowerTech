<template>
    <div class="recibo-container">
        <v-btn icon="mdi-arrow-left" variant="text" color="blue-darken-2" @click="$router.back()"></v-btn>
        <span class="text-subtitle-1 font-weight-bold ml-2">Volver a la selección</span>
        <!-- Aviso Oficial -->
        <div class="cfe-disclaimer">
            <strong>Aviso de Autoría:</strong> Toda la información, definiciones y conceptos mostrados en esta vista son
            propiedad intelectual de la <strong>Comisión Federal de Electricidad (CFE)</strong>. Esta es una
            representación didáctica de tarifas de Media Tensión.
        </div>

        <!-- Controles de Navegación -->
        <header class="header">
            <div class="header-titles">
                <h1>Información de Recibo Empresarial</h1>
                <p class="subtitle">Modalidad: <strong>{{ activeTarifa === 'GDMTH' ? 'Gran Demanda Horaria (>= 100kW)' :
                    'Gran Demanda Ordinaria (< 100kW)' }}</strong>
                </p>
            </div>

            <div class="controls-wrapper">
                <div class="toggle-group tarifa-toggle">
                    <span class="toggle-label">Tarifa:</span>
                    <button :class="['tab-btn', { active: activeTarifa === 'GDMTH' }]"
                        @click="setTarifa('GDMTH')">GDMTH</button>
                    <button :class="['tab-btn', { active: activeTarifa === 'GDMTO' }]"
                        @click="setTarifa('GDMTO')">GDMTO</button>
                </div>
                <div class="toggle-group vista-toggle">
                    <span class="toggle-label">Vista:</span>
                    <button :class="['tab-btn', { active: activeTab === 'frente' }]"
                        @click="activeTab = 'frente'">Frente</button>
                    <button :class="['tab-btn', { active: activeTab === 'reverso' }]"
                        @click="activeTab = 'reverso'">Reverso</button>
                </div>
            </div>
        </header>

        <div class="main-content">

            <!-- LADO IZQUIERDO: EL RECIBO INTERACTIVO -->
            <div class="recibo-wrapper">

                <!-- ======================= FRENTE ======================= -->
                <div v-show="activeTab === 'frente'" class="recibo-mockup">

                    <!-- Datos Principales (Dinámico) -->
                    <div class="clickable-section" :class="{ selected: selectedSection === 'datosPrincipales' }"
                        @click="selectSection('datosPrincipales')">
                        <div class="flex-row">
                            <div class="col-left">
                                <h2>{{ activeTarifa === `GDMTH` ? `EMPRESA MANUFACTURERA S.A. DE C.V.` : `PLAZA
                                    COMERCIAL EL CENTRO` }}</h2>
                                <p class="mock-text">Parque Industrial Mza 3 Lote 10...</p>
                                <p><strong>NO. DE SERVICIO:</strong> {{ activeTarifa === 'GDMTH' ? '987654321000' :
                                    '123456789000' }}</p>
                                <p><strong>TARIFA:</strong> {{ activeTarifa }} &nbsp;&nbsp;
                                    <strong>MULTIPLICADOR:</strong> {{ activeTarifa === 'GDMTH' ? '120' : '60' }}
                                </p>
                                <p><strong>CARGA INSTALADA:</strong> {{ activeTarifa === 'GDMTH' ? '500 kW' : '95 kW' }}
                                    &nbsp;&nbsp; <strong>DEMANDA CONTRATADA:</strong> {{ activeTarifa === 'GDMTH' ?
                                        '450kW' : '85 kW' }}</p>
                            </div>
                            <div class="col-right text-center">
                                <p class="total-pagar">TOTAL A PAGAR:<br><span>{{ activeTarifa === 'GDMTH' ? '$84,250' :
                                    '$35,180' }}</span></p>
                            </div>
                        </div>
                    </div>

                    <!-- Lecturas (GDMTH) -->
                    <div v-if="activeTarifa === 'GDMTH'" class="clickable-section"
                        :class="{ selected: selectedSection === 'lecturasHorarias' }"
                        @click="selectSection('lecturasHorarias')">
                        <h3 class="section-title">Lecturas de Energía y Demanda</h3>
                        <table class="mock-table">
                            <thead>
                                <tr>
                                    <th>Concepto</th>
                                    <th>Lectura Actual</th>
                                    <th>Lectura Anterior</th>
                                    <th>Diferencia</th>
                                    <th>Totales</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>kWh Base</td>
                                    <td>15420</td>
                                    <td>14100</td>
                                    <td>1320</td>
                                    <td>158,400</td>
                                </tr>
                                <tr>
                                    <td>kWh Intermedia</td>
                                    <td>22100</td>
                                    <td>20500</td>
                                    <td>1600</td>
                                    <td>192,000</td>
                                </tr>
                                <tr>
                                    <td>kWh Punta</td>
                                    <td>08500</td>
                                    <td>08100</td>
                                    <td>400</td>
                                    <td>48,000</td>
                                </tr>
                                <tr class="highlight-row">
                                    <td>kW Max (Demanda)</td>
                                    <td>3.50</td>
                                    <td>0.00</td>
                                    <td>3.50</td>
                                    <td>420 kW</td>
                                </tr>
                                <tr>
                                    <td>kVArh (Reactiva)</td>
                                    <td>05100</td>
                                    <td>04600</td>
                                    <td>500</td>
                                    <td>60,000</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="flex-row justify-between metrics-bar">
                            <span>Factor de Potencia: 89.44%</span>
                            <span>Demanda Máxima: 420 kW</span>
                        </div>
                    </div>

                    <!-- Lecturas (GDMTO) -->
                    <div v-if="activeTarifa === 'GDMTO'" class="clickable-section"
                        :class="{ selected: selectedSection === 'lecturasOrdinarias' }"
                        @click="selectSection('lecturasOrdinarias')">
                        <h3 class="section-title">Lecturas de Energía y Demanda</h3>
                        <table class="mock-table">
                            <thead>
                                <tr>
                                    <th>Concepto</th>
                                    <th>Lectura Actual</th>
                                    <th>Lectura Anterior</th>
                                    <th>Diferencia</th>
                                    <th>Totales</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Energía (kWh)</td>
                                    <td>05800</td>
                                    <td>05450</td>
                                    <td>350</td>
                                    <td>21,000</td>
                                </tr>
                                <tr class="highlight-row">
                                    <td>kW Max (Demanda)</td>
                                    <td>1.30</td>
                                    <td>0.00</td>
                                    <td>1.30</td>
                                    <td>78 kW</td>
                                </tr>
                                <tr>
                                    <td>kVArh (Reactiva)</td>
                                    <td>00200</td>
                                    <td>00150</td>
                                    <td>50</td>
                                    <td>3,000</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="flex-row justify-between metrics-bar bonus">
                            <span>Factor de Potencia: 98.90%</span>
                            <span>Demanda Máxima: 78 kW</span>
                        </div>
                    </div>

                    <!-- Costos y Desglose (Dinámico) -->
                    <div class="split-row">
                        <div class="clickable-section half" :class="{ selected: selectedSection === 'costosMercado' }"
                            @click="selectSection('costosMercado')">
                            <h3 class="section-title">Costos del Mercado</h3>
                            <p class="mock-line">Suministro <span>{{ activeTarifa === 'GDMTH' ? '$520.00' : '$520.00'
                            }}</span></p>
                            <p class="mock-line">Distribución <span>{{ activeTarifa === 'GDMTH' ? '$18,450.00' :
                                '$6,200.00' }}</span></p>
                            <p class="mock-line">Transmisión <span>{{ activeTarifa === 'GDMTH' ? '$6,800.00' :
                                '$2,100.00' }}</span></p>
                            <p class="mock-line">CENACE <span>{{ activeTarifa === 'GDMTH' ? '$450.00' : '$120.00'
                            }}</span></p>
                            <p class="mock-line">Generación (Energía) <span>{{ activeTarifa === 'GDMTH' ? '$38,500.00' :
                                '$17,800.00' }}</span></p>
                            <p class="mock-line">Capacidad <span>{{ activeTarifa === 'GDMTH' ? '$9,800.00' : '$3,588.00'
                            }}</span></p>
                        </div>

                        <div class="clickable-section half" :class="{ selected: selectedSection === 'desglose' }"
                            @click="selectSection('desglose')">
                            <h3 class="section-title">Desglose del importe</h3>
                            <p class="mock-line">Cargo Fijo <span>$520.00</span></p>
                            <p class="mock-line">Energía <span>{{ activeTarifa === 'GDMTH' ? '$45,300.00' : '$30,100.00'
                            }}</span></p>
                            <p v-if="activeTarifa === 'GDMTH'" class="mock-line">Cargo 2% (Bajo F.P.) <span
                                    class="text-red">+$1,450.00</span></p>
                            <p v-else class="mock-line">Bonific. 2% (Buen F.P.) <span class="text-green">-$602.00</span>
                            </p>
                            <p class="mock-line">Subtotal <span>{{ activeTarifa === 'GDMTH' ? '$72,520.00' :
                                '$30,327.00' }}</span></p>
                            <p class="mock-line">IVA 16% <span>{{ activeTarifa === 'GDMTH' ? '$11,603.20' : '$4,852.32'
                            }}</span></p>
                            <p class="mock-line">DAP <span>{{ activeTarifa === 'GDMTH' ? '$126.80' : '$0.68' }}</span>
                            </p>
                            <p class="mock-line"><strong>Total a pagar <span>{{ activeTarifa === 'GDMTH' ? '$84,250.00'
                                : '$35,180.00' }}</span></strong></p>
                        </div>
                    </div>
                </div>

                <!-- ======================= REVERSO ======================= -->
                <div v-show="activeTab === 'reverso'" class="recibo-mockup">

                    <!-- Comportamiento de Demanda (Común, datos ajustados) -->
                    <div class="clickable-section" :class="{ selected: selectedSection === 'comportamientoDemanda' }"
                        @click="selectSection('comportamientoDemanda')">
                        <h3 class="text-center">HISTORIAL DE DEMANDA Y FACTOR DE POTENCIA</h3>
                        <div class="flex-row items-center mt-10">
                            <div class="col-left w-50">
                                <table class="mock-table small-text">
                                    <thead>
                                        <tr>
                                            <th>Mes</th>
                                            <th>Demanda (kW)</th>
                                            <th>F.P. (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="activeTarifa === 'GDMTH'">
                                        <tr>
                                            <td>ENE 26</td>
                                            <td>415</td>
                                            <td>91.2</td>
                                        </tr>
                                        <tr>
                                            <td>FEB 26</td>
                                            <td>420</td>
                                            <td>89.4</td>
                                        </tr>
                                        <tr>
                                            <td>MAR 26</td>
                                            <td>390</td>
                                            <td>94.5</td>
                                        </tr>
                                        <tr>
                                            <td>ABR 26</td>
                                            <td>450</td>
                                            <td>88.1</td>
                                        </tr>
                                    </tbody>
                                    <tbody v-else>
                                        <tr>
                                            <td>ENE 26</td>
                                            <td>75</td>
                                            <td>98.2</td>
                                        </tr>
                                        <tr>
                                            <td>FEB 26</td>
                                            <td>78</td>
                                            <td>98.9</td>
                                        </tr>
                                        <tr>
                                            <td>MAR 26</td>
                                            <td>72</td>
                                            <td>97.5</td>
                                        </tr>
                                        <tr>
                                            <td>ABR 26</td>
                                            <td>80</td>
                                            <td>99.1</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-right w-50 chart-mockup fp-chart">
                                <svg v-if="activeTarifa === 'GDMTH'" viewBox="0 0 100 40" class="line-chart">
                                    <polyline fill="none" stroke="#00845a" stroke-width="2"
                                        points="0,20 25,25 50,10 75,30 100,15" />
                                    <line x1="0" y1="20" x2="100" y2="20" stroke="red" stroke-dasharray="2"
                                        stroke-width="1" />
                                </svg>
                                <svg v-else viewBox="0 0 100 40" class="line-chart">
                                    <polyline fill="none" stroke="#00845a" stroke-width="2"
                                        points="0,5 25,4 50,7 75,3 100,6" />
                                    <line x1="0" y1="20" x2="100" y2="20" stroke="red" stroke-dasharray="2"
                                        stroke-width="1" />
                                </svg>
                                <span class="chart-label">Límite penalización F.P. (90%)</span>
                            </div>
                        </div>
                    </div>

                    <!-- Consumo Histórico (GDMTH = Barras Divididas | GDMTO = Barras Sólidas) -->
                    <div class="clickable-section" :class="{ selected: selectedSection === 'consumoHistorico' }"
                        @click="selectSection('consumoHistorico')">
                        <h3 class="text-center">CONSUMO HISTÓRICO (kWh)</h3>

                        <div v-if="activeTarifa === 'GDMTH'">
                            <div class="flex-row items-center">
                                <div class="w-100 chart-mockup-bars">
                                    <div class="bar-group">
                                        <div class="bar base" style="height: 60%"></div>
                                        <div class="bar int" style="height: 70%"></div>
                                        <div class="bar punta" style="height: 30%"></div>
                                    </div>
                                    <div class="bar-group">
                                        <div class="bar base" style="height: 55%"></div>
                                        <div class="bar int" style="height: 65%"></div>
                                        <div class="bar punta" style="height: 45%"></div>
                                    </div>
                                    <div class="bar-group">
                                        <div class="bar base" style="height: 65%"></div>
                                        <div class="bar int" style="height: 75%"></div>
                                        <div class="bar punta" style="height: 25%"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="legend flex-row justify-center mt-10">
                                <span class="leg-item"><span class="box base"></span> Base</span>
                                <span class="leg-item"><span class="box int"></span> Intermedia</span>
                                <span class="leg-item"><span class="box punta"></span> Punta</span>
                            </div>
                        </div>

                        <div v-if="activeTarifa === 'GDMTO'">
                            <div class="flex-row items-center">
                                <div class="w-100 chart-mockup-bars">
                                    <div class="bar-group single">
                                        <div class="bar base" style="height: 80%"></div>
                                    </div>
                                    <div class="bar-group single">
                                        <div class="bar base" style="height: 65%"></div>
                                    </div>
                                    <div class="bar-group single">
                                        <div class="bar base" style="height: 90%"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="legend flex-row justify-center mt-10">
                                <span class="leg-item"><span class="box base"></span> Energía Total Consumida</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <!-- LADO DERECHO: PANEL DE INFORMACIÓN (COMÚN) -->
            <div class="info-panel">
                <div v-if="selectedData" class="info-card">
                    <h2>{{ selectedData.title }}</h2>
                    <div class="info-content" v-html="selectedData.content"></div>
                </div>
                <div v-else class="empty-state">
                    <p>👆 Selecciona una tarifa en el menú superior y haz clic en cualquier sección resaltada del recibo
                        para entender cómo funciona la facturación comercial.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const activeTab = ref('frente')
const activeTarifa = ref('GDMTH')
const selectedSection = ref(null)

// Limpiar la selección al cambiar de pestaña o de tarifa
const setTarifa = (tarifa) => {
    activeTarifa.value = tarifa
    selectedSection.value = null
}
watch(activeTab, () => { selectedSection.value = null })

const infoData = {
    // --- FRENTE ---
    datosPrincipales: {
        title: 'Datos de la Industria y Tarifa',
        content: `
      <ul>
        <li><strong>GDMTH (>= 100 kW):</strong> Tarifa para grandes industrias. El costo de la energía varía según la hora del día.</li>
        <li><strong>GDMTO (< 100 kW):</strong> Tarifa Ordinaria para comercios o pequeñas industrias. El costo de la energía es el mismo a cualquier hora.</li>
        <li><strong>Demanda Contratada:</strong> Límite de potencia reservado con CFE. Rebasarlo en GDMTO o GDMTH puede generar ajustes tarifarios severos.</li>
      </ul>
    `
    },
    lecturasHorarias: {
        title: 'Lecturas, Demanda y Reactiva (GDMTH)',
        content: `
      <p>Facturación horaria (GDMTH):</p>
      <ul>
        <li><strong>Base, Intermedia, Punta:</strong> El medidor registra a qué hora se consumió la energía. Las horas "Punta" (típicamente de 8 PM a 10 PM) tienen el costo más alto.</li>
        <li><strong>kW Max (Demanda):</strong> El pico de potencia instantánea más alto del mes.</li>
        <li><strong>kVArh:</strong> Energía reactiva, usada para calcular el Factor de Potencia.</li>
      </ul>
    `
    },
    lecturasOrdinarias: {
        title: 'Lecturas, Demanda y Reactiva (GDMTO)',
        content: `
      <p>Facturación plana (GDMTO):</p>
      <ul>
        <li><strong>Energía (kWh):</strong> A diferencia de la GDMTH, aquí no importa a qué hora se consume la electricidad; toda se cobra al mismo precio.</li>
        <li><strong>kW Max (Demanda Máxima):</strong> Aunque la energía tenga precio único, CFE sí vigila cuál fue el pico más alto de exigencia a la red eléctrica.</li>
      </ul>
    `
    },
    costosMercado: {
        title: 'Costos del Mercado Eléctrico',
        content: `
      <ul>
        <li><strong>Distribución y Transmisión:</strong> Cobro por el uso de la infraestructura (cables y torres) de CFE. Se calcula con base en la Demanda Máxima (kW), lo que hace crucial evitar encender todos los equipos al mismo tiempo.</li>
        <li><strong>Capacidad:</strong> Cargo que asegura que CFE tenga la infraestructura lista para soportar los picos de consumo del negocio.</li>
      </ul>
    `
    },
    desglose: {
        title: 'Desglose y Factor de Potencia',
        content: `
      <ul>
        <li><strong>Factor de Potencia (Límite 90%):</strong> Si el negocio tiene motores eficientes y capacitores (ej. GDMTO al 98.9%), CFE bonifica dinero a favor restándolo del total. Si los motores son viejos o ineficientes (ej. GDMTH al 89.4%), se cobra una multa.</li>
      </ul>
    `
    },
    // --- REVERSO ---
    comportamientoDemanda: {
        title: 'Historial de Demanda y F.P.',
        content: `
      <ul>
        <li><strong>Registro de Demanda Máxima:</strong> Permite vigilar tendencias operativas. Picos inusuales pueden indicar equipos en mal estado o malas prácticas operativas (como encender toda la maquinaria simultáneamente en el turno matutino).</li>
        <li><strong>Comportamiento del F.P.:</strong> Crucial para programar mantenimientos a los bancos de capacitores antes de caer por debajo del límite del 90%.</li>
      </ul>
    `
    },
    consumoHistorico: {
        title: 'Comportamiento de Consumo',
        content: `
      <ul>
        <li><strong>En GDMTH:</strong> Se muestran tres colores. El objetivo es operar la maquinaria pesada en los horarios Base/Intermedio para reducir la barra roja (Punta).</li>
        <li><strong>En GDMTO:</strong> Se muestra una barra única. El objetivo es implementar prácticas de ahorro de energía generales (apagar equipos sin uso, iluminación LED, etc.) para reducir la barra mes a mes.</li>
      </ul>
    `
    }
}

const selectedData = computed(() => {
    return selectedSection.value ? infoData[selectedSection.value] : null
})

const selectSection = (sectionId) => {
    selectedSection.value = sectionId
}
</script>

<style scoped>
/* Estilos Generales */
.recibo-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Arial', sans-serif;
    color: #333;
}

.cfe-disclaimer {
    background-color: #e6f4ea;
    color: #00845a;
    padding: 12px;
    border-radius: 8px;
    border-left: 5px solid #00845a;
    margin-bottom: 20px;
    font-size: 0.95rem;
}

/* Controles de Header Modernizados */
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
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.clickable-section {
    border: 2px dashed transparent;
    padding: 15px;
    border-radius: 8px;
    background-color: #fafafa;
    cursor: pointer;
    transition: all 0.2s;
}

.clickable-section:hover {
    border-color: #4ade80;
    background-color: #f0fdf4;
}

.clickable-section.selected {
    border-color: #00845a;
    background-color: #e6f4ea;
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

.mock-text,
.mock-line {
    font-size: 0.85rem;
    color: #555;
    margin: 4px 0;
}

.mock-line {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px dotted #ccc;
}

.total-pagar {
    font-size: 0.9rem;
    font-weight: bold;
}

.total-pagar span {
    font-size: 1.8rem;
    color: #333;
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

/* Estilos de gráficas industriales */
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
    width: 25%;
}

.bar-group.single {
    justify-content: center;
    width: 20%;
}

.bar-group.single .bar {
    width: 70%;
    flex-grow: 0;
}

.bar-group .bar {
    flex-grow: 1;
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

/* Panel de Información */
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

    .flex-row {
        flex-direction: column;
    }

    .w-50 {
        width: 100%;
    }
}
</style>