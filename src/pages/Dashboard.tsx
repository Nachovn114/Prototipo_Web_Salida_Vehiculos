import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Clock, AlertCircle, Shield, CheckCircle } from 'lucide-react';
import PredictivePanel from '@/components/PredictivePanel';

const stats = [
  { title: 'Solicitudes Hoy', value: '124', icon: Activity, change: '+12%' },
  { title: 'En Proceso', value: '24', icon: Clock, change: '+5%' },
  { title: 'Pendientes', value: '8', icon: AlertCircle, change: '-2%' },
  { title: 'Usuarios Activos', value: '42', icon: Users, change: '+8%' },
];

const Dashboard = () => {
  // Obtener el rol del usuario desde localStorage
  const userRole = localStorage.getItem('userRole') || 'user';

  return (
    <div className="space-y-6">
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

      {/* Mostrar panel predictivo solo para administradores y aduaneros */}
      {(userRole === 'admin' || userRole === 'aduanero') && <PredictivePanel />}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Nueva solicitud #1245
                  </p>
                  <p className="text-sm text-gray-500">Hace 5 minutos</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Solicitud #1244 aprobada
                  </p>
                  <p className="text-sm text-gray-500">Hace 15 minutos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-2 bg-yellow-50 rounded-md">
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Solicitud #1245 requiere revisión</p>
                  <p className="text-xs text-gray-500">Documentos pendientes de validación</p>
                  <p className="text-xs text-gray-400 mt-1">Hace 15 minutos</p>
                </div>
              </div>
              
              {userRole === 'admin' && (
                <div className="flex items-start space-x-3 p-2 bg-red-50 rounded-md">
                  <Shield className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Actividad sospechosa detectada</p>
                    <p className="text-xs text-gray-500">Múltiples intentos de acceso fallidos</p>
                    <p className="text-xs text-gray-400 mt-1">Hace 1 hora</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
