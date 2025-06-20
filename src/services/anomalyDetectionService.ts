import { faker } from '@faker-js/faker';
import { ReportData, getReportData } from './reportService';
import { subHours, isAfter, isBefore, addDays } from 'date-fns';

// --- Type Definitions ---
export type RiskLevel = 'Bajo' | 'Medio' | 'Alto';

export interface RiskAssessment {
  level: RiskLevel;
  score: number;
  factors: {
    documentStatus: number;
    vehicleValue: number;
    inspectionHistory: number;
    routeRisk: number;
    timeFactors: number;
  };
  details: string[];
  recommendations: string[];
}

export interface Anomaly {
  id: string;
  type: 'Tiempo de Cruce' | 'Procedimiento' | 'Concentración de Riesgo' | 'Rendimiento Inspector' | 'Riesgo Aduanero';
  severity: 'Baja' | 'Media' | 'Alta';
  title: string;
  description: string;
  timestamp: Date;
  relatedId?: string;
  recommendation: string;
  metadata?: Record<string, any>;
}

// Factores de ponderación para el cálculo de riesgo
const RISK_WEIGHTS = {
  DOCUMENT_EXPIRY: 0.3,
  VEHICLE_VALUE: 0.25,
  INSPECTION_HISTORY: 0.2,
  ROUTE_RISK: 0.15,
  TIME_FACTORS: 0.1
};

// Umbrales para los niveles de riesgo
const RISK_THRESHOLDS = {
  BAJO: 0.3,
  MEDIO: 0.7
};

// Rutas consideradas de alto riesgo
const HIGH_RISK_ROUTES = [
  'Ruta 5 Norte',
  'Paso Los Libertadores',
  'Paso Cristo Redentor'
];

// Tipos de vehículos y sus factores de riesgo
const VEHICLE_RISK_FACTORS: Record<string, number> = {
  'camion': 0.8,
  'furgon': 0.6,
  'camioneta': 0.4,
  'automovil': 0.2,
  'moto': 0.1
};

// --- Anomaly Detection Logic ---

const checkTimeAnomalies = (data: ReportData[]): Anomaly[] => {
  const anomalies: Anomaly[] = [];
  const timeThreshold = 150; // 2.5 horas

  data.forEach(d => {
    if (d.tiempoCruce > timeThreshold) {
      anomalies.push({
        id: faker.string.uuid(),
        type: 'Tiempo de Cruce',
        severity: 'Media',
        title: 'Tiempo de cruce excesivo',
        description: `El vehículo de ${d.tipoVehiculo} en ${d.puntoControl} tardó ${d.tiempoCruce} min. en cruzar, superando el umbral de ${timeThreshold} min.`,
        timestamp: d.fecha,
        relatedId: d.id,
        recommendation: `Revisar la solicitud #${d.id.substring(0, 8)} para identificar la causa de la demora.`
      });
    }
  });
  return anomalies;
};

const checkRiskConcentration = (data: ReportData[]): Anomaly[] => {
  const anomalies: Anomaly[] = [];
  const lastHour = new Date(Date.now() - 60 * 60 * 1000);
  const recentHighRisk = data.filter(d => d.nivelRiesgo === 'Alto' && d.fecha > lastHour);

  if (recentHighRisk.length > 3) {
    anomalies.push({
      id: faker.string.uuid(),
      type: 'Concentración de Riesgo',
      severity: 'Alta',
      title: 'Alta concentración de riesgo',
      description: `Se han detectado ${recentHighRisk.length} vehículos de alto riesgo en la última hora.`,
      timestamp: new Date(),
      recommendation: 'Aumentar la alerta en los puntos de control y asignar más personal de inspección.'
    });
  }
  return anomalies;
};

const checkInspectorPerformance = (data: ReportData[]): Anomaly[] => {
  const anomalies: Anomaly[] = [];
  const inspectorData: Record<string, { total: number; rejected: number }> = {};

  data.forEach(d => {
    if (!inspectorData[d.inspector]) {
      inspectorData[d.inspector] = { total: 0, rejected: 0 };
    }
    inspectorData[d.inspector].total++;
    if (d.resultadoInspeccion === 'Rechazado') {
      inspectorData[d.inspector].rejected++;
    }
  });

  for (const inspector in inspectorData) {
    const { total, rejected } = inspectorData[inspector];
    const rejectionRate = (rejected / total) * 100;
    if (total > 10 && rejectionRate > 30) {
      anomalies.push({
        id: faker.string.uuid(),
        type: 'Rendimiento Inspector',
        severity: 'Baja',
        title: 'Tasa de rechazo atípica',
        description: `El inspector ${inspector} tiene una tasa de rechazo del ${rejectionRate.toFixed(1)}% en sus últimas ${total} solicitudes.`,
        timestamp: new Date(),
        relatedId: inspector,
        recommendation: 'Programar una revisión de procedimientos estándar con el inspector.'
      });
    }
  }

  return anomalies;
};

/**
 * Evalúa el riesgo de una solicitud de cruce fronterizo
 * @param requestData Datos de la solicitud a evaluar
 * @returns Evaluación de riesgo detallada
 */
export const assessRisk = (requestData: {
  documents: Array<{ type: string; status: 'valid' | 'expired' | 'missing'; expiryDate?: string }>;
  vehicle: { type: string; value: number; year: number };
  cargo?: { type: string; value: number; description: string };
  route: string;
  time: Date;
  previousInspections?: Array<{ result: 'approved' | 'rejected'; notes: string }>;
}): RiskAssessment => {
  const factors = {
    documentStatus: calculateDocumentRisk(requestData.documents),
    vehicleValue: calculateVehicleRisk(requestData.vehicle, requestData.cargo),
    inspectionHistory: calculateInspectionHistoryRisk(requestData.previousInspections || []),
    routeRisk: calculateRouteRisk(requestData.route, requestData.time),
    timeFactors: calculateTimeRisk(requestData.time)
  };

  // Calcular puntuación de riesgo ponderada
  const score = (
    factors.documentStatus * RISK_WEIGHTS.DOCUMENT_EXPIRY +
    factors.vehicleValue * RISK_WEIGHTS.VEHICLE_VALUE +
    factors.inspectionHistory * RISK_WEIGHTS.INSPECTION_HISTORY +
    factors.routeRisk * RISK_WEIGHTS.ROUTE_RISK +
    factors.timeFactors * RISK_WEIGHTS.TIME_FACTORS
  );

  // Determinar nivel de riesgo
  let level: RiskLevel = 'Bajo';
  if (score > RISK_THRESHOLDS.MEDIO) level = 'Alto';
  else if (score > RISK_THRESHOLDS.BAJO) level = 'Medio';

  // Generar detalles y recomendaciones
  const { details, recommendations } = generateRiskDetails(factors, level);

  return {
    level,
    score,
    factors,
    details,
    recommendations
  };
};

// Funciones auxiliares para el cálculo de riesgo
const calculateDocumentRisk = (documents: Array<{ status: string; expiryDate?: string }>): number => {
  if (documents.some(doc => doc.status === 'missing')) return 1.0;
  if (documents.some(doc => doc.status === 'expired')) return 0.8;
  if (documents.some(doc => doc.expiryDate && isNearExpiry(doc.expiryDate))) return 0.5;
  return 0.1;
};

const calculateVehicleRisk = (vehicle: { type: string; value: number }, cargo?: { value: number }): number => {
  let risk = VEHICLE_RISK_FACTORS[vehicle.type.toLowerCase()] || 0.5;
  
  // Ajustar por valor del vehículo y carga
  const baseValue = cargo?.value || vehicle.value;
  if (baseValue > 100000) risk = Math.min(1, risk + 0.4);
  else if (baseValue > 50000) risk = Math.min(1, risk + 0.2);
  
  return risk;
};

const calculateInspectionHistoryRisk = (inspections: Array<{ result: string }>): number => {
  if (inspections.length === 0) return 0.3; // Sin historial = riesgo moderado
  
  const rejectionRate = inspections.filter(i => i.result === 'rejected').length / inspections.length;
  return Math.min(1, rejectionRate * 1.5); // Penalizar tasas altas de rechazo
};

const calculateRouteRisk = (route: string, time: Date): number => {
  // Rutas de alto riesgo
  if (HIGH_RISK_ROUTES.some(r => route.includes(r))) {
    // Horas de mayor riesgo: noche y madrugada
    const hour = time.getHours();
    if (hour >= 22 || hour <= 6) return 0.9;
    return 0.7;
  }
  return 0.2;
};

const calculateTimeRisk = (time: Date): number => {
  // Aumentar riesgo en fines de semana y festivos
  const day = time.getDay();
  if (day === 0 || day === 6) return 0.7;
  
  // Horas pico
  const hour = time.getHours();
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20)) return 0.6;
  
  return 0.2;
};

const isNearExpiry = (expiryDate: string): boolean => {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry <= 30; // Considerar próximo a vencer si falta 1 mes o menos
};

const generateRiskDetails = (factors: any, level: RiskLevel) => {
  const details: string[] = [];
  const recommendations: string[] = [];

  // Documentos
  if (factors.documentStatus > 0.7) {
    details.push('Documentos vencidos o faltantes');
    recommendations.push('Verificar y actualizar la documentación del vehículo y conductor');
  } else if (factors.documentStatus > 0.4) {
    details.push('Algunos documentos están próximos a vencer');
    recommendations.push('Renovar documentos que están próximos a vencer');
  }

  // Valor del vehículo/carga
  if (factors.vehicleValue > 0.7) {
    details.push('Alto valor del vehículo o carga');
    recommendations.push('Realizar inspección física detallada');
  }

  // Historial
  if (factors.inspectionHistory > 0.6) {
    details.push('Historial de inspecciones con observaciones');
    recommendations.push('Revisar historial previo antes de proceder');
  }

  // Ruta y horario
  if (factors.routeRisk > 0.6) {
    details.push('Ruta con historial de incidentes');
    recommendations.push('Considerar ruta alternativa si es posible');
  }

  if (factors.timeFactors > 0.5) {
    details.push('Horario de alto tráfico o riesgo');
    recommendations.push('Aumentar personal de inspección durante estas horas');
  }

  // Recomendaciones generales según nivel de riesgo
  if (level === 'Alto') {
    recommendations.unshift('Inspección física obligatoria');
    recommendations.push('Notificar a supervisores');
  } else if (level === 'Medio') {
    recommendations.unshift('Revisión detallada recomendada');
  } else {
    recommendations.unshift('Proceder con revisión estándar');
  }

  return { details, recommendations };
};

// --- Main Service Function ---
export const detectAnomalies = async (): Promise<Anomaly[]> => {
  const allData = await getReportData(); // Fetch all data for analysis

  const timeAnomalies = checkTimeAnomalies(allData);
  const riskAnomalies = checkRiskConcentration(allData);
  const performanceAnomalies = checkInspectorPerformance(allData);
  
  // Agregar evaluaciones de riesgo personalizadas
  const riskAssessments = allData
    .filter(item => {
      // Solo evaluar solicitudes recientes
      const oneWeekAgo = subHours(new Date(), 24 * 7);
      return new Date(item.fecha) > oneWeekAgo;
    })
    .map(item => {
      const risk = assessRisk({
        documents: [
          { type: 'Permiso de Circulación', status: 'valid', expiryDate: '2024-12-31' },
          // ... otros documentos simulados
        ],
        vehicle: { type: item.tipoVehiculo, value: 25000, year: 2020 },
        route: item.puntoControl, // Usamos puntoControl en lugar de ruta
        time: new Date(item.fecha),
        previousInspections: []
      });

      if (risk.level === 'Alto') {
        return {
          id: `risk-${item.id}`,
          type: 'Riesgo Aduanero',
          severity: 'Alta',
          title: 'Alto riesgo detectado en solicitud',
          description: `La solicitud ${item.id} ha sido clasificada como de alto riesgo. ${risk.details.join('; ')}`,
          timestamp: new Date(),
          relatedId: item.id,
          recommendation: risk.recommendations?.length ? risk.recommendations[0] : 'Revisión prioritaria requerida',
          metadata: { riskScore: risk.score, factors: risk.factors }
        };
      }
      return null;
    })
    .filter(Boolean) as Anomaly[];

  // Combinar todas las anomalías y ordenar por severidad
  return [...timeAnomalies, ...riskAnomalies, ...performanceAnomalies, ...riskAssessments].sort((a, b) => {
    const severityOrder: Record<string, number> = { 'Alta': 3, 'Media': 2, 'Baja': 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
};