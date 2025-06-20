import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BorderMap } from './BorderMap';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Car, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  BarChart3,
  MapPin,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// Datos de métricas
const metrics = [
  {
    title: 'Solicitudes Pendientes',
    value: '24',
    trend: 12.5,
    icon: FileText,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    title: 'Aprobadas Hoy',
    value: '156',
    trend: 8.3,
    icon: CheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    title: 'En Revisión',
    value: '8',
    trend: -5.2,
    icon: Clock,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
  {
    title: 'Rechazadas',
    value: '3',
    trend: -15.8,
    icon: AlertCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600'
  }
];

// Estados de solicitudes
const requestStatus = [
  { status: 'Aprobadas', count: 156, percentage: 75, color: 'bg-green-500' },
  { status: 'Pendientes', count: 24, percentage: 12, color: 'bg-blue-500' },
  { status: 'En Revisión', count: 8, percentage: 4, color: 'bg-yellow-500' },
  { status: 'Rechazadas', count: 3, percentage: 2, color: 'bg-red-500' }
];

// Actividad reciente
const recentActivity = [
  {
    title: 'Nueva solicitud aprobada',
    description: 'Solicitud #2024-001 aprobada por Inspector García',
    time: 'Hace 5 minutos',
    icon: CheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    title: 'Documento subido',
    description: 'Licencia de conducir verificada en solicitud #2024-002',
    time: 'Hace 12 minutos',
    icon: FileText,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    title: 'Inspección programada',
    description: 'Inspección vehicular programada para mañana 10:00 AM',
    time: 'Hace 25 minutos',
    icon: Car,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    title: 'Solicitud rechazada',
    description: 'Solicitud #2024-003 rechazada por documentación incompleta',
    time: 'Hace 1 hora',
    icon: AlertCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600'
  }
];

// Solicitudes recientes
const recentRequests = [
  {
    id: '2024-001',
    driver: 'Juan Pérez',
    vehicle: 'Toyota Hilux 2023',
    status: 'Aprobada',
    date: '15/01/2024'
  },
  {
    id: '2024-002',
    driver: 'María González',
    vehicle: 'Ford Ranger 2022',
    status: 'Pendiente',
    date: '15/01/2024'
  },
  {
    id: '2024-003',
    driver: 'Carlos Rodríguez',
    vehicle: 'Chevrolet S10 2021',
    status: 'Rechazada',
    date: '14/01/2024'
  },
  {
    id: '2024-004',
    driver: 'Ana Silva',
    vehicle: 'Nissan Frontier 2023',
    status: 'En Revisión',
    date: '14/01/2024'
  },
  {
    id: '2024-005',
    driver: 'Luis Martínez',
    vehicle: 'Mitsubishi L200 2022',
    status: 'Aprobada',
    date: '14/01/2024'
  }
];

// Actividad por usuario
const userActivity = [
  { name: 'Inspector García', role: 'Inspector', requests: 45 },
  { name: 'Aduanero Soto', role: 'Aduanero', requests: 38 },
  { name: 'Conductor Pérez', role: 'Conductor', requests: 12 },
  { name: 'Admin Silva', role: 'Administrador', requests: 8 }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const handleRefresh = () => {
    toast.success('Datos actualizados', { description: 'Panel refrescado correctamente' });
  };

  React.useEffect(() => {
    toast.success('¡Bienvenido al Panel de Control!', { description: 'Sistema listo para operar 🚗🎉' });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('Dashboard')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Vista general del sistema de control vehicular
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Hoy
          </Button>
          <Button size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {metric.trend > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        metric.trend > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Math.abs(metric.trend)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${metric.iconBg}`}>
                    <metric.icon className={`h-6 w-6 ${metric.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Contenido principal con tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="map">Mapa Fronterizo</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Gráficos y estadísticas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de solicitudes por estado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Estado de Solicitudes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {requestStatus.map((status) => (
                  <div key={status.status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                        <span className="text-sm font-medium">{status.status}</span>
                      </div>
                      <span className="text-sm text-gray-600">{status.count}</span>
                    </div>
                    <Progress value={status.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actividad reciente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className={`p-2 rounded-full ${activity.iconBg}`}>
                        <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de solicitudes recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Solicitudes Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Conductor</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Vehículo</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Estado</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Fecha</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map((request, index) => (
                      <motion.tr
                        key={request.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                          #{request.id}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {request.driver}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {request.vehicle}
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={request.status === 'Aprobada' ? 'default' : 
                                   request.status === 'Pendiente' ? 'secondary' : 'destructive'}
                          >
                            {request.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {request.date}
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm">
                            Ver detalles
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <BorderMap />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Contenido de analíticas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tendencias Mensuales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Solicitudes procesadas</span>
                    <span className="text-sm text-green-600">+12.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tiempo promedio</span>
                    <span className="text-sm text-red-600">-8.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Satisfacción</span>
                    <span className="text-sm text-green-600">+5.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Actividad por Usuario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userActivity.map((user, index) => (
                    <div key={user.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{user.requests}</p>
                        <p className="text-xs text-gray-500">solicitudes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
