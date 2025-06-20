import { faker } from '@faker-js/faker';
import { ReportData, getReportData } from './reportService';

// --- Type Definitions ---
export interface Anomaly {
  id: string;
  type: 'Tiempo de Cruce' | 'Procedimiento' | 'Concentración de Riesgo' | 'Rendimiento Inspector';
  severity: 'Baja' | 'Media' | 'Alta';
  title: string;
  description: string;
  timestamp: Date;
  relatedId?: string; 
  recommendation: string;
}

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


// --- Main Service Function ---
export const detectAnomalies = async (): Promise<Anomaly[]> => {
  const allData = await getReportData(); // Fetch all data for analysis

  const timeAnomalies = checkTimeAnomalies(allData);
  const riskAnomalies = checkRiskConcentration(allData);
  const performanceAnomalies = checkInspectorPerformance(allData);
  
  const allAnomalies = [...timeAnomalies, ...riskAnomalies, ...performanceAnomalies];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));

  return allAnomalies.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}; 