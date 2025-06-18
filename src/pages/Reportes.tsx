import React from 'react';
import MainLayout from '../components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { FileText, Download } from 'lucide-react';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

const flujoPorDia = {
  labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  datasets: [
    {
      label: 'Solicitudes',
      data: [18, 22, 19, 25, 20, 15, 10],
      backgroundColor: 'rgba(37, 99, 235, 0.7)',
      borderRadius: 6,
    },
  ],
};

const aprobacionesVsRechazos = {
  labels: ['Aprobadas', 'Rechazadas'],
  datasets: [
    {
      data: [120, 15],
      backgroundColor: ['#22c55e', '#ef4444'],
      borderWidth: 0,
    },
  ],
};

const tiempoPromedio = {
  labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  datasets: [
    {
      label: 'Minutos',
      data: [14, 13, 15, 12, 16, 18, 17],
      fill: false,
      borderColor: '#6366f1',
      backgroundColor: '#6366f1',
      tension: 0.4,
    },
  ],
};

const Reportes = () => (
  <MainLayout>
    <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-2">
      <FileText className="h-7 w-7 text-blue-700" /> Reportes y Estadísticas
    </h2>
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-blue-900">Solicitudes esta semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-blue-700">129</div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-green-900">Aprobadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-green-600">120</div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-red-900">Rechazadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-red-600">15</div>
          </CardContent>
        </Card>
      </div>
      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Flujo de Solicitudes por Día</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={flujoPorDia} options={{ plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }} height={220} />
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Aprobaciones vs Rechazos</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie data={aprobacionesVsRechazos} options={{ plugins: { legend: { position: 'bottom' } }, responsive: true, maintainAspectRatio: false }} height={220} />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Tiempo Promedio de Salida (min)</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={tiempoPromedio} options={{ plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }} height={220} />
          </CardContent>
        </Card>
        <Card className="shadow-md flex flex-col justify-center items-center">
          <CardHeader>
            <CardTitle>Exportar Reporte</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Button className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2" onClick={() => alert('Exportación simulada')}>
              <Download className="h-5 w-5" /> Exportar PDF/Excel
            </Button>
            <span className="text-xs text-gray-500 mt-2">(Función simulada)</span>
          </CardContent>
        </Card>
      </div>
    </div>
  </MainLayout>
);

export default Reportes; 