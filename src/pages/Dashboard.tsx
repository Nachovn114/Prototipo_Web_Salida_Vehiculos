import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
  { title: 'Solicitudes Hoy', value: '124', icon: Activity, change: '+12%' },
  { title: 'En Proceso', value: '24', icon: Clock, change: '+5%' },
  { title: 'Pendientes', value: '8', icon: AlertCircle, change: '-2%' },
  { title: 'Usuarios Activos', value: '42', icon: Users, change: '+8%' },
];

// Datos simulados para el gráfico predictivo
const predictionData = [
  { hora: '6:00', flujo: 15 },
  { hora: '8:00', flujo: 45, predicted: true },
  { hora: '10:00', flujo: 65, predicted: true },
  { hora: '12:00', flujo: 40 },
  { hora: '14:00', flujo: 30 },
  { hora: '16:00', flujo: 25 },
  { hora: '18:00', flujo: 15 },
];

const RiskBadge = ({ level }: { level: 'bajo' | 'medio' | 'alto' }) => {
  const colors = {
    bajo: { bg: 'bg-green-100 text-green-800', text: 'Bajo' },
    medio: { bg: 'bg-yellow-100 text-yellow-800', text: 'Medio' },
    alto: { bg: 'bg-red-100 text-red-800', text: 'Alto' },
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[level].bg} ${colors[level].text}`}>
      {level === 'bajo' && '🟢'}
      {level === 'medio' && '🟡'}
      {level === 'alto' && '🔴'}
      <span className="ml-1">Riesgo {colors[level].text}</span>
    </span>
  );
};

const Dashboard = () => {
  const userRole = localStorage.getItem('userRole') || 'user';
  const currentHour = new Date().getHours();
  const isPeakHour = currentHour >= 8 && currentHour <= 11;

  return (
    <div className="space-y-6">
      {/* Panel Predictivo */}
      {isPeakHour && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
          <div className="flex-shrink-0 mr-3">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-800">Alerta de Flujo</h3>
            <p className="text-sm text-blue-700">
              Se espera alto flujo hoy entre 8:00 y 11:00 hrs.
            </p>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} desde ayer
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico Predictivo */}
      <Card>
        <CardHeader>
          <CardTitle>Flujo de Vehículos por Hora</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={predictionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hora" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="flujo" 
                fill="#8884d8" 
                name="Vehículos"
              >
                {predictionData.map((entry, index) => (
                  <rect 
                    key={`bar-${index}`} 
                    fill={entry.predicted ? '#ff7300' : '#8884d8'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="text-xs text-muted-foreground mt-2 text-center">
            <span className="inline-flex items-center mr-4">
              <span className="inline-block w-3 h-3 bg-[#8884d8] mr-1"></span> Histórico
            </span>
            <span className="inline-flex items-center">
              <span className="inline-block w-3 h-3 bg-[#ff7300] mr-1"></span> Predicción
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Ejemplo de tarjeta con indicador de riesgo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">Solicitud #12345</CardTitle>
              <RiskBadge level="bajo" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Camión Placa ABC123</p>
            <p className="text-xs text-muted-foreground">En revisión</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">Solicitud #12346</CardTitle>
              <RiskBadge level="medio" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Camión Placa XYZ789</p>
            <p className="text-xs text-muted-foreground">Pendiente de revisión</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">Solicitud #12347</CardTitle>
              <RiskBadge level="alto" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Camión Placa DEF456</p>
            <p className="text-xs text-muted-foreground">Requiere atención</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
