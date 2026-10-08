// Cálculo ESTIMADO del recibo de CFE para tarifas de Media Tensión (GDMTH / GDMTO).
// Cuotas oficiales de CFE para OCTUBRE 2026, división tarifaria NOROESTE (Culiacán, Sinaloa).
// CFE las publica cada mes; actualízalas desde:
//   GDMTH: https://app.cfe.mx/Aplicaciones/CCFE/Tarifas/TarifasCREIndustria/Tarifas/GranDemandaMTH.aspx
//   GDMTO: https://app.cfe.mx/Aplicaciones/CCFE/Tarifas/TarifasCREIndustria/Tarifas/GranDemandaMTO.aspx
// Las cuotas publicadas ya integran Transmisión, CENACE, Suministrador y SCnMEM,
// por eso esos cargos van en 0 y no se suman aparte.

export const PERIODO_TARIFAS = 'Octubre 2026 · División Noroeste';

export const TARIFAS_REFERENCIA = {
    GDMTH: {
        suministro: 197.77,       // $/mes (cargo fijo)
        distribucion: 90.85,      // $/kW
        transmision: 0,           // incluido en las cuotas de energía
        cenace: 0,                // incluido en las cuotas de energía
        capacidad: 377.17,        // $/kW
        generacion: { Base: 0.9408, Intermedio: 1.5035, Punta: 1.6658 }, // $/kWh
        factorCarga: 0.57
    },
    GDMTO: {
        suministro: 197.77,
        distribucion: 90.85,
        transmision: 0,
        cenace: 0,
        capacidad: 327.96,
        generacion: 1.2610,
        factorCarga: 0.55
    }
};

export const IVA = 0.16;
// Derecho de Alumbrado Público: depende del municipio, por eso no se incluye por defecto
export const DAP_PORCENTAJE = 0;
export const FP_LIMITE = 90;

export const NIVELES = ['Base', 'Intermedio', 'Punta'];

const minutos = (hhmm) => {
    if (hhmm === '23:59') return 24 * 60;
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
};

// Horas al día que abarcan los bloques de un nivel (ej. Punta 20:00-22:00 => 2)
export function horasDeNivel(horarios, nivel) {
    const item = horarios.find(h => h.nivel === nivel);
    if (!item) return 0;
    return item.bloques.reduce((acc, b) => {
        const ini = minutos(b.inicio);
        const fin = minutos(b.fin);
        return acc + (fin > ini ? fin - ini : 24 * 60 - ini + fin);
    }, 0) / 60;
}

// Ajuste por factor de potencia (fórmulas CFE): recargo si F.P. < 90%, bonificación si F.P. >= 90%
export function ajusteFactorPotencia(fp) {
    if (!fp || fp <= 0) return { tipo: 'ninguno', porcentaje: 0 };
    if (fp < FP_LIMITE) {
        return { tipo: 'cargo', porcentaje: Math.min((3 / 5) * (FP_LIMITE / fp - 1), 1.2) };
    }
    const bonif = Math.min((1 / 4) * (1 - FP_LIMITE / fp), 0.025);
    return { tipo: bonif > 0 ? 'bonificacion' : 'ninguno', porcentaje: bonif };
}

/**
 * energia: { Base, Intermedio, Punta } en kWh
 * demandaMax / demandaPunta: kW
 * dias: días del periodo facturado (o transcurridos)
 */
export function calcularRecibo({ tarifa, energia, demandaMax, demandaPunta, dias, horasPunta, fp }) {
    const t = TARIFAS_REFERENCIA[tarifa];
    const kwh = energia.Base + energia.Intermedio + energia.Punta;
    const d = Math.max(dias, 1);

    // Demanda facturable: el menor entre la demanda máxima medida y la demanda promedio ajustada por factor de carga
    const kwDistribucion = Math.min(demandaMax, kwh / (24 * d * t.factorCarga));
    const kwCapacidad = tarifa === 'GDMTH'
        ? (horasPunta > 0 ? Math.min(demandaPunta, energia.Punta / (horasPunta * d * t.factorCarga)) : 0)
        : kwDistribucion;

    const generacionPorNivel = tarifa === 'GDMTH'
        ? Object.fromEntries(NIVELES.map(n => [n, energia[n] * t.generacion[n]]))
        : null;
    const generacion = generacionPorNivel
        ? NIVELES.reduce((acc, n) => acc + generacionPorNivel[n], 0)
        : kwh * t.generacion;

    const cargos = {
        suministro: t.suministro,
        distribucion: kwDistribucion * t.distribucion,
        transmision: kwh * t.transmision,
        cenace: kwh * t.cenace,
        generacion,
        capacidad: kwCapacidad * t.capacidad
    };

    const importe = Object.values(cargos).reduce((a, b) => a + b, 0);
    const ajuste = ajusteFactorPotencia(fp);
    const montoFP = ajuste.tipo === 'cargo' ? importe * ajuste.porcentaje
        : ajuste.tipo === 'bonificacion' ? -importe * ajuste.porcentaje : 0;
    const subtotal = importe + montoFP;
    const iva = subtotal * IVA;
    const dap = subtotal * DAP_PORCENTAJE;

    return {
        kwh,
        kwDistribucion,
        kwCapacidad,
        cargos,
        generacionPorNivel,
        cargoFijo: cargos.suministro,
        energiaImporte: importe - cargos.suministro,
        ajusteFP: { ...ajuste, monto: montoFP },
        subtotal,
        iva,
        dap,
        total: subtotal + iva + dap
    };
}

const num = v => parseFloat(v || 0);

// Arma el reporte completo a partir de la respuesta de /monitoring/recibo/:id
export function construirReporte(datos, { tarifa, horarios, mes, anio, fp, hoy = new Date() }) {
    const diasMes = new Date(anio, mes, 0).getDate();
    const esMesActual = hoy.getFullYear() === anio && hoy.getMonth() + 1 === mes;
    const diasTranscurridos = esMesActual ? hoy.getDate() : diasMes;
    const horasPunta = horasDeNivel(horarios, 'Punta');

    const historialCrudo = datos?.historial || [];
    const dispositivosCrudos = datos?.dispositivos || [];

    const filaMes = (a, m) => historialCrudo.find(h => Number(h.anio) === a && Number(h.mes) === m);
    const energiaDe = fila => ({ Base: num(fila?.base), Intermedio: num(fila?.intermedio), Punta: num(fila?.punta) });

    const actual = filaMes(anio, mes);
    const energia = energiaDe(actual);
    const demandaMax = num(actual?.demandaMax);
    const demandaPunta = num(actual?.demandaPunta);

    const recibo = calcularRecibo({ tarifa, energia, demandaMax, demandaPunta, dias: diasTranscurridos, horasPunta, fp });

    // Proyección lineal al cierre del mes con el ritmo de consumo actual
    const factor = diasMes / Math.max(diasTranscurridos, 1);
    const proyeccion = calcularRecibo({
        tarifa,
        energia: Object.fromEntries(NIVELES.map(n => [n, energia[n] * factor])),
        demandaMax, demandaPunta, dias: diasMes, horasPunta, fp
    });

    // Costo por dispositivo: su energía de generación + la parte proporcional (por kWh) del resto de cargos
    const t = TARIFAS_REFERENCIA[tarifa];
    const resto = recibo.subtotal - recibo.cargos.generacion;
    const dispositivos = dispositivosCrudos.map(d => {
        const e = { Base: num(d.base), Intermedio: num(d.intermedio), Punta: num(d.punta) };
        const kwh = num(d.total);
        const share = recibo.kwh > 0 ? kwh / recibo.kwh : 0;
        const gen = tarifa === 'GDMTH'
            ? NIVELES.reduce((acc, n) => acc + e[n] * t.generacion[n], 0)
            : kwh * t.generacion;
        const subtotal = gen + resto * share;
        return {
            codigo: d.codigo,
            nombre: d.nombre || 'Desconocido',
            energia: e,
            kwh,
            porcentaje: share * 100,
            costo: subtotal * (1 + IVA) + recibo.dap * share
        };
    });

    // Historial de los últimos 6 meses (incluye el seleccionado)
    const historial = Array.from({ length: 6 }, (_, i) => {
        const f = new Date(anio, mes - 6 + i, 1);
        const a = f.getFullYear();
        const m = f.getMonth() + 1;
        const fila = filaMes(a, m);
        const e = energiaDe(fila);
        const esSeleccionado = a === anio && m === mes;
        const dias = esSeleccionado ? diasTranscurridos : new Date(a, m, 0).getDate();
        const costo = fila
            ? calcularRecibo({ tarifa, energia: e, demandaMax: num(fila.demandaMax), demandaPunta: num(fila.demandaPunta), dias, horasPunta, fp }).total
            : 0;
        return { anio: a, mes: m, energia: e, kwh: num(fila?.total), demandaMax: num(fila?.demandaMax), costo, conDatos: !!fila };
    });

    const ultimaLectura = dispositivosCrudos
        .map(d => d.ultimaLectura && new Date(d.ultimaLectura))
        .filter(Boolean)
        .sort((a, b) => b - a)[0] || null;

    return {
        tarifa,
        mes,
        anio,
        fp,
        diasMes,
        diasTranscurridos,
        esParcial: diasTranscurridos < diasMes,
        horasPunta,
        energia,
        demandaMax,
        demandaPunta,
        recibo,
        proyeccion,
        dispositivos,
        historial,
        ultimaLectura
    };
}
