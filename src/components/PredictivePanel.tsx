import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PredictivePanel = () => {
  // Datos de ejemplo para la predicción
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const predictedData = hours.map((_, i) => {
    // Simular patrón de tráfico (mañanas y tardes más ocupadas)
    const base = Math.floor(Math.random() * 10);
    const hour = new Date().getHours();
    const isPeak = (hour > 7 && hour < 10) || (hour > 17 && hour < 20);
    return base + (isPeak ? Math.floor(Math.random() * 20) + 10 : Math.floor(Math.random() * 10));
  });

  const data = {
    labels: hours,
    datasets: [
      {
        label: 'Solicitudes por hora',
        data: predictedData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
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
        text: 'Pronóstico de solicitudes para hoy',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'N° de solicitudes',
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

  // Calcular pico de solicitudes
  const maxRequests = Math.max(...predictedData);
  const peakHour = hours[predictedData.indexOf(maxRequests)];

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Panel Predictivo</h3>
        <p className="text-sm text-gray-600">
          Se espera un pico de {maxRequests} solicitudes a las {peakHour} hrs.
        </p>
      </div>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Recomendación: Asignar personal adicional de {peakHour} hrs.</p>
      </div>
    </div>
  );
};

export default PredictivePanel;
