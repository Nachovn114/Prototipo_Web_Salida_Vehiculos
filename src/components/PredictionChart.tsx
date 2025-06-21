import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const PredictionChart = () => {
  // Datos de ejemplo para el gráfico
  const data = {
    labels: ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
    datasets: [
      {
        label: 'Flujo de vehículos',
        data: [12, 45, 80, 65, 42, 28, 15],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Predicción de flujo de vehículos',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Vehículos por hora',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Hora del día',
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded text-sm text-blue-700 dark:text-blue-300">
        <p>📊 <strong>Predicción:</strong> Se espera alto flujo este viernes entre 8:00 y 11:00 hrs.</p>
      </div>
    </div>
  );
};

export default PredictionChart;
