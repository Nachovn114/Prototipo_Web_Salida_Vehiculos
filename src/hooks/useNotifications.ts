import { useState, useCallback, useEffect } from 'react';

export type NotificationType = 
  | 'urgente' 
  | 'aprobacion' 
  | 'rechazo' 
  | 'documento' 
  | 'sistema' 
  | 'usuario' 
  | 'warning' 
  | 'error' 
  | 'info';

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
}

export interface Notification {
  id: number;
  tipo: NotificationType;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  archivada?: boolean;
  acciones?: NotificationAction[];
  data?: Record<string, any>;
  expira?: string;
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
}

const STORAGE_KEY = 'frontera_notifications';

const initialNotifications: Notification[] = [
  {
    id: 1,
    tipo: 'urgente',
    titulo: 'Alerta de Congestión',
    mensaje: 'Congestión alta detectada en Paso Los Libertadores. Tiempo estimado de espera: 2 horas.',
    fecha: new Date().toISOString(),
    leida: false,
    prioridad: 'urgente',
    archivada: false
  },
  {
    id: 2,
    tipo: 'aprobacion',
    titulo: 'Solicitud de Cruce Aprobada',
    mensaje: 'La solicitud #2024-123 para el vehículo BZRT-45 ha sido aprobada. Puede presentarse en el control.',
    fecha: new Date(Date.now() - 60000).toISOString(),
    leida: false,
    prioridad: 'alta',
    archivada: false
  },
  {
    id: 3,
    tipo: 'documento',
    titulo: 'Documento Faltante',
    mensaje: 'Falta subir el Seguro Obligatorio para el vehículo KJHG-12.',
    fecha: new Date(Date.now() - 120000).toISOString(),
    leida: false,
    prioridad: 'media',
    archivada: false
  },
  {
    id: 4,
    tipo: 'warning',
    titulo: 'Inspección Vehicular Pendiente',
    mensaje: 'El vehículo FJTR-88 debe presentarse a inspección física antes de las 16:00 hrs.',
    fecha: new Date(Date.now() - 180000).toISOString(),
    leida: false,
    prioridad: 'alta',
    archivada: false
  },
  {
    id: 5,
    tipo: 'info',
    titulo: 'Nuevo Mensaje de Aduana',
    mensaje: 'Recuerde declarar todos los bienes electrónicos al cruzar la frontera.',
    fecha: new Date(Date.now() - 240000).toISOString(),
    leida: false,
    prioridad: 'media',
    archivada: false
  },
  {
    id: 6,
    tipo: 'sistema',
    titulo: 'Mantenimiento Programado',
    mensaje: 'El sistema estará en mantenimiento el 25/06 de 02:00 a 04:00. Planifique su cruce.',
    fecha: new Date(Date.now() - 300000).toISOString(),
    leida: false,
    prioridad: 'baja',
    archivada: false
  },
  {
    id: 7,
    tipo: 'aprobacion',
    titulo: 'Pre-Declaración Recibida',
    mensaje: 'Su pre-declaración para el viaje a Mendoza ha sido recibida correctamente.',
    fecha: new Date(Date.now() - 360000).toISOString(),
    leida: false,
    prioridad: 'media',
    archivada: false
  },
  {
    id: 8,
    tipo: 'error',
    titulo: 'Error en Validación Documental',
    mensaje: 'El archivo de revisión técnica subido está ilegible. Por favor, vuelva a cargarlo.',
    fecha: new Date(Date.now() - 420000).toISOString(),
    leida: false,
    prioridad: 'alta',
    archivada: false
  },
  {
    id: 9,
    tipo: 'info',
    titulo: 'Nuevo Reporte Disponible',
    mensaje: 'Ya puede descargar el reporte de cruces del mes de mayo.',
    fecha: new Date(Date.now() - 480000).toISOString(),
    leida: false,
    prioridad: 'baja',
    archivada: false
  },
  {
    id: 10,
    tipo: 'usuario',
    titulo: 'Actualización de Perfil',
    mensaje: 'Sus datos personales han sido actualizados exitosamente.',
    fecha: new Date(Date.now() - 540000).toISOString(),
    leida: false,
    prioridad: 'baja',
    archivada: false
  },
  {
    id: 11,
    tipo: 'anomaly',
    titulo: 'Anomalía Detectada',
    mensaje: 'Se detectó un patrón inusual en las solicitudes de cruce. Revise el panel de analíticas.',
    fecha: new Date(Date.now() - 600000).toISOString(),
    leida: false,
    prioridad: 'alta',
    archivada: false
  },
  {
    id: 12,
    tipo: 'calidad',
    titulo: 'Encuesta de Satisfacción',
    mensaje: 'Por favor, califique su experiencia en el paso fronterizo Los Libertadores.',
    fecha: new Date(Date.now() - 660000).toISOString(),
    leida: false,
    prioridad: 'media',
    archivada: false
  },
  {
    id: 13,
    tipo: 'info',
    titulo: 'Nuevo Horario de Atención',
    mensaje: 'El horario de atención en Uspallata se extiende hasta las 20:00 hrs.',
    fecha: new Date(Date.now() - 720000).toISOString(),
    leida: false,
    prioridad: 'baja',
    archivada: false
  },
  {
    id: 14,
    tipo: 'warning',
    titulo: 'Condiciones Meteorológicas',
    mensaje: 'Se pronostica nieve en la cordillera. Revise el estado del paso antes de viajar.',
    fecha: new Date(Date.now() - 780000).toISOString(),
    leida: false,
    prioridad: 'alta',
    archivada: false
  },
  {
    id: 15,
    tipo: 'info',
    titulo: 'Solicitud Archivada',
    mensaje: 'La solicitud #2024-099 fue archivada por inactividad.',
    fecha: new Date(Date.now() - 840000).toISOString(),
    leida: true,
    prioridad: 'baja',
    archivada: true
  },
  {
    id: 16,
    tipo: 'urgente',
    titulo: 'Alerta de Seguridad',
    mensaje: 'Se reportó un incidente en el área de control secundario. Siga instrucciones del personal.',
    fecha: new Date(Date.now() - 900000).toISOString(),
    leida: false,
    prioridad: 'urgente',
    archivada: false
  },
  {
    id: 17,
    tipo: 'info',
    titulo: 'Nuevo Mensaje de Inspector',
    mensaje: 'El inspector Rojas ha dejado un comentario en su solicitud.',
    fecha: new Date(Date.now() - 960000).toISOString(),
    leida: false,
    prioridad: 'media',
    archivada: false
  },
  {
    id: 18,
    tipo: 'documento',
    titulo: 'Documento Vencido',
    mensaje: 'El permiso de circulación del vehículo BZRT-45 ha vencido. Actualícelo para continuar.',
    fecha: new Date(Date.now() - 1020000).toISOString(),
    leida: false,
    prioridad: 'alta',
    archivada: false
  },
  {
    id: 19,
    tipo: 'info',
    titulo: 'Recordatorio de Declaración',
    mensaje: 'Recuerde completar la declaración jurada antes de su viaje.',
    fecha: new Date(Date.now() - 1080000).toISOString(),
    leida: false,
    prioridad: 'media',
    archivada: false
  },
  {
    id: 20,
    tipo: 'info',
    titulo: 'Actualización de Sistema',
    mensaje: 'Se han mejorado los tiempos de respuesta en el panel de solicitudes.',
    fecha: new Date(Date.now() - 1140000).toISOString(),
    leida: false,
    prioridad: 'baja',
    archivada: false
  }
];

// Función para reproducir sonido de notificación
const playNotificationSound = (tipo: NotificationType) => {
  try {
    const audio = new Audio();
    switch (tipo) {
      case 'urgente':
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
        break;
      case 'aprobacion':
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
        break;
      default:
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
    }
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Ignorar errores de reproducción
  } catch (error) {
    console.log('No se pudo reproducir el sonido de notificación');
  }
};

// Función para mostrar notificación push del navegador
const showPushNotification = (notification: Notification) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(notification.titulo, {
      body: notification.mensaje,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `notification-${notification.id}`,
      requireInteraction: notification.prioridad === 'urgente',
      silent: true // Usamos nuestro propio sonido
    });
  }
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filters, setFilters] = useState<{
    tipo?: NotificationType;
    leida?: boolean;
    prioridad?: string;
  }>({});

  // Cargar notificaciones de prueba SIEMPRE al inicializar (modo demo)
  useEffect(() => {
    setNotifications(initialNotifications);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialNotifications));
  }, []);

  // Solicitar permisos de notificación push
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Limpiar notificaciones expiradas
  useEffect(() => {
    const now = new Date();
    const hasExpired = notifications.some(n => n.expira && new Date(n.expira) < now);
    
    if (hasExpired) {
      setNotifications(prev => prev.filter(n => !n.expira || new Date(n.expira) > now));
    }
  }, [notifications]);

  const markAsRead = useCallback((id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, leida: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, leida: true }))
    );
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      fecha: new Date().toISOString(),
      leida: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Reproducir sonido y mostrar notificación push
    playNotificationSound(newNotification.tipo);
    showPushNotification(newNotification);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(notification => {
      // No permitir eliminar alertas importantes (urgente o alta)
      if (notification.id === id && (notification.prioridad === 'urgente' || notification.prioridad === 'alta')) {
        return true; // No eliminar
      }
      return notification.id !== id;
    }));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const executeAction = useCallback((notificationId: number, actionIndex: number) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification?.acciones?.[actionIndex]) {
      notification.acciones[actionIndex].action();
      markAsRead(notificationId);
    }
  }, [notifications, markAsRead]);

  const archiveNotification = useCallback((id: number) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === id ? { ...notification, archivada: true } : notification
    ));
  }, []);

  const unarchiveNotification = useCallback((id: number) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === id ? { ...notification, archivada: false } : notification
    ));
  }, []);

  const getNotificationsByFilter = useCallback((filter: 'todas' | 'archivadas') => {
    if (filter === 'archivadas') {
      return notifications.filter(n => n.archivada);
    }
    return notifications.filter(n => !n.archivada);
  }, [notifications]);

  // Filtrar notificaciones
  const filteredNotifications = notifications.filter(notification => {
    if (filters.tipo && notification.tipo !== filters.tipo) return false;
    if (filters.leida !== undefined && notification.leida !== filters.leida) return false;
    if (filters.prioridad && notification.prioridad !== filters.prioridad) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.leida).length;
  const urgentCount = notifications.filter(n => n.prioridad === 'urgente' && !n.leida).length;

  return {
    notifications: filteredNotifications,
    allNotifications: notifications,
    unreadCount,
    urgentCount,
    filters,
    setFilters,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    clearAll,
    executeAction,
    archiveNotification,
    unarchiveNotification,
    getNotificationsByFilter
  };
};
