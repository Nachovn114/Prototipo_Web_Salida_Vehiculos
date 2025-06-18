import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { FileText, Download, BarChart2, CheckCircle, XCircle } from 'lucide-react';

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
  <>
    <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-2">
      <FileText className="h-7 w-7 text-blue-700" /> Reportes y Estadísticas
    </h2>
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Tarjetas resumen */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="shadow-lg rounded-2xl bg-white dark:bg-gray-900 text-foreground dark:text-white flex flex-col items-center py-6 px-4 border border-blue-100 dark:border-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group">
          <div className="mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <BarChart2 className="h-10 w-10 text-blue-600" />
          </div>
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-200 text-lg text-center">Solicitudes esta semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-blue-700 dark:text-blue-300 text-center">129</div>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-2xl bg-white dark:bg-gray-900 text-foreground dark:text-white flex flex-col items-center py-6 px-4 border border-green-100 dark:border-green-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group">
          <div className="mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-200 text-lg text-center">Aprobadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-green-600 dark:text-green-300 text-center">120</div>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-2xl bg-white dark:bg-gray-900 text-foreground dark:text-white flex flex-col items-center py-6 px-4 border border-red-100 dark:border-red-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group">
          <div className="mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardHeader>
            <CardTitle className="text-red-900 dark:text-red-200 text-lg text-center">Rechazadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-red-600 dark:text-red-300 text-center">15</div>
          </CardContent>
        </Card>
      </div>
      {/* Gráficos */}
      <div className="grid grid-cols-2 gap-8">
        <Card className="shadow-md rounded-2xl bg-white dark:bg-gray-900 text-foreground dark:text-white border border-blue-100 dark:border-blue-800">
          <CardHeader>
            <CardTitle>Flujo de Solicitudes por Día</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={flujoPorDia} options={{ plugins: { legend: { display: false }, tooltip: { backgroundColor: '#2563eb', titleColor: '#fff', bodyColor: '#fff', borderColor: '#1e40af', borderWidth: 1 } }, responsive: true, maintainAspectRatio: false, animation: { duration: 1200, easing: 'easeInOutQuart' } }} height={220} />
          </CardContent>
        </Card>
        <Card className="shadow-md rounded-2xl bg-white dark:bg-gray-900 text-foreground dark:text-white border border-green-100 dark:border-green-800">
          <CardHeader>
            <CardTitle>Aprobaciones vs Rechazos</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie data={aprobacionesVsRechazos} options={{ plugins: { legend: { position: 'bottom', labels: { color: '#1e293b', font: { weight: 'bold' } } }, tooltip: { backgroundColor: '#fff', titleColor: '#1e293b', bodyColor: '#1e293b', borderColor: '#22c55e', borderWidth: 1 } }, responsive: true, maintainAspectRatio: false, animation: { duration: 1200, easing: 'easeInOutQuart' } }} height={220} />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <Card className="shadow-md rounded-2xl bg-white dark:bg-gray-900 text-foreground dark:text-white border border-purple-100 dark:border-purple-800">
          <CardHeader>
            <CardTitle>Tiempo Promedio de Salida (min)</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={tiempoPromedio} options={{ plugins: { legend: { display: false }, tooltip: { backgroundColor: '#6366f1', titleColor: '#fff', bodyColor: '#fff', borderColor: '#312e81', borderWidth: 1 } }, responsive: true, maintainAspectRatio: false, animation: { duration: 1200, easing: 'easeInOutQuart' }, elements: { line: { tension: 0.5 } } }} height={220} />
          </CardContent>
        </Card>
        <Card className="shadow-md flex flex-col justify-center items-center rounded-2xl bg-white dark:bg-gray-900 text-foreground dark:text-white border border-blue-100 dark:border-blue-800">
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
  </>
);

export default Reportes; 