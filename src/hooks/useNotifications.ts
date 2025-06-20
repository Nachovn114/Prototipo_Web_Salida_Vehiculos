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
  acciones?: NotificationAction[];
  data?: Record<string, any>;
  expira?: string;
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
}

const STORAGE_KEY = 'frontera_notifications';

const initialNotifications: Notification[] = [
  {
    id: 1,
    tipo: 'aprobacion',
    titulo: 'Solicitud Aprobada',
    mensaje: 'Su solicitud ABCD-12 ha sido aprobada exitosamente',
    fecha: new Date().toISOString(),
    leida: false,
    prioridad: 'alta',
    acciones: [
      { label: 'Ver Detalles', action: () => console.log('Ver detalles'), variant: 'default' },
      { label: 'Descargar PDF', action: () => console.log('Descargar PDF'), variant: 'outline' }
    ]
  },
  {
    id: 2,
    tipo: 'documento',
    titulo: 'Documento Requerido',
    mensaje: 'Falta subir Revisión Técnica para EFGH-34',
    fecha: new Date(Date.now() - 3600000).toISOString(),
    leida: false,
    prioridad: 'media',
    acciones: [
      { label: 'Subir Ahora', action: () => console.log('Subir documento'), variant: 'default' },
      { label: 'Más Tarde', action: () => console.log('Más tarde'), variant: 'secondary' }
    ]
  },
  {
    id: 3,
    tipo: 'sistema',
    titulo: 'Mantenimiento Programado',
    mensaje: 'El sistema estará en mantenimiento el 25/06 de 02:00 a 04:00',
    fecha: new Date(Date.now() - 7200000).toISOString(),
    leida: false,
    prioridad: 'baja',
    expira: new Date(Date.now() + 86400000).toISOString() // Expira en 24h
  },
  {
    id: 4,
    tipo: 'urgente',
    titulo: 'Error de Conexión',
    mensaje: 'Se ha perdido la conexión con el servidor. Los datos se guardarán localmente.',
    fecha: new Date().toISOString(),
    leida: false,
    prioridad: 'urgente',
    acciones: [
      { label: 'Reintentar', action: () => console.log('Reintentar conexión'), variant: 'default' },
      { label: 'Modo Offline', action: () => console.log('Modo offline'), variant: 'outline' }
    ]
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

  // Cargar notificaciones desde localStorage al inicializar
  useEffect(() => {
    const savedNotifications = localStorage.getItem(STORAGE_KEY);
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
        setNotifications(initialNotifications);
      }
    } else {
      setNotifications(initialNotifications);
    }
  }, []);

  // Guardar notificaciones en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

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
    setNotifications(prev => prev.filter(notification => notification.id !== id));
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
    executeAction
  };
};
