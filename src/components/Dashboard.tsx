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
  ArrowDownRight,
  Info,
  AlertTriangle,
  Bell,
  Archive
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { TooltipProvider, Tooltip as UITooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { notifyCongestionPrediction } from '@/services/notificationService';
import AnomalyDetectionWidget from './AnomalyDetectionWidget';
import { detectAnomalies } from '@/services/anomalyDetectionService';
import Reportes from '../pages/Reportes';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNotifications } from '../hooks/useNotifications';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

// Animaciones para tarjetas y contenedores (debe estar antes del componente)
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

// Datos de métricas
const metrics = [
  {
    title: 'Solicitudes Pendientes',
    value: '24',
    trend: 12.5,
    icon: FileText,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    cardBg: 'bg-blue-50',
  },
  {
    title: 'Aprobadas Hoy',
    value: '156',
    trend: 8.3,
    icon: CheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    cardBg: 'bg-green-50',
  },
  {
    title: 'En Revisión',
    value: '8',
    trend: -5.2,
    icon: Clock,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    cardBg: 'bg-yellow-50',
  },
  {
    title: 'Rechazadas',
    value: '3',
    trend: -15.8,
    icon: AlertCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    cardBg: 'bg-red-50',
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

// Datos simulados para predicción
const congestionData = {
  labels: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
  datasets: [
    {
      label: 'Solicitudes por hora',
      data: [5, 12, 25, 40, 38, 30, 22, 15, 8],
      borderColor: 'rgb(37, 99, 235)',
      backgroundColor: 'rgba(37, 99, 235, 0.2)',
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Predicción IA',
      data: [6, 15, 35, 55, 50, 35, 25, 18, 10],
      borderColor: 'rgb(251, 191, 36)',
      backgroundColor: 'rgba(251, 191, 36, 0.2)',
      borderDash: [5, 5],
      tension: 0.4,
      fill: false,
    }
  ]
};

// --- Datos simulados para el widget de tiempos de espera ---
const esperaPorHora = {
  labels: ['6:00-7:00', '7:00-8:00', '8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00'],
  datasets: [
    {
      label: 'Tiempo de Espera (min)',
      data: [15, 22, 35, 48, 40, 32, 28, 20, 16],
      backgroundColor: 'rgba(37, 99, 235, 0.7)',
      borderRadius: 6,
      maxBarThickness: 32,
    }
  ]
};

// --- Datos simulados para el gráfico de distribución de riesgo ---
const riesgoData = {
  labels: ['Bajo', 'Medio', 'Alto'],
  datasets: [
    {
      data: [60, 25, 15],
      backgroundColor: [
        'rgba(34,197,94,0.7)',   // verde
        'rgba(251,191,36,0.7)', // amarillo
        'rgba(239,68,68,0.7)'   // rojo
      ],
      borderColor: [
        'rgba(34,197,94,1)',
        'rgba(251,191,36,1)',
        'rgba(239,68,68,1)'
      ],
      borderWidth: 2,
    }
  ]
};

// --- Datos simulados para el ranking de inspectores ---
const rankingInspectores = [
  { nombre: 'Inspector García', rol: 'Inspector', solicitudes: 45 },
  { nombre: 'Aduanero Soto', rol: 'Aduanero', solicitudes: 38 },
  { nombre: 'Inspector Rojas', rol: 'Inspector', solicitudes: 32 },
  { nombre: 'Aduanero Valdés', rol: 'Aduanero', solicitudes: 27 },
  { nombre: 'Inspector Paredes', rol: 'Inspector', solicitudes: 21 },
];

// Panel predictivo solo para admin
const userRole = localStorage.getItem('userRole');

// --- Simulación de notificaciones (alertas + otras) ---
const notificaciones = [
  // Alertas inteligentes fijadas
  {
    id: 1,
    tipo: 'alerta',
    mensaje: 'Alerta: Congestión alta prevista entre 10:00 y 12:00 hrs. Refuerce personal en el control.',
    importante: true,
    icon: Bell,
    leida: false
  },
  {
    id: 2,
    tipo: 'alerta',
    mensaje: 'Alerta: Se detectó un aumento de solicitudes con riesgo alto. Revise documentación y refuerce controles.',
    importante: true,
    icon: AlertTriangle,
    leida: false
  },
  // Notificaciones normales
  {
    id: 3,
    tipo: 'info',
    mensaje: 'Nueva solicitud aprobada: #2024-001',
    importante: false,
    icon: CheckCircle,
    leida: false
  },
  {
    id: 4,
    tipo: 'info',
    mensaje: 'Inspección vehicular programada para mañana 10:00 AM',
    importante: false,
    icon: Car,
    leida: true
  }
];

// Función para obtener el color y texto del riesgo (debe estar antes del componente)
const getRiskBadge = (riesgo: 'bajo' | 'medio' | 'alto') => {
  switch (riesgo) {
    case 'alto':
      return <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse">Alto</Badge>;
    case 'medio':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse">Medio</Badge>;
    default:
      return <Badge className="bg-green-100 text-green-800 border-green-200">Bajo</Badge>;
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  if (isToday) return `Hoy, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  if (isYesterday) return `Ayer, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Importa los datos simulados de pasos fronterizos del BorderMap
const pasos = [
  {
    nombre: 'Los Libertadores',
    estado: 'Medio',
    tiempo: 25
  },
  {
    nombre: 'Cardenal Samoré',
    estado: 'Alto',
    tiempo: 70
  },
  {
    nombre: 'Paso Jama',
    estado: 'Bajo',
    tiempo: 10
  }
];
const estadoColor = {
  'Bajo': 'green',
  'Medio': 'orange',
  'Alto': 'red'
};
const estadoIcon = {
  'Bajo': <CheckCircle className="h-5 w-5 text-green-500" />, 
  'Medio': <AlertTriangle className="h-5 w-5 text-yellow-500 animate-pulse" />, 
  'Alto': <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
};

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [notificacionesState, setNotificacionesState] = React.useState(notificaciones);
  const notificacionesNoLeidas = notificacionesState.filter(n => !n.leida).length;
  const handleRefresh = () => {
    toast.success('Datos actualizados', { description: 'Panel refrescado correctamente' });
  };

  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notificationTab, setNotificationTab] = React.useState<'todas' | 'archivadas'>('todas');
  const {
    notifications,
    markAllAsRead,
    archiveNotification,
    unarchiveNotification,
  } = useNotifications();

  // Calcular el número de notificaciones no archivadas
  const notificacionesNoArchivadas = notifications.filter(n => !n.archivada).length;

  // Filtrar alertas urgentes (ancladas)
  const alertasAncladas = notifications.filter(n => !n.archivada && (n.prioridad === 'urgente' || n.prioridad === 'alta'));
  const notificacionesNormales = notifications.filter(n => !n.archivada && n.prioridad !== 'urgente' && n.prioridad !== 'alta');

  React.useEffect(() => {
    const hasShownWelcome = sessionStorage.getItem('welcomeNotificationShown');
    if (!hasShownWelcome) {
    toast.success('¡Bienvenido al Panel de Control!', { description: 'Sistema listo para operar 🚗🎉' });
      sessionStorage.setItem('welcomeNotificationShown', 'true');
    }

    // Simular alerta de congestión para administradores
    if (userRole === 'admin') {
      const peakPrediction = Math.max(...congestionData.datasets[1].data);
      let level: 'Moderada' | 'Alta' | 'Severa' | null = null;
      
      if (peakPrediction > 50 && peakPrediction <= 60) {
        level = 'Alta';
      } else if (peakPrediction > 60) {
        level = 'Severa';
      }
      
      if (level) {
        // Usamos un timeout para que la notificación no sea tan inmediata
        setTimeout(() => notifyCongestionPrediction(level!), 1500);
      }
    }

    // Detección de anomalías y notificación automática
    detectAnomalies().then(anomalies => {
      anomalies.forEach(anomaly => {
        if (anomaly.severity === 'Alta') {
          // Generar notificación urgente anclada
          archiveNotification({
            tipo: 'urgente',
            titulo: anomaly.title,
            mensaje: anomaly.description,
            prioridad: 'urgente',
            archivada: false
          });
        }
      });
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panel de Control</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Vista general del sistema de control vehicular
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {/* Icono de notificaciones al lado de Hoy */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
            >
              <Bell className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              {notificacionesNoArchivadas > 0 && (
                <span className="absolute -top-2 -right-2 h-7 w-7 bg-red-500 text-white text-base font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-bounce z-10">
                  {notificacionesNoArchivadas}
                </span>
              )}
            </button>
            <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
              <DialogContent className="max-w-xl w-full p-0 rounded-2xl">
                <DialogHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-2 border-b">
                  <DialogTitle className="text-2xl font-bold">Notificaciones</DialogTitle>
                  <button className="text-blue-700 text-sm font-medium hover:underline" onClick={() => markAllAsRead()}>
                    Marcar todas como leídas
                  </button>
                </DialogHeader>
                <div className="px-6 pt-4 pb-2">
                  <Tabs value={notificationTab} onValueChange={value => setNotificationTab(value as 'todas' | 'archivadas')} className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="todas">Todas</TabsTrigger>
                      <TabsTrigger value="archivadas">Archivadas</TabsTrigger>
                    </TabsList>
                    <TabsContent value="todas">
                      <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {/* Alertas urgentes ancladas */}
                        {alertasAncladas.length > 0 && (
                          <div className="mb-6">
                            {alertasAncladas.map(n => (
                              <div key={n.id} className={`flex items-start gap-3 rounded-xl ${n.prioridad === 'urgente' ? 'bg-yellow-50 border-l-8 border-yellow-400' : 'bg-red-50 border-l-8 border-red-500'} animate-pulse-slow p-4 mb-3 shadow-sm relative`}>
                                <AlertTriangle className={`h-7 w-7 mt-1 flex-shrink-0 ${n.prioridad === 'urgente' ? 'text-yellow-500' : 'text-red-500'}`} />
                                <div className="flex-1">
                                  <span className={`block font-bold ${n.prioridad === 'urgente' ? 'text-yellow-900' : 'text-red-900'} text-base mb-1`}>{n.titulo}</span>
                                  <span className={`block ${n.prioridad === 'urgente' ? 'text-yellow-900' : 'text-red-900'} text-sm font-medium`}>{n.mensaje}</span>
                                  <span className={`block text-xs mt-1 ${n.prioridad === 'urgente' ? 'text-yellow-700' : 'text-red-700'}`}>{formatDate(n.fecha)}</span>
                                </div>
                                {/* Sin botón de archivar */}
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Separador visual si hay alertas y normales */}
                        {alertasAncladas.length > 0 && notificacionesNormales.length > 0 && (
                          <div className="h-2" />
                        )}
                        {/* Notificaciones normales */}
                        {notificacionesNormales.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <Bell className="h-16 w-16 mb-4" />
                            <span className="text-lg font-semibold">No hay notificaciones</span>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {notificacionesNormales.map(n => (
                              <div key={n.id} className={`flex items-start gap-3 rounded-xl bg-white border border-gray-200 shadow-sm px-4 py-3 relative group transition-all hover:shadow-lg cursor-pointer`} onClick={() => !n.leida && markAsRead(n.id)}>
                                <CheckCircle className={`h-6 w-6 mt-1 flex-shrink-0 ${n.leida ? 'text-gray-300' : 'text-blue-500'}`} />
                                <div className="flex-1">
                                  <span className="block font-bold text-gray-900 text-base mb-1">{n.titulo}</span>
                                  <span className="block text-gray-600 text-sm">{n.mensaje}</span>
                                  <span className="block text-xs text-gray-400 mt-1">{formatDate(n.fecha)}</span>
                                </div>
                                {!n.leida && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500 animate-pulse" title="No leída"></span>}
                                <UITooltip>
                                  <TooltipTrigger asChild>
                                    <button className="ml-2 text-gray-400 hover:text-blue-600 transition-colors opacity-80 group-hover:opacity-100" title="Archivar" onClick={e => { e.stopPropagation(); archiveNotification(n.id); }}>
                                      <Archive className="h-5 w-5" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>Archivar</TooltipContent>
                                </UITooltip>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="archivadas">
                      <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {notifications.filter(n => n.archivada).length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <Bell className="h-16 w-16 mb-4" />
                            <span className="text-lg font-semibold">No hay notificaciones archivadas</span>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {notifications.filter(n => n.archivada).map(n => (
                              <div key={n.id} className={`flex items-start gap-3 rounded-xl bg-gray-50 border border-gray-200 shadow-sm px-4 py-3 relative group transition-all hover:shadow-lg`}>
                                {n.prioridad === 'urgente' ? (
                                  <AlertTriangle className="h-6 w-6 mt-1 text-yellow-500 flex-shrink-0" />
                                ) : (
                                  <CheckCircle className="h-6 w-6 mt-1 text-blue-500 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                  <span className="block font-bold text-gray-900 text-base mb-1">{n.titulo}</span>
                                  <span className="block text-gray-600 text-sm">{n.mensaje}</span>
                                  <span className="block text-xs text-gray-400 mt-1">{formatDate(n.fecha)}</span>
                                </div>
                                <UITooltip>
                                  <TooltipTrigger asChild>
                                    <button className="ml-2 text-gray-400 hover:text-blue-600 transition-colors opacity-80 group-hover:opacity-100" title="Desarchivar" onClick={() => unarchiveNotification(n.id)}>
                                      <Archive className="h-5 w-5" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>Desarchivar</TooltipContent>
                                </UITooltip>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className={`rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 ${metric.cardBg} transition-colors duration-300`}
          >
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
          </motion.div>
        ))}
      </div>

      {/* Contenido principal con tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="mapa">Mapa de Congestión</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {userRole === 'admin' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                 <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Predicción de Congestión</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Line data={congestionData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
          </CardContent>
        </Card>
              <AnomalyDetectionWidget />
            </div>
          )}

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
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Riesgo</th>
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
                        <td className="py-3 px-4">
                          <TooltipProvider>
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <span>{getRiskBadge(request.riesgo || 'bajo')}</span>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <div className="flex items-center gap-2">
                                  <Info className="h-4 w-4 text-blue-500" />
                                  <span>
                                    Nivel de riesgo calculado automáticamente según prioridad, documentos y observaciones.
                                  </span>
                                </div>
                              </TooltipContent>
                            </UITooltip>
                          </TooltipProvider>
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

        <TabsContent value="mapa" className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 via-white to-blue-100 shadow-2xl rounded-3xl border-0 hover:shadow-blue-200 transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-2xl font-extrabold text-blue-800">
                <span className="animate-pulse-slow">
                  <MapPin className="h-7 w-7 text-blue-500 drop-shadow-lg" />
                </span>
                Mapa de Congestión Fronteriza en Tiempo Estimado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-6 w-full justify-center items-stretch">
                <div className="flex-1 min-w-0">
                  <div className="w-full max-w-3xl p-2 rounded-2xl bg-white/80 shadow-lg border border-blue-100" style={{ boxShadow: '0 0 32px 0 rgba(37,99,235,0.10)' }}>
                    <BorderMap />
                  </div>
                </div>
                <div className="flex flex-col gap-4 w-full max-w-xs lg:ml-4">
                  {pasos.map((p, i) => (
                    <div key={i} className={`rounded-2xl shadow border-l-8 p-4 bg-white flex items-center gap-4 ${p.estado === 'Alto' ? 'border-red-500' : p.estado === 'Medio' ? 'border-yellow-400' : 'border-green-500'}`}>
                      <div className="flex-shrink-0">
                        {estadoIcon[p.estado]}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-lg text-gray-800">{p.nombre}</div>
                        <div className="text-sm text-gray-500">Estado: <span style={{ color: estadoColor[p.estado] }} className="font-semibold">{p.estado}</span></div>
                        <div className="text-sm text-gray-700">Tiempo estimado: <span className="font-bold">{p.tiempo} min</span></div>
                        {p.tiempo > 60 && (
                          <div className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1"><AlertTriangle className="h-4 w-4" /> Congestión crítica</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analíticas: tres gráficos/widgets en layout de 1 columna en mobile, 3 en desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
            {/* Widget de tiempos de espera promedio por horario */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Tiempos de Espera Promedio por Horario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Bar data={esperaPorHora} options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { display: false }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: 'Minutos' }
                    }
                  }
                }} height={300} />
              </CardContent>
            </Card>
            {/* Gráfico de torta: distribución de riesgo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Distribución de Riesgo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Pie data={riesgoData} options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: false }
                  }
                }} height={300} />
              </CardContent>
            </Card>
          </div>
          {/* Ranking de Inspectores y Aduaneros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Ranking de Inspectores y Aduaneros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 px-4 font-medium text-gray-900 dark:text-white">Nombre</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-900 dark:text-white">Rol</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-900 dark:text-white">Solicitudes Procesadas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankingInspectores.map((inspector, idx) => (
                      <tr key={inspector.nombre} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 px-4 text-sm text-gray-900 dark:text-white font-semibold">{idx + 1}. {inspector.nombre}</td>
                        <td className="py-2 px-4 text-sm text-gray-600 dark:text-gray-400">{inspector.rol}</td>
                        <td className="py-2 px-4 text-sm text-blue-700 dark:text-blue-300 font-bold">{inspector.solicitudes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
          </div>
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
