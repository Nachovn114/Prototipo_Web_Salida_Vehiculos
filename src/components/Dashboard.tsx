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
import { motion, Variants } from 'framer-motion';
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
import { useNavigate } from 'react-router-dom';
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

// Animation variants for the dashboard cards
const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    scale: 0.98 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring" as const,  
      stiffness: 100, 
      damping: 10 
    } 
  }
};

// Datos de métricas
const metrics = [
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
    title: 'Solicitudes Pendientes',
    value: '24',
    trend: 12.5,
    icon: FileText,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    cardBg: 'bg-blue-50',
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
    date: '15/01/2024',
    riesgo: 'bajo' as const
  },
  {
    id: '2024-002',
    driver: 'María González',
    vehicle: 'Ford Ranger 2022',
    status: 'Pendiente',
    date: '15/01/2024',
    riesgo: 'medio' as const
  },
  {
    id: '2024-003',
    driver: 'Carlos Muñoz',
    vehicle: 'Chevrolet S10 2021',
    status: 'Rechazada',
    date: '14/01/2024',
    riesgo: 'alto' as const
  },
  {
    id: '2024-004',
    driver: 'Ana Silva',
    vehicle: 'Nissan Frontier 2023',
    status: 'Aprobada',
    date: '14/01/2024',
    riesgo: 'bajo' as const
  },
  {
    id: '2024-005',
    driver: 'Luis Rojas',
    vehicle: 'Mitsubishi L200 2022',
    status: 'Pendiente',
    date: '14/01/2024',
    riesgo: 'medio' as const
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

// Datos simulados de solicitudes por hora para predicción
const flujoPorHora = [5, 12, 25, 40, 38, 30, 22, 15, 8];
const horas = ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
const maxFlujo = Math.max(...flujoPorHora);
const horaPico = horas[flujoPorHora.indexOf(maxFlujo)];
const prediccionMensaje = maxFlujo > 30
  ? `Se estima alto flujo este viernes entre ${horaPico} y ${horas[flujoPorHora.indexOf(maxFlujo)+1] || ''}`
  : 'No se esperan congestiones significativas en las próximas horas.';

// Generar alertas dinámicas según los datos de predicción
const flujoIA = congestionData.datasets[1].data;
const alertas = flujoIA.map((valor, idx) => {
  if (valor > 50) {
    return {
      tipo: 'critica',
      mensaje: `Flujo vehicular crítico previsto entre ${horas[idx]} y ${horas[idx + 1] || ''}. Priorice inspección rápida.`,
      hora: `${horas[idx]} - ${horas[idx + 1] || ''}`,
      color: 'red',
    };
  } else if (valor > 30) {
    return {
      tipo: 'moderada',
      mensaje: `Se prevé congestión entre ${horas[idx]} y ${horas[idx + 1] || ''}. Refuerce personal en el control.`,
      hora: `${horas[idx]} - ${horas[idx + 1] || ''}`,
      color: 'yellow',
    };
  }
  return null;
}).filter(Boolean);

// Limitar la cantidad de alertas a máximo 3, priorizando las críticas
const alertasOrdenadas = [
  ...alertas.filter(a => a.tipo === 'critica'),
  ...alertas.filter(a => a.tipo === 'moderada')
];

// Limitar el total de tarjetas (predicción + alertas) a 3
const mostrarPrediccion = !!prediccionMensaje;
const alertasMostradas = mostrarPrediccion ? alertasOrdenadas.slice(0, 2) : alertasOrdenadas.slice(0, 3);

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

// Widget compacto de predicción de flujo
const WidgetPrediccionFlujo = () => (
  <div className="rounded-xl bg-gradient-to-r from-yellow-50 to-blue-50 border-l-4 border-yellow-400 shadow flex items-center gap-2 px-4 py-2">
    <AlertTriangle className="h-5 w-5 text-yellow-500 animate-bounce" />
    <div>
      <div className="text-xs font-bold text-yellow-800">Flujo Vehicular</div>
      <div className="text-xs text-gray-700 font-semibold leading-tight">{prediccionMensaje}</div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notificationTab, setNotificationTab] = React.useState<'todas' | 'urgentes' | 'archivadas'>('todas');
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    unarchiveNotification,
  } = useNotifications();

  // Use notifications from the hook instead of local state
  const notificacionesNoArchivadas = notifications.filter(n => !n.archivada).length;

  const navigate = useNavigate();

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
          const notificationId = Date.now(); // o anomaly.id si está disponible
          archiveNotification(notificationId);
        }
      });
    });
  }, []);

  const filteredNotifications = React.useMemo(() => {
    return notifications.filter(notification => {
      if (notification.archivada) return false;
      if (notificationTab === 'urgentes') {
        return notification.prioridad === 'urgente' || notification.prioridad === 'alta';
      }
      return true;
    });
  }, [notifications, notificationTab]);

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
              aria-label="Notificaciones"
              aria-haspopup="dialog"
              aria-expanded={showNotifications}
              aria-controls="notifications-dialog"
            >
              <Bell className="h-6 w-6 text-gray-700 dark:text-gray-200" aria-hidden="true" />
              {notificacionesNoArchivadas > 0 && (
                <span className="absolute -top-2 -right-2 h-7 w-7 bg-red-500 text-white text-base font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-bounce z-10">
                  <span className="sr-only">{notificacionesNoArchivadas} notificaciones sin leer</span>
                  <span aria-hidden="true">{notificacionesNoArchivadas}</span>
                </span>
              )}
              <span className="sr-only">, {notificacionesNoArchivadas > 0 ? `${notificacionesNoArchivadas} sin leer` : 'sin notificaciones nuevas'}</span>
            </button>
            <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
              <DialogContent 
                className="max-w-2xl w-full p-0 rounded-2xl"
                id="notifications-dialog"
                role="dialog"
                aria-labelledby="notifications-dialog-title"
                aria-describedby="notifications-dialog-desc"
              >
                <DialogHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-2 border-b">
                  <DialogTitle id="notifications-dialog-title" className="text-2xl font-bold">
                    Notificaciones
                    {notifications.length > 0 && (
                      <span className="sr-only">, {notifications.length} notificaciones</span>
                    )}
                  </DialogTitle>
                  <button 
                    className="text-blue-700 text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 px-2 py-1 rounded"
                    onClick={() => markAllAsRead()}
                    aria-label="Marcar todas las notificaciones como leídas"
                  >
                    Marcar todas como leídas
                  </button>
                </DialogHeader>
                <p id="notifications-dialog-desc" className="sr-only">Lista de notificaciones del sistema</p>
                <div className="px-6 pt-4 pb-2">
                  <Tabs 
                    value={notificationTab} 
                    onValueChange={value => setNotificationTab(value as 'todas' | 'urgentes' | 'archivadas')} 
                    className="w-full"
                    aria-label="Filtrar notificaciones"
                  >
                    <TabsList className="mb-4" role="tablist">
                      <TabsTrigger value="todas" role="tab" aria-selected={notificationTab === 'todas'}>
                        Todas
                        <span className="sr-only">, ver todas las notificaciones</span>
                      </TabsTrigger>
                      <TabsTrigger value="urgentes" role="tab" aria-selected={notificationTab === 'urgentes'}> 
                        Urgentes
                        <span className="sr-only">, ver solo notificaciones urgentes</span>
                      </TabsTrigger>
                      <TabsTrigger value="archivadas" role="tab" aria-selected={notificationTab === 'archivadas'}>
                        Archivadas
                        <span className="sr-only">, ver notificaciones archivadas</span>
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="todas">
                      <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar space-y-6">
                        {/* Agrupa por prioridad */}
                        {['urgente', 'alta', 'media', 'baja'].map(prio => (
                          <div key={prio} className="space-y-3">
                            {filteredNotifications.filter(n => n.prioridad === prio).length > 0 && (
                              <div className="text-xs font-bold text-blue-700 uppercase mb-1 mt-2">{prio === 'urgente' ? 'Urgentes' : prio.charAt(0).toUpperCase() + prio.slice(1)}</div>
                            )}
                            {filteredNotifications.filter(n => n.prioridad === prio).map(n => (
                              <div 
                                key={n.id} 
                                className={`flex items-start gap-4 rounded-2xl p-4 shadow border-l-8 ${
                                  prio === 'urgente' ? 'bg-red-50 border-red-500' :
                                  prio === 'alta' ? 'bg-yellow-50 border-yellow-500' :
                                  prio === 'media' ? 'bg-blue-50 border-blue-400' :
                                  'bg-gray-50 border-gray-200'} animate-pulse-slow relative`}
                                role="article"
                                aria-labelledby={`notification-${n.id}-title`}
                                aria-describedby={`notification-${n.id}-desc`}
                              >
                              <div className="flex-shrink-0">
                                {prio === 'urgente' ? (
                                  <AlertTriangle className="h-7 w-7 text-red-500" aria-hidden="true" />
                                ) : prio === 'alta' ? (
                                  <AlertTriangle className="h-7 w-7 text-yellow-500" aria-hidden="true" />
                                ) : prio === 'media' ? (
                                  <Info className="h-7 w-7 text-blue-500" aria-hidden="true" />
                                ) : (
                                  <Bell className="h-7 w-7 text-gray-400" aria-hidden="true" />
                                )}
                                <span className="sr-only">
                                  {prio === 'urgente' ? 'Urgente: ' : 
                                   prio === 'alta' ? 'Alta prioridad: ' : 
                                   prio === 'media' ? 'Media prioridad: ' : ''}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 id={`notification-${n.id}-title`} className="block font-bold text-base mb-1 text-gray-900">
                                  {n.titulo}
                                </h3>
                                <p id={`notification-${n.id}-desc`} className="block text-gray-700 text-sm mb-1">
                                  {n.mensaje}
                                </p>
                                <time dateTime={new Date(n.fecha).toISOString()} className="block text-xs text-gray-500 mt-1">
                                  {formatDate(n.fecha)}
                                </time>
                              </div>
                              <div className="flex flex-col gap-2 items-end">
                                {!n.leida && (
                                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" aria-label="No leída">
                                    <span className="sr-only">No leída</span>
                                  </span>
                                )}
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  onClick={() => markAsRead(n.id)}
                                  aria-label={`Marcar '${n.titulo}' como leída`}
                                >
                                  <CheckCircle className="h-5 w-5 text-green-600" aria-hidden="true" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  onClick={() => archiveNotification(n.id)}
                                  aria-label={`Archivar notificación '${n.titulo}'`}
                                >
                                  <Archive className="h-5 w-5 text-gray-500" aria-hidden="true" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          </div>
                        ))}
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
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className={`rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 h-full ${metric.cardBg} transition-colors duration-300 flex flex-col justify-between`}
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
      </div>

      {/* Contenido principal con tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="mapa">Mapa de Congestión</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Gráficos y estadísticas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna izquierda: Estado + Predicción */}
            <div className="flex flex-col gap-6">
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
              {/* Tarjeta de predicción de flujo vehicular y alertas inteligentes */}
              <div className="max-w-3xl mx-auto mb-6">
                {/* Predicción */}
                <div className="rounded-xl bg-gradient-to-r from-yellow-50 to-blue-50 border-l-4 border-yellow-400 shadow flex items-center gap-2 px-4 py-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-500 animate-bounce" />
                  <div>
                    <div className="text-sm font-bold text-yellow-800">Predicción de Flujo Vehicular</div>
                    <div className="text-sm text-gray-700 font-semibold leading-tight">{prediccionMensaje}</div>
                  </div>
                </div>
                {/* Línea divisoria sutil */}
                {alertasMostradas.length > 0 && <div className="my-3 border-t border-gray-200" />}
                {/* Alertas inteligentes */}
                <div className="space-y-3">
                  {alertasMostradas.map((alerta, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl shadow flex items-center gap-2 px-4 py-3 ${
                        alerta.tipo === 'critica'
                          ? 'bg-red-50 border-l-4 border-red-500 animate-pulse'
                          : 'bg-yellow-50 border-l-4 border-yellow-400 animate-pulse-slow'
                      }`}
                    >
                      <AlertTriangle className={`h-5 w-5 ${alerta.tipo === 'critica' ? 'text-red-500' : 'text-yellow-500'}`} />
                      <div>
                        <div className={`text-sm font-bold ${alerta.tipo === 'critica' ? 'text-red-800' : 'text-yellow-800'}`}>{
                          alerta.tipo === 'critica' ? 'Alerta Crítica: Congestión Alta' : 'Alerta: Congestión Moderada'
                        }</div>
                        <div className="text-sm text-gray-700 font-semibold">{alerta.mensaje}</div>
                      </div>
                      {alerta.tipo === 'critica' && (
                        <Button className="ml-auto" size="sm" variant="destructive">Notificar equipo</Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Columna derecha: Actividad Reciente */}
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
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/solicitud/${request.id}`)}>
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

        <TabsContent value="analytics" className="space-y-10">
          {/* Analíticas: dos filas, dos columnas en desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gráfico de flujo de solicitudes por día/hora */}
            <Card className="bg-white shadow-lg rounded-2xl p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-blue-900">
                  <BarChart3 className="h-6 w-6 text-blue-600" /> Flujo de Solicitudes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Bar data={congestionData} options={{ maintainAspectRatio: false, responsive: true }} height={300} />
              </CardContent>
            </Card>
            {/* Gráfico de torta: distribución de riesgo */}
            <Card className="bg-white shadow-lg rounded-2xl p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-blue-900">
                  <Activity className="h-6 w-6 text-yellow-600" /> Distribución de Riesgo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Pie data={riesgoData} options={{ maintainAspectRatio: false, responsive: true, plugins: { legend: { position: 'top' } } }} height={300} />
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gráfico de barras: tiempos de espera promedio */}
            <Card className="bg-white shadow-lg rounded-2xl p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-blue-900">
                  <Clock className="h-6 w-6 text-blue-600" /> Tiempos de Espera Promedio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Bar data={esperaPorHora} options={{ maintainAspectRatio: false, responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, title: { display: true, text: 'Minutos' } } } }} height={300} />
              </CardContent>
            </Card>
            {/* Ranking de Inspectores y Aduaneros */}
            <Card className="bg-white shadow-lg rounded-2xl p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-blue-900">
                  <Users className="h-6 w-6 text-blue-600" /> Ranking de Inspectores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-4 font-semibold text-blue-900">Nombre</th>
                        <th className="text-left py-2 px-4 font-semibold text-blue-900">Rol</th>
                        <th className="text-left py-2 px-4 font-semibold text-blue-900">Solicitudes Procesadas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rankingInspectores.map((inspector, idx) => (
                        <tr key={inspector.nombre} className="border-b border-gray-100">
                          <td className="py-2 px-4 text-sm text-gray-900 font-semibold">{idx + 1}. {inspector.nombre}</td>
                          <td className="py-2 px-4 text-sm text-gray-600">{inspector.rol}</td>
                          <td className="py-2 px-4 text-sm text-blue-700 font-bold">{inspector.solicitudes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
