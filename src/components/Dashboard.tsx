import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Car, Clock, CheckCircle, AlertTriangle, TrendingUp, Users, FileText, Bell, ArrowRightCircle } from 'lucide-react';

const userRole = localStorage.getItem('userRole') || 'inspector';
const userName = {
  conductor: 'Conductor',
  inspector: 'Inspector García',
  aduanero: 'Aduanero Soto',
  admin: 'Administrador',
}[userRole] || 'Usuario';

export const Dashboard: React.FC = () => {
  // Datos simulados
  const stats = [
    {
      title: 'Solicitudes Pendientes',
      value: 5,
      icon: FileText,
      color: 'text-blue-600',
      badge: 'Nuevo',
    },
    {
      title: 'Inspecciones en Curso',
      value: 2,
      icon: Car,
      color: 'text-amber-600',
    },
    {
      title: 'Documentos por Revisar',
      value: 3,
      icon: FileText,
      color: 'text-indigo-600',
    },
    {
      title: 'Alertas Críticas',
      value: 1,
      icon: AlertTriangle,
      color: 'text-red-600',
      badge: '¡Atención!',
    },
  ];

  const notificaciones = [
    { tipo: 'info', mensaje: 'Nuevo protocolo de revisión implementado.', fecha: 'Hoy 09:15' },
    { tipo: 'alerta', mensaje: 'Documento vencido detectado en inspección.', fecha: 'Ayer 18:22' },
    { tipo: 'sistema', mensaje: 'Sincronización exitosa con sistema argentino.', fecha: 'Ayer 12:10' },
  ];

  return (
    <div className="space-y-8">
      {/* Bienvenida */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 mb-1">¡Bienvenido, {userName}!</h2>
          <p className="text-gray-600">Sistema de Control Fronterizo - Salida de Vehículos Chile &rarr; Argentina</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href="/inspecciones" className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-md font-semibold hover:bg-blue-800 transition-colors">
            <Car className="h-5 w-5 mr-2" /> Nueva Inspección
          </a>
          <a href="/documentos" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition-colors">
            <FileText className="h-5 w-5 mr-2" /> Subir Documento
          </a>
          <a href="/reportes" className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md font-semibold hover:bg-emerald-700 transition-colors">
            <TrendingUp className="h-5 w-5 mr-2" /> Ver Reportes
          </a>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className={`rounded-full p-2 bg-blue-50 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              {stat.badge && <Badge className="bg-red-500 text-white animate-pulse">{stat.badge}</Badge>}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{stat.value}</div>
              <CardDescription className="text-gray-600">{stat.title}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico de flujo vehicular (simulado) */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>Flujo Vehicular - Últimas 24h</span>
          </CardTitle>
          <CardDescription>
            Cantidad de vehículos procesados por hora en el paso Los Libertadores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { hora: '06:00 - 08:00', vehiculos: 23, capacidad: 85 },
              { hora: '08:00 - 10:00', vehiculos: 45, capacidad: 95 },
              { hora: '10:00 - 12:00', vehiculos: 38, capacidad: 80 },
              { hora: '12:00 - 14:00', vehiculos: 42, capacidad: 90 },
              { hora: '14:00 - 16:00', vehiculos: 35, capacidad: 75 }
            ].map((periodo, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{periodo.hora}</span>
                  <span className="font-medium">{periodo.vehiculos} vehículos</span>
                </div>
                <Progress value={periodo.capacidad} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notificaciones recientes */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <span>Notificaciones Recientes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-blue-50">
            {notificaciones.map((n, i) => (
              <li key={i} className="py-2 flex items-center gap-3">
                {n.tipo === 'alerta' ? <AlertTriangle className="h-4 w-4 text-red-500" /> : n.tipo === 'sistema' ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <FileText className="h-4 w-4 text-blue-500" />}
                <span className="text-sm text-gray-700 flex-1">{n.mensaje}</span>
                <span className="text-xs text-gray-400">{n.fecha}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
