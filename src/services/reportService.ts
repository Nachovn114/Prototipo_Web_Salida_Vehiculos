import { faker } from '@faker-js/faker';

// --- Type Definitions ---
export interface ReportData {
  id: string;
  fecha: Date;
  tipoVehiculo: 'Liviano' | 'Carga' | 'Pasajeros';
  paisOrigen: 'Chile' | 'Argentina';
  puntoControl: 'Los Libertadores' | 'Horcones' | 'Uspallata';
  tiempoCruce: number; // en minutos
  resultadoInspeccion: 'Aprobado' | 'Rechazado' | 'Con Observaciones';
  nivelRiesgo: 'Bajo' | 'Medio' | 'Alto';
  inspector: string;
}

// --- Data Generation ---
const generateRandomData = (count: number): ReportData[] => {
  const data: ReportData[] = [];
  for (let i = 0; i < count; i++) {
    data.push({
      id: faker.string.uuid(),
      fecha: faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: new Date() }),
      tipoVehiculo: faker.helpers.arrayElement(['Liviano', 'Carga', 'Pasajeros']),
      paisOrigen: faker.helpers.arrayElement(['Chile', 'Argentina']),
      puntoControl: faker.helpers.arrayElement(['Los Libertadores', 'Horcones', 'Uspallata']),
      tiempoCruce: faker.number.int({ min: 15, max: 180 }),
      resultadoInspeccion: faker.helpers.arrayElement(['Aprobado', 'Rechazado', 'Con Observaciones']),
      nivelRiesgo: faker.helpers.arrayElement(['Bajo', 'Medio', 'Alto']),
      inspector: faker.person.fullName(),
    });
  }
  return data;
};

let allData = generateRandomData(500);

// --- Service Functions ---
export const getReportData = async (filters: { startDate?: Date; endDate?: Date } = {}): Promise<ReportData[]> => {
  console.log("Filtering data with:", filters);
  let filteredData = allData;

  if (filters.startDate) {
    filteredData = filteredData.filter(d => d.fecha >= filters.startDate!);
  }
  if (filters.endDate) {
    // Add one day to the end date to make the filter inclusive
    const inclusiveEndDate = new Date(filters.endDate);
    inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
    filteredData = filteredData.filter(d => d.fecha < inclusiveEndDate);
  }
  
  console.log(`Returning ${filteredData.length} records after filtering.`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return filteredData.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
}; 